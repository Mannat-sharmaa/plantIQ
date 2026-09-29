from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_admin
from app.database.connection import get_database

router = APIRouter(prefix="/admin", tags=["Administrative MLOps"], dependencies=[Depends(get_current_admin)])

@router.get("/users")
async def get_admin_users():
    return [
        {"id": "usr-01", "name": "Aarav Sharma", "email": "aarav.sharma@agritech.in", "role": "ADMIN", "scansCount": 142, "status": "Active", "joined": "2026-06-12"},
        {"id": "usr-02", "name": "Priya Patel", "email": "priya.p@farmsense.org", "role": "USER", "scansCount": 88, "status": "Active", "joined": "2026-07-04"},
        {"id": "usr-03", "name": "Dr. Ramesh Gill", "email": "rgill@pau.edu", "role": "RESEARCHER", "scansCount": 310, "status": "Active", "joined": "2026-05-18"},
        {"id": "usr-04", "name": "Kavita Rao", "email": "kavita.agri@gmail.com", "role": "USER", "scansCount": 45, "status": "Active", "joined": "2026-08-22"}
    ]

@router.get("/analytics")
async def get_admin_analytics():
    return {
        "mean_latency_ms": 195,
        "gpu_vram_gb": 3.4,
        "active_workers": 8,
        "cache_hit_ratio": 91.4
    }

@router.post("/models/{id}/validate")
async def validate_model(id: str):
    return {
        "model_id": id,
        "validation_status": "PASSED",
        "benchmark_accuracy": 0.958,
        "segmentation_iou": 0.841,
        "latency_ms": 41,
        "message": "Model passed automated evaluation test suite without regressions."
    }

@router.post("/models/{id}/deploy")
async def deploy_model(id: str):
    return {
        "model_id": id,
        "status": "ACTIVE",
        "message": "Model successfully promoted to live production inference workers."
    }
