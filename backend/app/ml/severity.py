from typing import Tuple, Dict, Any, Optional

class SeverityEstimator:
    @staticmethod
    def calculate_severity(
        affected_area_percent: Optional[float],
        confidence: float = 0.95,
        is_healthy: bool = False,
        optional_visual_features: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates image-based foliar severity tier and score based on measurable surface necrosis.
        Levels: Healthy, Mild, Moderate, Severe, Critical.
        """
        if affected_area_percent is None:
            return {
                "severity": "Unknown",
                "label": "Unknown",
                "score": None,
                "threshold_range": "Measurement unavailable",
                "source": "unavailable",
                "disclaimer": "Image-based severity estimate unavailable"
            }

        pct = max(0.0, float(affected_area_percent))

        if is_healthy or pct < 1.0:
            label = "Healthy"
            score = 0.02
            threshold_range = "0% – 1%"
        elif pct <= 10.0:
            label = "Mild"
            score = round(min(0.25, 0.05 + (pct / 10.0) * 0.20), 2)
            threshold_range = "1% – 10%"
        elif pct <= 25.0:
            label = "Moderate"
            score = round(min(0.55, 0.25 + ((pct - 10.0) / 15.0) * 0.30), 2)
            threshold_range = "10% – 25%"
        elif pct <= 50.0:
            label = "Severe"
            score = round(min(0.85, 0.55 + ((pct - 25.0) / 25.0) * 0.30), 2)
            threshold_range = "25% – 50%"
        else:
            label = "Critical"
            score = round(min(0.99, 0.85 + ((pct - 50.0) / 50.0) * 0.14), 2)
            threshold_range = "50%+"

        return {
            "severity": label,
            "label": label,
            "score": score,
            "threshold_range": threshold_range,
            "source": "image_analysis",
            "disclaimer": "Image-based severity estimate (preliminary single-angle visual metric)"
        }

    @staticmethod
    def estimate(affected_percentage: float) -> Tuple[str, str]:
        """Legacy helper for backward compatibility."""
        res = SeverityEstimator.calculate_severity(affected_percentage)
        return res["label"], res["threshold_range"]
