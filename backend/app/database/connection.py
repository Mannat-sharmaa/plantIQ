import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger("plantiq.database")

# In-Memory / Local Storage Fallback implementation for seamless zero-setup execution
class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.scans: Dict[str, Dict[str, Any]] = {}
        self.plants: Dict[str, Dict[str, Any]] = {}
        self.chat_history: Dict[str, Dict[str, Any]] = {}
        self.model_versions: Dict[str, Dict[str, Any]] = {}
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Seed default admin user
        admin_id = "usr-demo-01"
        self.users[admin_id] = {
            "_id": admin_id,
            "id": admin_id,
            "name": "Aarav Sharma",
            "email": "admin@plantiq.ai",
            "password_hash": "pbkdf2_sha256$260000$mockhash$admin1234",
            "role": "ADMIN",
            "preferred_language": "English",
            "created_at": datetime.utcnow()
        }

        # Seed default plants
        plant_id = "plant-tomato-01"
        self.plants[plant_id] = {
            "_id": plant_id,
            "id": plant_id,
            "user_id": admin_id,
            "name": "Tomato Plant #01",
            "species": "Solanum lycopersicum",
            "photo_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
            "notes": "Main greenhouse test batch #3. Monitored for Phytophthora infestans.",
            "first_scan": "2026-09-01",
            "latest_scan": "2026-09-21",
            "total_scans": 4,
            "latest_disease": "Late Blight",
            "latest_severity": "Moderate",
            "latest_affected_area": 23.7,
            "status": "diseased",
            "created_at": datetime.utcnow()
        }

        # Seed default scan with complete Section 14 UnifiedScanResult structure
        scan_id = "scan-98421"
        self.scans[scan_id] = {
            "_id": scan_id,
            "scan_id": scan_id,
            "id": scan_id,
            "user_id": admin_id,
            "plant_id": plant_id,
            "image": {
                "original_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
                "processed_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
                "width": 512,
                "height": 512
            },
            "plant": {
                "name": "Tomato",
                "scientific_name": "Solanum lycopersicum"
            },
            "classification": {
                "disease": "Septoria Leaf Spot",
                "pathogen": "Septoria lycopersici",
                "confidence": 0.884,
                "confidence_level": "Normal",
                "top_predictions": [
                    {"label": "Tomato — Septoria Leaf Spot", "confidence": 0.884},
                    {"label": "Tomato — Early Blight", "confidence": 0.072},
                    {"label": "Tomato — Healthy Foliage", "confidence": 0.044}
                ],
                "source": "ml_model"
            },
            "segmentation": {
                "mask_available": True,
                "affected_area_percent": 3.8,
                "affected_percentage": 3.8,
                "affected_pixels": 22800,
                "total_leaf_pixels": 600000,
                "mask_url": None,
                "overlay_url": None,
                "source": "unet_morphology"
            },
            "severity": {
                "label": "Mild",
                "severity": "Mild",
                "score": 3.8,
                "threshold_range": "0.1% – 10.0%",
                "severity_threshold_range": "0.1% – 10.0%",
                "source": "image_analysis",
                "disclaimer": "Image-based severity estimate"
            },
            "xai": {
                "gradcam_available": True,
                "heatmap_url": None,
                "explanation": "Penultimate layer activations highlight localized necrotic lesions.",
                "summary": "Grad-CAM activation highlights distinct circular leaf spots with dark margins.",
                "target_layer": "features.12",
                "source": "gradcam_layer"
            },
            "environment": {
                "available": True,
                "location": "Ludhiana Agricultural Belt, Punjab",
                "latitude": 30.9010,
                "longitude": 75.8573,
                "temperature_c": 24.2,
                "humidity_percent": 88,
                "rainfall_mm": 4.8,
                "wind_speed_kmh": 12.5,
                "wind_kmh": 12.5,
                "weather_condition": "Few Clouds",
                "risk_factor": "Elevated humidity provides optimal sporulation conditions.",
                "source": "weather_api"
            },
            "rag": {
                "available": True,
                "sources": [
                    {
                        "title": "Tomato Septoria Leaf Spot Management Guide",
                        "source": "FAO Plant Protection Bulletin",
                        "document_id": "kb_tomato_septoria",
                        "similarity": 0.94,
                        "content_excerpt": "Septoria lycopersici produces circular spots with dark brown margins and gray centers on lower tomato leaves."
                    }
                ],
                "chunks_used": 1
            },
            "advisory": {
                "what_detected": "Septoria Leaf Spot identified on Tomato foliage.",
                "visible_symptoms": [
                    "Numerous small, circular spots on lower foliage",
                    "Dark brown margins surrounding gray to tan centers"
                ],
                "environmental_conditions": "Ambient relative humidity and warm temperatures encourage fungal progression.",
                "management_recommendations": [
                    "Remove heavily spotted lower leaves to reduce inoculum",
                    "Water at the base of plants to avoid wet foliage",
                    "Apply protective bio-fungicide or copper spray"
                ],
                "preventative_measures": "Rotate crops and avoid planting nightshades in the same plot consecutively.",
                "expert_advice": "Consult local agricultural extension if spots expand upward past mid-canopy."
            },
            "metadata": {
                "mode": "production",
                "created_at": "2026-09-27T12:00:00Z",
                "model_version": "MobileNetV3-PlantVillage_v2.1"
            },
            "model_status": {
                "status": "ready",
                "is_configured": True,
                "model_name": "MobileNetV3-PlantVillage",
                "version": "v2.1-PyTorch",
                "mode": "production",
                "inference": "Real PyTorch Tensor Inference",
                "classes": 38
            },
            # Flat backward compatibility aliases
            "plant_name": "Tomato Specimen",
            "disease": "Septoria Leaf Spot",
            "pathogen": "Septoria lycopersici",
            "confidence": 0.884,
            "top_predictions": [
                {"label": "Tomato — Septoria Leaf Spot", "confidence": 0.884},
                {"label": "Tomato — Early Blight", "confidence": 0.072},
                {"label": "Tomato — Healthy Foliage", "confidence": 0.044}
            ],
            "severity_label": "Mild",
            "severity_threshold_range": "0.1% – 10.0%",
            "explainability": {"summary": "Grad-CAM activation highlights distinct circular leaf spots with dark margins."},
            "environmental_context": {"temperature_c": 24.2, "humidity_percent": 88},
            "ai_health_report": {"detected_condition": "Septoria Leaf Spot identified on Tomato foliage."},
            "image_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
            "model_version": "MobileNetV3-PlantVillage_v2.1",
            "created_at": "2026-09-27T12:00:00Z"
        }

db = InMemoryDatabase()

def get_database():
    return db
