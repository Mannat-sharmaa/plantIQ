"""
Model Loader Service for Plant Disease Classification
Loads trained PyTorch neural network checkpoints into memory for real-time inference.
"""

import os
import torch
import torch.nn as nn
from torchvision import models
from typing import Optional, Tuple, Dict, Any
from app.config import settings

NUM_CLASSES = 38
DEFAULT_MODEL_FILENAME = "plant_disease_model.pth"

def create_model(num_classes: int = NUM_CLASSES) -> nn.Module:
    """Creates a MobileNetV3-Small architecture for plant disease classification."""
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

_cached_model: Optional[nn.Module] = None
_model_meta: Optional[Dict[str, Any]] = None

def get_model_path() -> str:
    """Resolve configured model path."""
    if hasattr(settings, "MODEL_PATH") and settings.MODEL_PATH:
        return settings.MODEL_PATH
    # Default location inside backend/models/
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(backend_dir, "models", DEFAULT_MODEL_FILENAME)

def load_trained_model() -> Tuple[Optional[nn.Module], Dict[str, Any]]:
    """
    Loads and caches the trained PyTorch inference model.
    
    Returns:
        (model, metadata): tuple of (nn.Module or None, metadata_dict)
    """
    global _cached_model, _model_meta

    if _cached_model is not None and _model_meta is not None:
        return _cached_model, _model_meta

    model_path = get_model_path()

    if not os.path.exists(model_path):
        _model_meta = {
            "status": "model_unavailable",
            "message": "A trained inference model is not configured.",
            "is_configured": False,
            "model_name": "None",
            "version": "Not Configured",
            "mode": settings.APP_MODE,
            "inference": "Unavailable",
            "classes": 0,
            "model_path": model_path
        }
        return None, _model_meta

    try:
        model = create_model(num_classes=NUM_CLASSES)
        state_dict = torch.load(model_path, map_location=torch.device("cpu"), weights_only=True)
        model.load_state_dict(state_dict)
        model.eval()

        _cached_model = model
        _model_meta = {
            "status": "ready",
            "is_configured": True,
            "model_name": "MobileNetV3-PlantVillage",
            "version": "v2.1-PyTorch",
            "mode": settings.APP_MODE,
            "inference": "Real PyTorch Tensor Inference",
            "classes": NUM_CLASSES,
            "model_path": model_path,
            "device": "cpu"
        }
        return _cached_model, _model_meta
    except Exception as e:
        _model_meta = {
            "status": "model_unavailable",
            "message": f"Failed to load trained model checkpoint: {str(e)}",
            "is_configured": False,
            "model_name": "Error",
            "version": "Load Failed",
            "mode": settings.APP_MODE,
            "inference": "Unavailable",
            "classes": 0,
            "model_path": model_path
        }
        return None, _model_meta

def is_model_configured() -> bool:
    """Check whether a trained model is ready for live inference."""
    _, meta = load_trained_model()
    return meta.get("is_configured", False)

def get_model_metadata() -> Dict[str, Any]:
    """Retrieve technical model status information."""
    _, meta = load_trained_model()
    return meta
