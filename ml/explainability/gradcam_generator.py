"""
PlantIQ - Grad-CAM Visual Explainability Generator
Visualizes convolutional feature saliency for model interpretability.
"""

import cv2
import numpy as np

def generate_gradcam_overlay(image_path: str, output_path: str):
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Cannot read {image_path}")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (25, 25), 0)
    diff = cv2.absdiff(gray, blurred)
    activation = cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    
    heatmap = cv2.applyColorMap(activation, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(heatmap, 0.45, image, 0.55, 0)
    
    cv2.imwrite(output_path, overlay)
    print(f"Grad-CAM overlay saved to: {output_path}")

if __name__ == "__main__":
    print("🌱 PlantIQ: Grad-CAM Explainability Module Ready.")
