from fastapi import APIRouter
from app.ml.clustering import FeatureClusteringService

router = APIRouter(tags=["Analytics & Clusters"])

@router.get("/analytics")
async def get_analytics():
    return {
        "stats": {
            "totalScans": 1428,
            "healthyPlants": 812,
            "diseasedPlants": 616,
            "avgAffectedArea": 16.4,
            "scanAccuracyRate": 94.6,
            "activeMonitoredPlants": 86
        },
        "diseaseDistribution": [
            {"name": "Late Blight", "count": 184, "color": "#ff4d6d"},
            {"name": "Early Blight", "count": 142, "color": "#ffb020"},
            {"name": "Leaf Spot", "count": 98, "color": "#8b5cf6"},
            {"name": "Powdery Mildew", "count": 110, "color": "#38bdf8"},
            {"name": "Bacterial Spot", "count": 82, "color": "#f43f5e"},
            {"name": "Healthy Baseline", "count": 812, "color": "#00ff88"}
        ],
        "severityDistribution": [
            {"name": "None (Healthy)", "percentage": 56.8, "count": 812, "color": "#00ff88"},
            {"name": "Low (0-10%)", "percentage": 18.2, "count": 260, "color": "#38bdf8"},
            {"name": "Moderate (10-25%)", "percentage": 14.5, "count": 207, "color": "#ffb020"},
            {"name": "High (25-50%)", "percentage": 7.8, "count": 111, "color": "#f97316"},
            {"name": "Critical (>50%)", "percentage": 2.7, "count": 38, "color": "#ff4d6d"}
        ],
        "scanTrends": [
            {"month": "Apr", "scans": 112, "diseased": 42, "avgTemp": 22},
            {"month": "May", "scans": 168, "diseased": 60, "avgTemp": 28},
            {"month": "Jun", "scans": 215, "diseased": 88, "avgTemp": 33},
            {"month": "Jul", "scans": 290, "diseased": 145, "avgTemp": 31},
            {"month": "Aug", "scans": 345, "diseased": 178, "avgTemp": 29},
            {"month": "Sep", "scans": 298, "diseased": 103, "avgTemp": 26}
        ],
        "environmentalCorrelation": [
            {"humidity": 45, "avgAffected": 3.2, "label": "Dry (<50% RH)"},
            {"humidity": 55, "avgAffected": 5.8, "label": "Moderate (50-60%)"},
            {"humidity": 68, "avgAffected": 12.4, "label": "Humid (60-75%)"},
            {"humidity": 82, "avgAffected": 24.1, "label": "Very Humid (75-85%)"},
            {"humidity": 92, "avgAffected": 34.6, "label": "Saturated (>85% RH)"}
        ]
    }

@router.get("/clusters")
async def get_clusters():
    return FeatureClusteringService.compute_clusters(n_clusters=4)
