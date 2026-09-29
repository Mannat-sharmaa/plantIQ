"""
PlantIQ - Model Evaluation & Benchmark Metrics
Calculates Precision, Recall, F1-Score, Confusion Matrix, mIoU, and Dice score.
"""

import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

def compute_classification_metrics(y_true, y_pred, labels=None):
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro")
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    return {
        "precision_macro": float(precision),
        "recall_macro": float(recall),
        "f1_macro": float(f1),
        "confusion_matrix": cm.tolist()
    }

def compute_segmentation_metrics(mask_true: np.ndarray, mask_pred: np.ndarray):
    intersection = np.logical_and(mask_true, mask_pred).sum()
    union = np.logical_or(mask_true, mask_pred).sum()
    iou = intersection / max(union, 1e-7)
    dice = (2.0 * intersection) / max(mask_true.sum() + mask_pred.sum(), 1e-7)
    return {
        "iou": float(iou),
        "dice": float(dice)
    }

if __name__ == "__main__":
    print("🌱 PlantIQ: Evaluation Metrics Module Loaded.")
