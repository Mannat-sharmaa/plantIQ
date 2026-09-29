import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
KNOWLEDGE_BASE_DIR = BASE_DIR.parent / "knowledge_base"

try:
    from dotenv import load_dotenv
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        load_dotenv()
except ImportError:
    pass

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "PlantIQ"
        API_V1_PREFIX: str = "/api"
        DEBUG: bool = True
        APP_MODE: str = os.getenv("APP_MODE", "production")
        DEMO_MODE: bool = (os.getenv("APP_MODE", "production").lower() == "demo")
        
        CONFIDENCE_THRESHOLD_LOW: float = float(os.getenv("CONFIDENCE_THRESHOLD_LOW", "0.50"))
        CONFIDENCE_THRESHOLD_MODERATE: float = float(os.getenv("CONFIDENCE_THRESHOLD_MODERATE", "0.80"))

        JWT_SECRET: str = "plantiq_super_secret_jwt_key_2026_academic_defense"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        
        MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        DATABASE_NAME: str = "plantiq_db"
        
        AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        
        WEATHER_PROVIDER: str = os.getenv("WEATHER_PROVIDER", "openweather")
        WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
        PLANTNET_API_KEY: str = os.getenv("PLANTNET_API_KEY", "")
        
        STORAGE_PROVIDER: str = "local"
        UPLOADS_PATH: str = str(UPLOADS_DIR)
        KNOWLEDGE_BASE_PATH: str = str(KNOWLEDGE_BASE_DIR)

        class Config:
            env_file = str(BASE_DIR / ".env")
            extra = "allow"
except ImportError:
    from pydantic import BaseModel
    class Settings(BaseModel):
        PROJECT_NAME: str = "PlantIQ"
        API_V1_PREFIX: str = "/api"
        DEBUG: bool = True
        APP_MODE: str = os.getenv("APP_MODE", "production")
        DEMO_MODE: bool = (os.getenv("APP_MODE", "production").lower() == "demo")
        
        CONFIDENCE_THRESHOLD_LOW: float = float(os.getenv("CONFIDENCE_THRESHOLD_LOW", "0.50"))
        CONFIDENCE_THRESHOLD_MODERATE: float = float(os.getenv("CONFIDENCE_THRESHOLD_MODERATE", "0.80"))

        JWT_SECRET: str = "plantiq_super_secret_jwt_key_2026_academic_defense"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        
        MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        DATABASE_NAME: str = "plantiq_db"
        
        AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        
        WEATHER_PROVIDER: str = os.getenv("WEATHER_PROVIDER", "openweather")
        WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
        
        STORAGE_PROVIDER: str = "local"
        UPLOADS_PATH: str = str(UPLOADS_DIR)
        KNOWLEDGE_BASE_PATH: str = str(KNOWLEDGE_BASE_DIR)

settings = Settings()
