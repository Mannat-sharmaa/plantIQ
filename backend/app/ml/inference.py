"""
PyTorch Model Inference Service
Executes feed-forward prediction, softmax calculation, real confidence extraction,
and unsupported plant detection.
"""

import os
import torch
from typing import Dict, Any, List
from app.ml.labels import CLASS_LABELS, SUPPORTED_PLANTS, get_class_info, is_plant_supported
from app.ml.preprocessing import preprocess_image_tensor
from app.ml.model_loader import load_trained_model, get_model_metadata

CONFIDENCE_UNSUPPORTED_THRESHOLD = 0.50

def run_model_inference(image_path: str) -> Dict[str, Any]:
    """
    Executes actual PyTorch model inference on the provided image.
    Never returns fake or mock predictions.
    
    Returns:
        Structured prediction dictionary with real confidence and label metadata.
    """
    filename = os.path.basename(image_path)
    
    # 1. Preprocess Image
    input_tensor, img_meta = preprocess_image_tensor(image_path)
    print(f"[SCAN] Image received: {filename}")
    print(f"[SCAN] Image size: {img_meta['size_bytes']} bytes")
    print(f"[SCAN] Image dimensions: {img_meta['width']}x{img_meta['height']}")
    print(f"[SCAN] Preprocessing completed: tensor {img_meta['tensor_shape']}")

    # 2. Load Trained Model
    model, model_meta = load_trained_model()
    print(f"[SCAN] Model loaded: {model_meta.get('model_name')}")
    print(f"[SCAN] Model version: {model_meta.get('version')}")

    # 3. Model Availability Check (Section 6)
    if model is None or not model_meta.get("is_configured", False):
        print(f"[SCAN] Inference aborted: {model_meta.get('message')}")
        return {
            "status": "model_unavailable",
            "message": "A trained inference model is not configured. Connect a trained Plant Disease Classification model to enable real inference.",
            "plant": "Unknown / Not configured",
            "scientific_name": None,
            "disease": "Model Not Configured",
            "pathogen": "None",
            "confidence": 0.0,
            "confidence_level": "Low",
            "top_predictions": [],
            "is_supported": False,
            "model_status": model_meta
        }

    # 4. Perform Feed-Forward Inference
    with torch.no_grad():
        logits = model(input_tensor)
        probabilities = torch.softmax(logits, dim=1)[0]  # Shape: (38,)

    # 5. Extract Real Top Predictions
    top_k_count = min(4, len(probabilities))
    top_values, top_indices = torch.topk(probabilities, k=top_k_count)

    primary_idx = int(top_indices[0].item())
    primary_confidence = round(float(top_values[0].item()), 4)

    primary_info = get_class_info(primary_idx)
    primary_plant = primary_info["plant"]
    primary_disease = primary_info["disease"]
    primary_pathogen = primary_info["pathogen"]
    is_healthy = primary_info["healthy"]

    top_predictions: List[Dict[str, Any]] = []
    for val, idx in zip(top_values, top_indices):
        c_info = get_class_info(int(idx.item()))
        label_text = f"{c_info['plant']} — {c_info['disease']}"
        top_predictions.append({
            "label": label_text,
            "confidence": round(float(val.item()), 4)
        })

    print(f"[SCAN] Inference completed")
    print(f"[SCAN] Predicted raw class [{primary_idx}]: {primary_plant} — {primary_disease}")
    print(f"[SCAN] Real Model Confidence: {primary_confidence:.4f}")

    # 6. Out-of-Domain & Real Botanical Species Recognition (Pl@ntNet 30,000+ Species & Extended Crops)
    if primary_confidence < CONFIDENCE_UNSUPPORTED_THRESHOLD:
        print(f"[SCAN] Evaluating specimen with Pl@ntNet Botanical Intelligence API...")
        try:
            from app.services.plantnet_service import query_plantnet_identification
            plantnet_res = query_plantnet_identification(image_path)
            if plantnet_res:
                print(f"[SCAN] Pl@ntNet identified: {plantnet_res['plant']} ({plantnet_res['scientific_name']}) — {plantnet_res['disease']}")
                return {
                    "status": "success",
                    "message": f"Botanical identification completed: {plantnet_res['plant']}.",
                    "plant": plantnet_res["plant"],
                    "scientific_name": plantnet_res["scientific_name"],
                    "disease": plantnet_res["disease"],
                    "pathogen": plantnet_res["pathogen"],
                    "confidence": plantnet_res["confidence"],
                    "confidence_level": plantnet_res["confidence_level"],
                    "top_predictions": plantnet_res["top_predictions"],
                    "is_supported": True,
                    "is_healthy": plantnet_res["is_healthy"],
                    "model_status": {
                        **model_meta,
                        "model_name": "Pl@ntNet Botanical Vision + MobileNetV3",
                        "inference_type": "Pl@ntNet 30,000+ Species & Foliar Health Suite",
                        "mode": "production"
                    }
                }
        except Exception as p_err:
            print(f"[SCAN] Pl@ntNet lookup bypassed: {p_err}")

        # Botanical morphological & visual fallback
        print(f"[SCAN] Evaluating secondary botanical morphology fallback...")
        from app.ml.botanical_classifier import analyze_extended_botanical_crop
        botanical_res = analyze_extended_botanical_crop(image_path)
        if botanical_res and botanical_res.get("is_botanical_match"):
            print(f"[SCAN] Extended botanical match identified: {botanical_res['plant']} — {botanical_res['disease']} ({botanical_res['confidence']*100:.1f}%)")
            return {
                "status": "success",
                "message": f"Botanical identification completed: {botanical_res['plant']}.",
                "plant": botanical_res["plant"],
                "scientific_name": botanical_res["scientific_name"],
                "disease": botanical_res["disease"],
                "pathogen": botanical_res["pathogen"],
                "confidence": botanical_res["confidence"],
                "confidence_level": botanical_res["confidence_level"],
                "top_predictions": botanical_res["top_predictions"],
                "is_supported": True,
                "is_healthy": botanical_res["is_healthy"],
                "model_status": {
                    **model_meta,
                    "model_name": "MobileNetV3 + Botanical-CV Suite",
                    "inference_type": "Multi-Crop Botanical & PyTorch Inference",
                    "mode": "production"
                }
            }

        # Truly unsupported or ambiguous specimen (< 50% threshold and no botanical match)
        print(f"[SCAN] Specimen evaluated as Low-Confidence / Unsupported Plant (< {CONFIDENCE_UNSUPPORTED_THRESHOLD*100}% threshold)")
        return {
            "status": "unsupported_or_low_confidence",
            "message": "Plant species not supported or confidence below threshold. Please upload a supported crop specimen (e.g., Guava, Tomato, Potato, Pepper, Apple, Corn, Grape).",
            "plant": "Unknown / Not supported",
            "scientific_name": "Out of training domain",
            "disease": "Plant/species not supported by current model",
            "pathogen": "Unconfirmed taxonomy",
            "confidence": primary_confidence,
            "confidence_level": "Low",
            "top_predictions": top_predictions,
            "is_supported": False,
            "is_healthy": False,
            "model_status": model_meta
        }

    # 7. Confident Supported Prediction
    confidence_level = "Normal" if primary_confidence >= 0.80 else "Moderate"

    return {
        "status": "success",
        "message": "Model inference completed successfully.",
        "plant": primary_plant,
        "scientific_name": f"{primary_plant} specimen",
        "disease": primary_disease,
        "pathogen": primary_pathogen,
        "confidence": primary_confidence,
        "confidence_level": confidence_level,
        "top_predictions": top_predictions,
        "is_supported": True,
        "is_healthy": is_healthy,
        "model_status": model_meta
    }
