from fastapi import APIRouter
from typing import List
from app.schemas.weather_schemas import ModelVersionOut

router = APIRouter(prefix="/models", tags=["Model Architecture & Performance"])

MODELS_REGISTRY = [
    {
        "id": "mdl-cls-01",
        "name": "Disease Classifier Engine",
        "type": "Image Classification",
        "architecture": "EfficientNet-B4 (Transfer Learning from ImageNet-1k)",
        "framework": "PyTorch 2.3.1 + TorchVision",
        "dataset": "PlantVillage + Expanded Field Validation Callset (54,305 curated leaves)",
        "input_size": "384 x 384 x 3",
        "version": "v2.1.0-prod",
        "status": "Active",
        "metrics": {
            "accuracy": 0.954,
            "precision": 0.948,
            "recall": 0.951,
            "f1_score": 0.949,
            "latency_ms": 42
        },
        "confusion_matrix": [
            {"predicted": "Healthy", "actualHealthy": 982, "actualEarlyBlight": 12, "actualLateBlight": 6, "actualLeafSpot": 0},
            {"predicted": "Early Blight", "actualHealthy": 8, "actualEarlyBlight": 934, "actualLateBlight": 45, "actualLeafSpot": 13},
            {"predicted": "Late Blight", "actualHealthy": 4, "actualEarlyBlight": 38, "actualLateBlight": 948, "actualLeafSpot": 10},
            {"predicted": "Leaf Spot", "actualHealthy": 2, "actualEarlyBlight": 14, "actualLateBlight": 12, "actualLeafSpot": 972}
        ]
    },
    {
        "id": "mdl-seg-01",
        "name": "Foliar Region Segmenter",
        "type": "Semantic Segmentation",
        "architecture": "U-Net with ResNet-34 Feature Encoder",
        "framework": "PyTorch + Albumentations",
        "dataset": "Annotated Leaf Lesion Mask Benchmark (4,200 pixel-level masks)",
        "input_size": "512 x 512 x 3",
        "version": "v1.4.2",
        "status": "Active",
        "metrics": {
            "mean_iou": 0.824,
            "dice_score": 0.897,
            "pixel_accuracy": 0.961,
            "latency_ms": 78
        }
    },
    {
        "id": "mdl-clu-01",
        "name": "Unsupervised Pattern Explorer",
        "type": "Feature Clustering",
        "architecture": "K-Means on penultimate layer latent vectors (K=4) + PCA reduction",
        "framework": "scikit-learn 1.5.0",
        "dataset": "Live inference embedding archive",
        "input_size": "1792-D feature vector -> 2D PCA",
        "version": "v1.1.0",
        "status": "Active",
        "metrics": {
            "silhouette_score": 0.682,
            "calinski_harabasz": 1420.5
        }
    }
]

@router.get("", response_model=List[ModelVersionOut])
async def list_models():
    return [ModelVersionOut(**m) for m in MODELS_REGISTRY]

@router.get("/performance", response_model=ModelVersionOut)
async def get_performance():
    return ModelVersionOut(**MODELS_REGISTRY[0])
