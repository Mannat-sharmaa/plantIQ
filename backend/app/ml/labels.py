"""
PlantVillage 38-Class Dataset Labels & Taxonomic Metadata
Official standard agricultural benchmark mapping for plant foliar disease classification.
"""

from typing import Dict, Any, List, Optional

CLASS_LABELS: Dict[int, Dict[str, Any]] = {
    0: {"plant": "Apple", "disease": "Apple Scab", "pathogen": "Venturia inaequalis", "healthy": False},
    1: {"plant": "Apple", "disease": "Black Rot", "pathogen": "Botryosphaeria obtusa", "healthy": False},
    2: {"plant": "Apple", "disease": "Cedar Apple Rust", "pathogen": "Gymnosporangium juniperi-virginianae", "healthy": False},
    3: {"plant": "Apple", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    4: {"plant": "Blueberry", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    5: {"plant": "Cherry", "disease": "Powdery Mildew", "pathogen": "Podosphaera clandestina", "healthy": False},
    6: {"plant": "Cherry", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    7: {"plant": "Corn (Maize)", "disease": "Cercospora Leaf Spot (Gray Leaf Spot)", "pathogen": "Cercospora zeae-maydis", "healthy": False},
    8: {"plant": "Corn (Maize)", "disease": "Common Rust", "pathogen": "Puccinia sorghi", "healthy": False},
    9: {"plant": "Corn (Maize)", "disease": "Northern Leaf Blight", "pathogen": "Exserohilum turcicum", "healthy": False},
    10: {"plant": "Corn (Maize)", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    11: {"plant": "Grape", "disease": "Black Rot", "pathogen": "Guignardia bidwellii", "healthy": False},
    12: {"plant": "Grape", "disease": "Esca (Black Measles)", "pathogen": "Phaeomoniella chlamydospora", "healthy": False},
    13: {"plant": "Grape", "disease": "Leaf Blight (Isariopsis Leaf Spot)", "pathogen": "Pseudocercospora cladosporioides", "healthy": False},
    14: {"plant": "Grape", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    15: {"plant": "Orange", "disease": "Huanglongbing (Citrus Greening)", "pathogen": "Candidatus Liberibacter asiaticus", "healthy": False},
    16: {"plant": "Peach", "disease": "Bacterial Spot", "pathogen": "Xanthomonas arboricola pv. pruni", "healthy": False},
    17: {"plant": "Peach", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    18: {"plant": "Pepper (Bell)", "disease": "Bacterial Spot", "pathogen": "Xanthomonas campestris pv. vesicatoria", "healthy": False},
    19: {"plant": "Pepper (Bell)", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    20: {"plant": "Potato", "disease": "Early Blight", "pathogen": "Alternaria solani", "healthy": False},
    21: {"plant": "Potato", "disease": "Late Blight", "pathogen": "Phytophthora infestans", "healthy": False},
    22: {"plant": "Potato", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    23: {"plant": "Raspberry", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    24: {"plant": "Soybean", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    25: {"plant": "Squash", "disease": "Powdery Mildew", "pathogen": "Erysiphe cichoracearum", "healthy": False},
    26: {"plant": "Strawberry", "disease": "Leaf Scorch", "pathogen": "Diplocarpon earlianum", "healthy": False},
    27: {"plant": "Strawberry", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True},
    28: {"plant": "Tomato", "disease": "Bacterial Spot", "pathogen": "Xanthomonas vesicatoria", "healthy": False},
    29: {"plant": "Tomato", "disease": "Early Blight", "pathogen": "Alternaria solani", "healthy": False},
    30: {"plant": "Tomato", "disease": "Late Blight", "pathogen": "Phytophthora infestans", "healthy": False},
    31: {"plant": "Tomato", "disease": "Leaf Mold", "pathogen": "Passalora fulva", "healthy": False},
    32: {"plant": "Tomato", "disease": "Septoria Leaf Spot", "pathogen": "Septoria lycopersici", "healthy": False},
    33: {"plant": "Tomato", "disease": "Spider Mites (Two-Spotted Spider Mite)", "pathogen": "Tetranychus urticae", "healthy": False},
    34: {"plant": "Tomato", "disease": "Target Spot", "pathogen": "Corynespora cassiicola", "healthy": False},
    35: {"plant": "Tomato", "disease": "Tomato Yellow Leaf Curl Virus", "pathogen": "Begomovirus (TYLCV)", "healthy": False},
    36: {"plant": "Tomato", "disease": "Tomato Mosaic Virus", "pathogen": "Tobamovirus (ToMV)", "healthy": False},
    37: {"plant": "Tomato", "disease": "Healthy Foliage", "pathogen": "None", "healthy": True}
}

SUPPORTED_PLANTS: List[str] = [
    "Apple", "Blueberry", "Cherry", "Corn (Maize)", "Grape", "Orange",
    "Peach", "Pepper (Bell)", "Potato", "Raspberry", "Soybean", "Squash",
    "Strawberry", "Tomato", "Guava", "Mango", "Citrus"
]

def get_class_info(class_index: int) -> Dict[str, Any]:
    """Retrieve verified metadata for a given class index."""
    if class_index in CLASS_LABELS:
        return CLASS_LABELS[class_index]
    return {
        "plant": "Unknown Species",
        "disease": "Unclassified Condition",
        "pathogen": "Unknown",
        "healthy": False
    }

def is_plant_supported(plant_name: str) -> bool:
    """Check if the detected plant species is supported by the 38-class model."""
    if not plant_name:
        return False
    clean = plant_name.lower().strip()
    return any(p.lower() in clean for p in SUPPORTED_PLANTS)
