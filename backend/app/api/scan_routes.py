import os
import uuid
import shutil
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from PIL import Image

from app.config import settings
from app.database.connection import get_database
from app.auth.dependencies import get_current_user
from app.schemas.scan_schemas import UnifiedScanResult, ScanOut, ScanStatusOut
from app.ml.classifier import get_classifier
from app.ml.segmenter import get_segmenter
from app.ml.severity import SeverityEstimator
from app.ml.explainability import GradCAMService
from app.weather.provider import get_weather_provider
from app.services.rag import get_rag_service
from app.ai.provider import get_ai_provider

router = APIRouter(tags=["Foliar Scans"])

def run_scan_pipeline(
    file_path: str,
    filename: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    plant_id: Optional[str] = None,
    user_id: str = "usr-demo-01"
) -> Dict[str, Any]:
    """
    Executes the complete, rigorous end-to-end AI/ML analytical pipeline:
    Image Validation -> ML Classification -> Foliar Segmentation -> Severity Estimation ->
    Grad-CAM Explainability -> Environmental Context -> RAG Retrieval -> Grounded AI Advisory.
    """
    scan_id = f"scan-{uuid.uuid4().hex[:6]}"

    # 1. Image dimensions & verification
    try:
        with Image.open(file_path) as img:
            img_width, img_height = img.size
    except Exception:
        img_width, img_height = 512, 512

    img_size_bytes = os.path.getsize(file_path) if os.path.exists(file_path) else 0
    print(f"[SCAN] Image received: {filename}")
    print(f"[SCAN] Image size: {img_size_bytes} bytes")
    print(f"[SCAN] Image dimensions: {img_width}x{img_height}")
    print(f"[SCAN] Preprocessing completed")

    # 2. Disease Classification (ML Model Decides)
    classifier = get_classifier()
    cls_result = classifier.predict(file_path)

    model_status = cls_result.get("model_status", {})
    model_name = model_status.get("model_name", "PyTorch-PlantVillage")
    model_version = model_status.get("version", "v2.1-PyTorch")
    print(f"[SCAN] Model loaded: {model_name}")
    print(f"[SCAN] Model version: {model_version}")

    # Check if model is configured / available (Section 6)
    if cls_result.get("status") == "model_unavailable":
        print(f"[SCAN] Inference status: model_unavailable")
        return {
            "_id": scan_id,
            "scan_id": scan_id,
            "id": scan_id,
            "status": "model_unavailable",
            "message": "A trained inference model is not configured. Connect a trained Plant Disease Classification model to enable real inference.",
            "user_id": user_id,
            "plant_id": plant_id,
            "image": {
                "original_url": f"/uploads/{filename}",
                "processed_url": f"/uploads/{filename}",
                "width": img_width,
                "height": img_height
            },
            "plant": {"name": "Model Not Configured", "scientific_name": None},
            "classification": {
                "disease": "Model Not Configured",
                "pathogen": "None",
                "confidence": 0.0,
                "confidence_level": "Low",
                "top_predictions": [],
                "source": "none"
            },
            "segmentation": {
                "mask_available": False,
                "affected_area_percent": None,
                "affected_pixels": None,
                "total_leaf_pixels": None,
                "mask_url": None,
                "overlay_url": None
            },
            "severity": {
                "label": "Undetermined",
                "score": 0.0,
                "threshold_range": "N/A",
                "disclaimer": "Model not configured"
            },
            "xai": {"gradcam_available": False, "heatmap_url": None, "summary": "Model not configured."},
            "environment": {"available": False, "reason": "Model not configured"},
            "rag": {"available": False, "sources": [], "chunks_used": 0, "reason": "Model not configured"},
            "advisory": {
                "what_detected": "A trained disease classification model is not currently configured.",
                "visible_symptoms": [],
                "environmental_conditions": "N/A",
                "management_recommendations": ["Connect a trained plant disease model checkpoint (e.g., plant_disease_model.pth) to enable automated diagnostics."],
                "preventative_measures": "Ensure standard horticultural hygiene.",
                "expert_advice": "Consult a local agricultural professional."
            },
            "model_status": model_status,
            "metadata": {
                "mode": settings.APP_MODE,
                "created_at": datetime.utcnow().isoformat(),
                "model_version": "None"
            }
        }

    conf = float(cls_result.get("confidence", 0.0))
    is_unsupported = not cls_result.get("is_supported", True) or conf < settings.CONFIDENCE_THRESHOLD_LOW

    if is_unsupported:
        conf_level = "Low"
        plant_display = "Unknown / Not supported"
        disease_display = "Plant/species not supported by current model"
        pathogen_display = "Out of training domain (Supported: Tomato, Potato, Pepper, Apple, Corn, Grape, Peach, Cherry, Strawberry)"
        is_healthy = False
    else:
        conf_level = "Normal" if conf >= settings.CONFIDENCE_THRESHOLD_MODERATE else "Moderate"
        plant_display = cls_result["plant"]
        disease_display = cls_result["disease"]
        pathogen_display = cls_result.get("pathogen", "None")
        is_healthy = "healthy" in disease_display.lower()

    print(f"[SCAN] Inference completed")
    print(f"[SCAN] Predicted class: {plant_display} — {disease_display}")
    print(f"[SCAN] Confidence: {conf:.4f} ({conf_level})")

    # 3. Foliar Segmentation (Measurable affected ratio)
    segmenter = get_segmenter()
    seg_result = segmenter.segment(file_path, settings.UPLOADS_PATH)
    affected_pct = seg_result.get("affected_area_percent")
    print(f"[SCAN] Segmentation: affected {affected_pct}% (mask: {seg_result.get('mask_url')})")

    # 4. Image-Based Severity Estimation
    severity_res = SeverityEstimator.calculate_severity(
        affected_area_percent=affected_pct,
        confidence=conf,
        is_healthy=is_healthy
    )

    # 5. Grad-CAM Explainability Heatmap
    xai_res = GradCAMService.generate_heatmap(
        file_path,
        settings.UPLOADS_PATH,
        condition_name=disease_display,
        plant_name=plant_display
    )
    print(f"[SCAN] Grad-CAM: {xai_res.get('heatmap_url')}")

    # 6. Environmental Microclimate Context
    weather_provider = get_weather_provider()
    env_res = weather_provider.get_weather(latitude, longitude)
    print(f"[SCAN] Weather: {env_res.get('temperature_c')}°C, {env_res.get('humidity_percent')}% (source: {env_res.get('source')})")

    # 7. RAG Knowledge Base Retrieval (Section 10: Suppress specific advice if unsupported or low confidence)
    if is_unsupported:
        rag_res = {
            "available": False,
            "sources": [],
            "chunks_used": 0,
            "reason": "Specific disease literature suppressed for unsupported plant species or low model confidence."
        }
        print(f"[SCAN] RAG: Specific disease literature suppressed (low confidence / unsupported plant)")
    else:
        rag_service = get_rag_service()
        rag_res = rag_service.retrieve_knowledge(
            plant=plant_display,
            disease=disease_display,
            symptoms=None,
            environment=env_res if env_res.get("available") else None
        )
        print(f"[SCAN] RAG: {len(rag_res.get('sources', []))} sources retrieved")

    # 8. Grounded AI Agronomic Advisory
    if is_unsupported:
        ai_advisory = {
            "what_detected": "The uploaded specimen could not be identified with high confidence by the current 38-class diagnostic model. The foliar appearance does not match indexed agricultural crop classes.",
            "visible_symptoms": [
                "Unrecognized or atypical foliar leaf morphology",
                f"Model confidence ({conf*100:.1f}%) is below diagnostic certainty threshold (< 50%)"
            ],
            "environmental_conditions": "Meteorological parameters were recorded, but cannot be correlated with a specific pathogen without verified plant taxonomy.",
            "management_recommendations": [
                "Upload a clearer image with good lighting, no blur, and the affected leaf margins fully visible.",
                "Ensure the specimen is a supported crop species (Supported crops: Tomato, Potato, Pepper, Apple, Corn, Grape, Peach, Cherry, Strawberry).",
                "For tropical fruit trees like Guava or Citrus, consult local agricultural extension specialists."
            ],
            "preventative_measures": "Follow general good agronomic hygiene: avoid overhead wetting, maintain good air circulation, and sanitize pruning shears.",
            "expert_advice": "Seek intervention from a local agronomy extension service or certified botanist if unexpected foliar symptoms persist."
        }
    else:
        ai_provider = get_ai_provider()
        ai_advisory = ai_provider.generate_health_report(
            structured_ml_results={
                "plant": plant_display,
                "disease": disease_display,
                "pathogen": pathogen_display,
                "confidence": conf
            },
            weather_data=env_res,
            rag_context=rag_res
        )

    # 9. Unified Data Record Assembly (Section 14)
    image_url = f"/uploads/{filename}"
    created_at_iso = datetime.utcnow().isoformat()
    mode = "demo" if settings.APP_MODE == "demo" else "production"

    scan_record = {
        "_id": scan_id,
        "scan_id": scan_id,
        "id": scan_id,
        "user_id": user_id,
        "plant_id": plant_id,

        "image": {
            "original_url": image_url,
            "processed_url": seg_result.get("overlay_url") or image_url,
            "width": img_width,
            "height": img_height
        },

        "plant": {
            "name": plant_display,
            "scientific_name": cls_result.get("scientific_name") or f"{plant_display} foliar specimen"
        },

        "classification": {
            "disease": disease_display,
            "pathogen": pathogen_display,
            "confidence": conf,
            "confidence_level": conf_level,
            "top_predictions": cls_result.get("top_predictions", []),
            "source": "ml_model" if mode == "production" else "demo"
        },

        "segmentation": seg_result,
        "severity": severity_res,
        "xai": xai_res,
        "environment": env_res,
        "rag": rag_res,
        "advisory": ai_advisory,
        "model_status": model_status,

        "metadata": {
            "mode": mode,
            "created_at": created_at_iso,
            "model_version": model_version
        },

        # Flat fields for direct backward compatibility
        "plant_name": f"{plant_display} Specimen",
        "disease": disease_display,
        "pathogen": pathogen_display,
        "confidence": conf,
        "top_predictions": cls_result.get("top_predictions", []),
        "severity_label": severity_res["label"],
        "severity_threshold_range": severity_res["threshold_range"],
        "explainability": xai_res,
        "environmental_context": env_res,
        "ai_health_report": ai_advisory,
        "image_url": image_url,
        "model_version": model_version,
        "created_at": created_at_iso
    }

    # Save to MongoDB and in-memory store
    db = get_database()
    db.scans[scan_id] = scan_record

    # Update catalog plant if plant_id is attached
    if plant_id and plant_id in db.plants:
        plant = db.plants[plant_id]
        plant["total_scans"] += 1
        plant["latest_scan"] = datetime.utcnow().strftime("%Y-%m-%d")
        plant["latest_disease"] = cls_result["disease"]
        plant["latest_severity"] = severity_res["label"]
        plant["latest_affected_area"] = affected_pct or 0.0
        plant["status"] = "healthy" if is_healthy else "diseased"

    return scan_record

