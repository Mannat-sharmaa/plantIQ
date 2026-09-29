from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PlantCreate(BaseModel):
    name: str
    species: Optional[str] = "Solanum lycopersicum"
    photo_url: Optional[str] = None
    notes: Optional[str] = None

class PlantOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    species: str
    photo_url: str
    notes: Optional[str] = None
    first_scan: str
    latest_scan: str
    total_scans: int
    latest_disease: str
    latest_severity: str
    latest_affected_area: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class PlantTimelineNode(BaseModel):
    day: str
    date: str
    scan_id: Optional[str] = None
    stage: str
    status: str
    affected_percentage: float
    severity: str
    notes: Optional[str] = None
