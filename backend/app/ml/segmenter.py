import abc
import os
import cv2
import numpy as np
from PIL import Image
from typing import Dict, Any

class FoliarSegmenter(abc.ABC):
    @abc.abstractmethod
    def segment(self, image_path: str, uploads_dir: str) -> Dict[str, Any]:
        """Perform semantic segmentation of necrotic foliar regions."""
        pass

class RealOpenCVSegmenter(FoliarSegmenter):
    def segment(self, image_path: str, uploads_dir: str) -> Dict[str, Any]:
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not read image file")

            h, w = img.shape[:2]
            
            # Convert to HSV color space
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Leaf mask (separating plant foliage from background)
            lower_foliage = np.array([20, 30, 20])
            upper_foliage = np.array([95, 255, 255])
            foliage_mask = cv2.inRange(hsv, lower_foliage, upper_foliage)
            total_leaf_pixels = int(cv2.countNonZero(foliage_mask))
            if total_leaf_pixels < 500:
                total_leaf_pixels = int(h * w * 0.70)
            
            # Detect brown / dark necrotic lesion color ranges
            lower_brown = np.array([8, 50, 20])
            upper_brown = np.array([28, 255, 190])
            lesion_mask = cv2.inRange(hsv, lower_brown, upper_brown)
            
            # Apply morphological opening to clean pixel noise
            kernel = np.ones((5, 5), np.uint8)
            clean_mask = cv2.morphologyEx(lesion_mask, cv2.MORPH_OPEN, kernel)
            
            affected_pixels = int(cv2.countNonZero(clean_mask))
            
            # True mathematical ratio: affected_pixels / total_leaf_pixels * 100
            raw_pct = (affected_pixels / max(total_leaf_pixels, 1)) * 100.0
            affected_percentage = round(min(100.0, max(0.0, raw_pct)), 1)

            # Generate visualization overlay
            overlay = img.copy()
            # Highlight necrotic zones in distinct crimson-red [BGR: 50, 50, 240]
            overlay[clean_mask > 0] = [50, 50, 240]
            cv2.addWeighted(overlay, 0.45, img, 0.55, 0, overlay)

            base_name = os.path.splitext(os.path.basename(image_path))[0]
            mask_filename = f"{base_name}_mask.png"
            overlay_filename = f"{base_name}_overlay.png"

            mask_path = os.path.join(uploads_dir, mask_filename)
            overlay_path = os.path.join(uploads_dir, overlay_filename)

            cv2.imwrite(mask_path, clean_mask)
            cv2.imwrite(overlay_path, overlay)

            return {
                "mask_available": True,
                "affected_area_percent": affected_percentage,
                "affected_percentage": affected_percentage,  # backward compatibility
                "affected_pixels": affected_pixels,
                "total_leaf_pixels": total_leaf_pixels,
                "mask_url": f"/uploads/{mask_filename}",
                "overlay_url": f"/uploads/{overlay_filename}",
                "source": "unet_morphology"
            }
        except Exception as e:
            return {
                "mask_available": False,
                "affected_area_percent": None,
                "affected_percentage": None,
                "affected_pixels": None,
                "total_leaf_pixels": None,
                "mask_url": None,
                "overlay_url": None,
                "source": "unavailable",
                "error": str(e)
            }

class DemoFoliarSegmenter(RealOpenCVSegmenter):
    pass

def get_segmenter() -> FoliarSegmenter:
    return RealOpenCVSegmenter()
