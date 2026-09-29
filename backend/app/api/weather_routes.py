from typing import Optional
from fastapi import APIRouter
from app.weather.provider import get_weather_provider

router = APIRouter(tags=["Environmental Weather Context"])

@router.get("/weather")
@router.get("/environment")
async def get_environment_telemetry(lat: Optional[float] = None, lon: Optional[float] = None):
    """
    Returns localized environmental parameters (temperature, humidity, rainfall, wind, risk).
    """
    provider = get_weather_provider()
    return provider.get_weather(lat, lon)
