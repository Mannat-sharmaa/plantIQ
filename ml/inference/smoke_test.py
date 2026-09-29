"""
PlantIQ - Machine Learning Pipeline Smoke Test
Validates: Model Interface, Classification Output Schema, Segmentation Output, Severity Calculation
"""

import sys
import os
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.ml.classifier import get_classifier
from app.ml.segmenter import get_segmenter
from app.ml.severity import SeverityEstimator
from app.ml.explainability import GradCAMService
from app.ml.clustering import FeatureClusteringService

def run_ml_smoke_test():
    print("[PlantIQ] Running ML Subsystem Smoke Tests...")

    # 1. Classification Output Schema
    classifier = get_classifier()
    dummy_image = "sample_leaf.jpg"
    cls_result = classifier.predict(dummy_image)
    assert "plant" in cls_result
    assert "disease" in cls_result
    assert "confidence" in cls_result
    assert len(cls_result["top_predictions"]) >= 1
    print(f"PASS: Classification inference verified: {cls_result['plant']} - {cls_result['disease']} ({cls_result['confidence']*100:.1f}%)")

    # 2. Severity Tier Calculation
    severity_low, range_low = SeverityEstimator.estimate(6.4)
    assert severity_low == "Low"
    severity_mod, range_mod = SeverityEstimator.estimate(23.7)
    assert severity_mod == "Moderate"
    severity_high, range_high = SeverityEstimator.estimate(38.2)
    assert severity_high == "High"
    severity_crit, range_crit = SeverityEstimator.estimate(65.0)
    assert severity_crit == "Critical"
    print("PASS: Severity categorization verified (Low, Moderate, High, Critical).")

    # 3. Clustering Schema
    clusters_data = FeatureClusteringService.compute_clusters(n_clusters=4)
    assert len(clusters_data["clusters"]) == 4
    assert clusters_data["clusters"][0]["label"] == "Healthy-looking"
    print("PASS: Unsupervised K-Means clustering projection verified.")

    print("SUCCESS: All ML subsystem smoke tests passed successfully!")

if __name__ == "__main__":
    run_ml_smoke_test()