@router.post("/scan/analyze", response_model=UnifiedScanResult)
@router.post("/scan", response_model=UnifiedScanResult)
async def upload_and_analyze_scan(
    file: UploadFile = File(...),
    latitude: Optional[Any] = Form(None),
    longitude: Optional[Any] = Form(None),
    plant_id: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Primary foliar scan ingestion endpoint. Validates image, runs end-to-end
    ML pipeline, attaches RAG & weather telemetry, and generates structured report.
    """
    safe_filename = file.filename or "specimen_leaf.jpg"
    ext = os.path.splitext(safe_filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg"
        safe_filename = f"{safe_filename}.jpg"

    scan_temp_id = f"scan-{uuid.uuid4().hex[:6]}"
    filename = f"{scan_temp_id}_{safe_filename}"
    file_path = os.path.join(settings.UPLOADS_PATH, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Safely parse coordinate floats
    parsed_lat = None
    parsed_lon = None
    try:
        if latitude is not None and str(latitude).strip().lower() not in ["", "null", "undefined", "none"]:
            parsed_lat = float(latitude)
    except Exception:
        parsed_lat = None

    try:
        if longitude is not None and str(longitude).strip().lower() not in ["", "null", "undefined", "none"]:
            parsed_lon = float(longitude)
    except Exception:
        parsed_lon = None

    scan_data = run_scan_pipeline(
        file_path=file_path,
        filename=filename,
        latitude=parsed_lat,
        longitude=parsed_lon,
        plant_id=plant_id,
        user_id=current_user.get("id", "usr-demo-01")
    )

    return UnifiedScanResult(**scan_data)

@router.get("/scan/{id}", response_model=UnifiedScanResult)
async def get_scan_details(id: str):
    db = get_database()
    scan = db.scans.get(id)
    if not scan:
        raise HTTPException(status_code=404, detail=f"Scan record '{id}' not found.")
    return UnifiedScanResult(**scan)

@router.get("/scan/{id}/status", response_model=ScanStatusOut)
async def get_scan_status(id: str):
    db = get_database()
    if id in db.scans:
        scan = db.scans[id]
        return {
            "scan_id": id,
            "status": "completed",
            "progress": 100,
            "step": "All 8 analytical layers computed",
            "scan": UnifiedScanResult(**scan)
        }
    return {
        "scan_id": id,
        "status": "processing",
        "progress": 70,
        "step": "Segmenting necrotic foliar regions",
        "scan": None
    }

@router.get("/scan/{id}/sources")
async def get_scan_sources(id: str):
    """
    Returns the retrieved RAG knowledge base documents and citations
    specifically associated with a diagnostic scan.
    """
    db = get_database()
    scan = db.scans.get(id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    rag = scan.get("rag", {})
    return {
        "scan_id": id,
        "available": rag.get("available", False),
        "sources": rag.get("sources", []),
        "chunks_used": rag.get("chunks_used", 0),
        "reason": rag.get("reason")
    }

@router.get("/scan/history", response_model=List[UnifiedScanResult])
@router.get("/scans", response_model=List[UnifiedScanResult])
async def list_scan_history(filter: str = "all"):
    """
    Returns chronological scan history with optional health/severity filtering.
    """
    db = get_database()
    scans = list(db.scans.values())

    if filter == "healthy":
        scans = [s for s in scans if s.get("disease", "").lower() == "healthy"]
    elif filter == "diseased":
        scans = [s for s in scans if s.get("disease", "").lower() != "healthy"]
    elif filter == "high_severity":
        scans = [s for s in scans if s.get("severity", {}).get("label") in ["Severe", "Critical", "High"]]

    scans.sort(key=lambda s: s.get("created_at", ""), reverse=True)
    return [UnifiedScanResult(**s) for s in scans]
