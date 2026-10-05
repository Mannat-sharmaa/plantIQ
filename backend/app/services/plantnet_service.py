"""
Pl@ntNet Real Botanical Vision Service
Connects to Pl@ntNet API (30,000+ botanical species) for real-time,
accurate plant identification from user images.
Strictly decoupled from disease diagnosis.
"""

import os
import requests
from typing import Dict, Any, Optional, List
from app.config import settings

def query_plantnet_identification(image_path: str) -> Optional[Dict[str, Any]]:
    """
    Submits an image to the official Pl@ntNet API for real botanical taxonomy identification.
    Recognizes over 30,000+ plant species globally.
    Returns botanical identification data (scientific name, common name, family, score, candidates).
    """
    api_key = settings.PLANTNET_API_KEY or os.getenv("PLANTNET_API_KEY", "")
    if not api_key or not os.path.exists(image_path):
        return None

    try:
        url = f"https://my-api.plantnet.org/v2/identify/all?api-key={api_key}&lang=en"
        filename = os.path.basename(image_path)
        
        from PIL import Image
        import io

        # Optimize image size before sending to Pl@ntNet (reduces upload from 5MB to ~80KB, 10x faster)
        with Image.open(image_path) as pil_img:
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            # Downscale if larger than 800px on any side
            pil_img.thumbnail((800, 800), Image.Resampling.LANCZOS)
            img_buffer = io.BytesIO()
            pil_img.save(img_buffer, format="JPEG", quality=82, optimize=True)
            img_bytes = img_buffer.getvalue()

        files = [("images", ("leaf.jpg", img_bytes, "image/jpeg"))]
        data = {"organs": ["auto"]}
        
        response = requests.post(url, files=files, data=data, timeout=8)

        if response.status_code != 200:
            print(f"[PLANTNET] API returned status {response.status_code}: {response.text[:200]}")
            return None

        payload = response.json()
        results = payload.get("results", [])
        if not results:
            print(f"[PLANTNET] No matching species returned by API.")
            return None

        # Extract top match
        top = results[0]
        raw_score = float(top.get("score", 0.0))
        species_data = top.get("species", {})
        sci_name = species_data.get("scientificNameWithoutAuthor", "")
        family = species_data.get("family", {}).get("scientificName", "")
        common_names = species_data.get("commonNames", [])
        
        # Pick best friendly common name
        common_name = common_names[0] if common_names else sci_name

        # Format candidate predictions list
        candidate_species: List[Dict[str, Any]] = []
        for r in results[:5]:
            sp = r.get("species", {})
            s_name = sp.get("scientificNameWithoutAuthor", "")
            fam = sp.get("family", {}).get("scientificName", "")
            c_names = sp.get("commonNames", [])
            c_name = c_names[0] if c_names else s_name
            cand_score = round(float(r.get("score", 0.0)), 4)
            candidate_species.append({
                "common_name": c_name,
                "scientific_name": s_name,
                "family": fam,
                "score": cand_score,
                "label": f"{c_name} ({s_name})"
            })

        print(f"[PLANTNET] Identified: {common_name} ({sci_name}) - Family: {family} (Score: {raw_score:.4f})")

        return {
            "identified": True,
            "plant": common_name,
            "common_name": common_name,
            "scientific_name": sci_name,
            "family": family,
            "score": round(raw_score, 4),
            "candidate_species": candidate_species,
            "source": "plantnet_api",
            "source_title": "Pl@ntNet Global Biodiversity Database (30,000+ Species)"
        }
    except Exception as e:
        print(f"[PLANTNET] Identification error: {e}")
        return None
