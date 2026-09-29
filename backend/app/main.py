import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.auth_routes import router as auth_router
from app.api.scan_routes import router as scan_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.plant_routes import router as plant_router
from app.api.analytics_routes import router as analytics_router
from app.api.ai_routes import router as ai_router
from app.api.weather_routes import router as weather_router
from app.api.model_routes import router as model_router
from app.api.admin_routes import router as admin_router

app = FastAPI(
    title="🌱 PlantIQ API",
    description="Multi-Layer Computer Vision & Plant Health Intelligence System",
    version="2.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
os.makedirs(settings.UPLOADS_PATH, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOADS_PATH), name="uploads")

# Include API Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(scan_router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_V1_PREFIX)
app.include_router(plant_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_router, prefix=settings.API_V1_PREFIX)
app.include_router(weather_router, prefix=settings.API_V1_PREFIX)
app.include_router(model_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_router, prefix=settings.API_V1_PREFIX)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "PlantIQ Core API",
        "version": "2.1.0",
        "runtime_mode": "DEMO_MODE" if settings.DEMO_MODE else "PRODUCTION",
        "ml_framework": "PyTorch 2.3 + TorchVision",
        "rag_kb_loaded": True
    }

@app.get("/")
async def root():
    return {
        "message": "🌱 PlantIQ — AI-Powered Plant Health Intelligence System",
        "documentation": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
