import abc
import requests
from datetime import datetime
from typing import Dict, Any, Optional

class WeatherProvider(abc.ABC):
    @abc.abstractmethod
    def get_weather(self, latitude: Optional[float] = None, longitude: Optional[float] = None) -> Dict[str, Any]:
        """Fetch localized environmental telemetry by coordinates."""
        pass

class DemoWeatherProvider(WeatherProvider):
    def get_weather(self, latitude: Optional[float] = None, longitude: Optional[float] = None) -> Dict[str, Any]:
        lat = latitude if latitude is not None else 30.9010
        lon = longitude if longitude is not None else 75.8573

        return {
            "available": True,
            "location": "Ludhiana Agricultural Station (Simulation)",
            "latitude": lat,
            "longitude": lon,
            "temperature_c": 24.2,
            "humidity_percent": 88,
            "rainfall_mm": 4.8,
            "wind_speed_kmh": 12.5,
            "wind_kmh": 12.5,
            "weather_condition": "High Humidity & Light Rain",
            "risk_factor": "High humidity and moderate temperatures can create environmental conditions associated with increased foliar disease risk.",
            "source": "demo",
            "timestamp": datetime.utcnow().isoformat(),
            "reason": None
        }

class OpenWeatherProvider(WeatherProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_weather(self, latitude: Optional[float] = None, longitude: Optional[float] = None) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "available": False,
                "reason": "Weather API key not configured",
                "temperature_c": None,
                "humidity_percent": None,
                "rainfall_mm": None,
                "wind_speed_kmh": None,
                "wind_kmh": None,
                "weather_condition": "Unavailable",
                "location": "Unknown",
                "latitude": latitude,
                "longitude": longitude,
                "risk_factor": "Environmental context unavailable",
                "source": "unavailable",
                "timestamp": datetime.utcnow().isoformat()
            }

        lat = latitude if latitude is not None else 28.6139
        lon = longitude if longitude is not None else 77.2090

        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_key}&units=metric"
            resp = requests.get(url, timeout=5)
            data = resp.json()

            if resp.status_code != 200:
                return {
                    "available": False,
                    "reason": f"OpenWeatherMap error: {data.get('message', 'HTTP Error')}",
                    "temperature_c": None,
                    "humidity_percent": None,
                    "rainfall_mm": None,
                    "wind_speed_kmh": None,
                    "wind_kmh": None,
                    "weather_condition": "Unavailable",
                    "location": f"Coordinates ({lat:.2f}°, {lon:.2f}°)",
                    "latitude": lat,
                    "longitude": lon,
                    "risk_factor": "Environmental context unavailable",
                    "source": "unavailable",
                    "timestamp": datetime.utcnow().isoformat()
                }

            temp = data["main"]["temp"]
            humidity = data["main"]["humidity"]
            rainfall = data.get("rain", {}).get("1h", 0.0)
            wind = data.get("wind", {}).get("speed", 0.0) * 3.6
            condition = data["weather"][0]["description"].title()
            city = data.get("name", "Local Field")

            # Scientific epidemiological risk assessment
            if humidity > 80 and 18 <= temp <= 28:
                risk = f"High humidity ({humidity}%) and moderate temperature ({temp:.1f}°C) create environmental conditions associated with increased foliar fungal sporulation risk."
            elif humidity > 65:
                risk = f"Moderate ambient humidity ({humidity}%) observed. Monitor canopy moisture levels to prevent leaf spot development."
            else:
                risk = f"Ambient humidity ({humidity}%) and temperature ({temp:.1f}°C) are within standard vegetative physiological parameters."

            return {
                "available": True,
                "location": f"{city} ({lat:.2f}°, {lon:.2f}°)",
                "latitude": lat,
                "longitude": lon,
                "temperature_c": round(temp, 1),
                "humidity_percent": int(humidity),
                "rainfall_mm": round(rainfall, 1),
                "wind_speed_kmh": round(wind, 1),
                "wind_kmh": round(wind, 1),
                "weather_condition": condition,
                "risk_factor": risk,
                "source": "weather_api",
                "timestamp": datetime.utcnow().isoformat(),
                "reason": None
            }
        except Exception as e:
            return {
                "available": False,
                "reason": f"Weather telemetry network error: {str(e)}",
                "temperature_c": None,
                "humidity_percent": None,
                "rainfall_mm": None,
                "wind_speed_kmh": None,
                "wind_kmh": None,
                "weather_condition": "Unavailable",
                "location": f"Coordinates ({lat:.2f}°, {lon:.2f}°)",
                "latitude": lat,
                "longitude": lon,
                "risk_factor": "Environmental context unavailable",
                "source": "unavailable",
                "timestamp": datetime.utcnow().isoformat()
            }

def get_weather_provider() -> WeatherProvider:
    from app.config import settings
    if settings.APP_MODE == "demo":
        return DemoWeatherProvider()
    if settings.WEATHER_API_KEY:
        return OpenWeatherProvider(settings.WEATHER_API_KEY)
    return DemoWeatherProvider()
