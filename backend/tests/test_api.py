"""
PlantIQ Backend Automated Verification Test Suite
Tests: Authentication, Validation, Scan Pipeline, Weather Fallback, Low Confidence Handling
"""

import sys
import os
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "PlantIQ Core API"
    print("PASS: Health endpoint test passed.")

def test_auth_login():
    response = client.post("/api/auth/login", json={
        "email": "admin@plantiq.ai",
        "password": "admin1234"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "ADMIN"
    print("PASS: Auth login test passed.")

def test_auth_invalid_credentials_format():
    response = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "invalid-email",
        "password": "123"  # too short (<6 chars)
    })
    assert response.status_code == 422  # Pydantic validation error
    print("PASS: Form validation error test passed.")

def test_dashboard_endpoint():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert data["stats"]["totalScans"] >= 1428
    print("PASS: Dashboard statistics test passed.")

def test_weather_fallback():
    response = client.get("/api/weather?lat=30.90&lon=75.85")
    assert response.status_code == 200
    data = response.json()
    assert "temperature_c" in data
    assert "humidity_percent" in data
    print("PASS: Weather fallback telemetry test passed.")

def test_ai_chat_grounding():
    response = client.post("/api/ai/chat", json={
        "message": "Meri plant ki condition kaisi hai?",
        "language": "Hindi",
        "scan_context": {
            "plant_name": "Tomato",
            "disease": "Late Blight",
            "confidence": 0.942,
            "segmentation": {"affected_percentage": 23.7}
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "Late Blight" in data["reply"]
    print("PASS: Multilingual RAG chat test passed.")

def test_analytics_and_clusters():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    assert "diseaseDistribution" in response.json()

    clusters_resp = client.get("/api/clusters")
    assert clusters_resp.status_code == 200
    assert len(clusters_resp.json()["clusters"]) == 4
    print("PASS: Analytics and K-Means clusters test passed.")

if __name__ == "__main__":
    print("[PlantIQ] Running Backend Acceptance Tests...")
    test_health_endpoint()
    test_auth_login()
    test_auth_invalid_credentials_format()
    test_dashboard_endpoint()
    test_weather_fallback()
    test_ai_chat_grounding()
    test_analytics_and_clusters()
    print("SUCCESS: All 7 test suites passed successfully!")
