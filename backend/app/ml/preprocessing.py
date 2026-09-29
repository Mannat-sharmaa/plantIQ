"""
Image Preprocessing Pipeline for PyTorch Inference
Converts raw foliar image files into standardized tensor representations.
"""

import os
import torch
from PIL import Image
from torchvision import transforms
from typing import Tuple, Dict, Any

# Standard ImageNet normalization parameters
IMAGE_SIZE = (224, 224)
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

inference_transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])

def preprocess_image_tensor(image_path: str) -> Tuple[torch.Tensor, Dict[str, Any]]:
    """
    Validates and transforms a leaf image file into a model-ready PyTorch tensor.
    
    Returns:
        input_tensor: torch.Tensor of shape (1, 3, 224, 224)
        metadata: Dict with width, height, size_bytes, format
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at path: {image_path}")

    size_bytes = os.path.getsize(image_path)

    with Image.open(image_path) as pil_img:
        width, height = pil_img.size
        img_format = pil_img.format or "UNKNOWN"
        # Convert to RGB (handles RGBA, Grayscale, etc.)
        rgb_img = pil_img.convert("RGB")

    tensor = inference_transform(rgb_img)
    input_tensor = tensor.unsqueeze(0)  # Shape: (1, 3, 224, 224)

    metadata = {
        "width": width,
        "height": height,
        "size_bytes": size_bytes,
        "format": img_format,
        "tensor_shape": list(input_tensor.shape)
    }

    return input_tensor, metadata
