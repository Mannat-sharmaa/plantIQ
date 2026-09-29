from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
class TopPrediction(BaseModel):
    label: str
    confidence: float
    description: Optional[str] = None
class ImageMeta(BaseModel):
    original_url: str
    processed_url: Optional[str] = None
    width: Optional[int] = 512
    height: Optional[int] = 512

class PlantMeta(BaseModel):
    name: str
    scientific_name: Optional[str] = None

class BotanicalCitation(BaseModel):
    source: str
    url: Optional[str] = None

class CandidateSpecies(BaseModel):
    common_name: Optional[str] = None
    scientific_name: str
    family: Optional[str] = None
    score: float
    label: Optional[str] = None

class BotanicalInfo(BaseModel):
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    family: Optional[str] = None
    order: Optional[str] = None
    growth_habit: Optional[str] = None
    foliar_morphology: Optional[str] = None
    native_distribution: Optional[str] = None
    economic_importance: Optional[str] = None
    citations: List[BotanicalCitation] = []
    source: Optional[str] = None

class BotanicalIdentification(BaseModel):
    identified: bool = True
    plant: str
    common_name: str
    scientific_name: str
    family: Optional[str] = None
    order: Optional[str] = None
    score: float  # Pl@ntNet API identification score (0.0 to 1.0)
    candidate_species: List[CandidateSpecies] = []
    botanical_info: Optional[BotanicalInfo] = None
    source: str = "plantnet_api"
    source_title: str = "Pl@ntNet Global Biodiversity Database (30,000+ Species)"

class DiseaseDiagnosticResult(BaseModel):
    is_supported: bool = True
    status: str = "diagnosed"  # diagnosed | unavailable | model_unavailable
    disease: str
    pathogen: Optional[str] = None
    confidence: Optional[float] = None  # Disease-model probability
    confidence_level: Optional[str] = "Normal"
    top_predictions: List[TopPrediction] = []
    message: Optional[str] = None
    model_name: Optional[str] = "PyTorch MobileNetV3 (PlantVillage 38 Classes)"
    supported_crops: List[str] = [
        "Apple", "Blueberry", "Cherry", "Corn (Maize)", "Grape", "Orange",
        "Peach", "Pepper (Bell)", "Potato", "Raspberry", "Soybean", "Squash",
        "Strawberry", "Tomato"
    ]

class ClassificationResult(BaseModel):
    disease: str
    pathogen: Optional[str] = None
    confidence: float
    confidence_level: Optional[str] = "Normal"  # Normal | Moderate | Low
    top_predictions: List[TopPrediction] = []
    source: Optional[str] = "ml_model"

class SegmentationResult(BaseModel):
    mask_available: bool = True
    affected_area_percent: Optional[float] = None
    affected_percentage: Optional[float] = None  # alias
    affected_pixels: Optional[int] = None
    total_leaf_pixels: Optional[int] = None
    mask_url: Optional[str] = None
    overlay_url: Optional[str] = None
    source: Optional[str] = "unet_morphology"

class SeverityResult(BaseModel):
    label: str
    severity: Optional[str] = None  # alias
    score: Optional[float] = None
    threshold_range: Optional[str] = None
    severity_threshold_range: Optional[str] = None  # alias
    source: Optional[str] = "image_analysis"
    disclaimer: Optional[str] = "Image-based severity estimate"

class XAIResult(BaseModel):
    gradcam_available: bool = True
    heatmap_url: Optional[str] = None
    explanation: Optional[str] = "Activation regions highlight visual features contributing to the predicted class."
    summary: Optional[str] = None
    target_layer: Optional[str] = "features.stage7.unit1"
    source: Optional[str] = "gradcam_layer"

class EnvironmentResult(BaseModel):
    available: bool = True
    location: Optional[str] = "Field Coordinates"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    temperature_c: Optional[float] = None
    humidity_percent: Optional[int] = None
    rainfall_mm: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_kmh: Optional[float] = None  # alias
    weather_condition: Optional[str] = None
    risk_factor: Optional[str] = None
    source: Optional[str] = "weather_api"
    timestamp: Optional[str] = None
    reason: Optional[str] = None

class RAGSource(BaseModel):
    title: str
    source: str
    document_id: str
    similarity: float
    content_excerpt: Optional[str] = None

class RAGResult(BaseModel):
    available: bool = True
    sources: List[RAGSource] = []
    chunks_used: int = 0
    reason: Optional[str] = None

class AdvisoryResult(BaseModel):
    what_detected: str
    visible_symptoms: List[str]
    environmental_conditions: str
    management_recommendations: List[str]
    preventative_measures: Union[List[str], str]
    expert_advice: str

    # Backward compatibility aliases
    detected_condition: Optional[str] = None
    contributing_factors: Optional[str] = None
    management_guidelines: Optional[List[str]] = None
    prevention: Optional[str] = None
    expert_advisory: Optional[str] = None

class ScanMetadata(BaseModel):
    mode: str = "production"  # demo | production
    created_at: str
    model_version: str

class UnifiedScanResult(BaseModel):
    scan_id: str
    id: Optional[str] = None
    user_id: Optional[str] = None
    plant_id: Optional[str] = None

    image: Optional[ImageMeta] = None
    plant: Optional[PlantMeta] = None
    botanical_identification: Optional[BotanicalIdentification] = None
    disease_analysis: Optional[DiseaseDiagnosticResult] = None
    classification: Optional[ClassificationResult] = None
    segmentation: Optional[SegmentationResult] = None
    severity: Optional[SeverityResult] = None
    xai: Optional[XAIResult] = None
    environment: Optional[EnvironmentResult] = None
    rag: Optional[RAGResult] = None
    advisory: Optional[AdvisoryResult] = None
    metadata: Optional[ScanMetadata] = None
    status: Optional[str] = "success"
    message: Optional[str] = None
    model_status: Optional[Dict[str, Any]] = None

    # Backward compatibility flat fields
    plant_name: Optional[str] = None
    disease: Optional[str] = None
    pathogen: Optional[str] = None
    confidence: Optional[float] = None
    top_predictions: Optional[List[TopPrediction]] = None
    severity_threshold_range: Optional[str] = None
    explainability: Optional[Dict[str, Any]] = None
    environmental_context: Optional[Dict[str, Any]] = None
    ai_health_report: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    model_version: Optional[str] = None
    created_at: Optional[Union[datetime, str]] = None

    class Config:
        extra = "allow"

# Aliases
ScanOut = UnifiedScanResult

class ScanStatusOut(BaseModel):
    scan_id: str
    status: str  # processing | completed | failed
    progress: int
    step: str
    scan: Optional[UnifiedScanResult] = None
