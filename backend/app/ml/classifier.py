"""
Foliar Disease Classifier Engine
Integrates PyTorch model inference, out-of-domain detection, and computer vision.
"""

import abc
import os
from typing import Dict, Any
from app.config import settings
from app.ml.inference import run_model_inference

class DiseaseClassifier(abc.ABC):
    @abc.abstractmethod
    def predict(self, image_path: str) -> Dict[str, Any]:
        """Perform foliar disease classification on image."""
        pass

class PyTorchDiseaseClassifier(DiseaseClassifier):
    """
    Production-grade PyTorch Neural Network Classifier.
    Executes trained model forward pass, temperature-scaled softmax,
    and out-of-domain / low-confidence detection.
    """
    def predict(self, image_path: str) -> Dict[str, Any]:
        return run_model_inference(image_path)

def get_classifier() -> DiseaseClassifier:
    """Returns the primary production PyTorch disease classifier."""
    return PyTorchDiseaseClassifier()
