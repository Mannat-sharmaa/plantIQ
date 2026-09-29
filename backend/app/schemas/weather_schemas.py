from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class WeatherTelemetry(BaseModel):
    location: str
    latitude: float
    longitude: float
    temperature_c: float
    humidity_percent: int
    rainfall_mm: float
    wind_kmh: float
    weather_condition: str
    risk_factor: str

class AIChatRequest(BaseModel):
    message: str
    language: str = "English"
    scan_context: Optional[Dict[str, Any]] = None
    scanContext: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"

class AIChatResponse(BaseModel):
    reply: str
    language: str
    timestamp: str
    citations: List[str] = []

class ModelMetrics(BaseModel):
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    mean_iou: Optional[float] = None
    dice_score: Optional[float] = None
    latency_ms: Optional[int] = None

class ModelVersionOut(BaseModel):
    id: str
    name: str
    type: str
    architecture: str
    framework: str
    dataset: str
    input_size: str
    version: str
    status: str
    metrics: Dict[str, Any]
    confusion_matrix: Optional[List[Dict[str, Any]]] = None
