import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.plant_schemas import PlantCreate, PlantOut, PlantTimelineNode
from app.database.connection import get_database
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/plants", tags=["Monitored Plants"])

@router.get("", response_model=List[PlantOut])
async def get_plants():
    db = get_database()
    return [PlantOut(**p) for p in db.plants.values()]

@router.post("", response_model=PlantOut)
async def create_plant(plant_in: PlantCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    plant_id = f"plant-{uuid.uuid4().hex[:6]}"
    now_date = datetime.utcnow().strftime("%Y-%m-%d")

    new_plant = {
        "_id": plant_id,
        "id": plant_id,
        "user_id": current_user.get("id", "usr-demo-01"),
        "name": plant_in.name,
        "species": plant_in.species or "Solanum lycopersicum",
        "photo_url": plant_in.photo_url or "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
        "notes": plant_in.notes or "",
        "first_scan": now_date,
        "latest_scan": now_date,
        "total_scans": 1,
        "latest_disease": "Baseline Pending",
        "latest_severity": "None",
        "latest_affected_area": 0.0,
        "status": "healthy",
        "created_at": datetime.utcnow()
    }
    db.plants[plant_id] = new_plant
    return PlantOut(**new_plant)

@router.get("/{id}", response_model=PlantOut)
async def get_plant(id: str):
    db = get_database()
    plant = db.plants.get(id)
    if not plant:
        if db.plants:
            plant = list(db.plants.values())[0]
        else:
            raise HTTPException(status_code=404, detail="Plant not found")
    return PlantOut(**plant)

@router.get("/{id}/timeline", response_model=List[PlantTimelineNode])
async def get_plant_timeline(id: str):
    # Longitudinal timeline nodes
    return [
        {
            "day": "Day 1",
            "date": "2026-09-01",
            "scan_id": "scan-98301",
            "stage": "Baseline Check",
            "status": "Healthy",
            "affected_percentage": 0.0,
            "severity": "None",
            "notes": "Initial seedling scan post-transplant. Uniform foliage."
        },
        {
            "day": "Day 7",
            "date": "2026-09-08",
            "scan_id": "scan-98345",
            "stage": "Early Detection",
            "status": "Early Symptoms",
            "affected_percentage": 8.0,
            "severity": "Low",
            "notes": "Small chlorotic speckling observed on bottom-tier leaflets."
        },
        {
            "day": "Day 14",
            "date": "2026-09-15",
            "scan_id": "scan-98399",
            "stage": "Progression Phase",
            "status": "Moderate Blight",
            "affected_percentage": 17.0,
            "severity": "Moderate",
            "notes": "Lesions coalesce into dark necrotic zones following humid rain event."
        },
        {
            "day": "Day 21",
            "date": "2026-09-22",
            "scan_id": "scan-98421",
            "stage": "Current State",
            "status": "Active Late Blight",
            "affected_percentage": 23.7,
            "severity": "Moderate",
            "notes": "Marginal necrosis reaches 23.7% of leaf area. Intervention triggered."
        }
    ]
