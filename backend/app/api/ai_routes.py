from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter
from app.schemas.weather_schemas import AIChatRequest, AIChatResponse
from app.ai.provider import get_ai_provider
from app.services.rag import get_rag_service
from app.database.connection import get_database

router = APIRouter(tags=["Grounded AI Assistant & RAG"])

class RAGQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4

@router.post("/ai/chat", response_model=AIChatResponse)
async def chat_with_assistant(req: AIChatRequest):
    ai_provider = get_ai_provider()
    db = get_database()
    
    # 1. Resolve scan context from request
    scan_ctx = req.scan_context or req.scanContext

    # 2. If empty, automatically load the latest scan from the database!
    if not scan_ctx and db.scans:
        latest = list(db.scans.values())[-1]
        scan_ctx = {
            "plant_name": latest.get("plant_name", "Plant Specimen"),
            "disease": latest.get("disease", "Unknown"),
            "pathogen": latest.get("pathogen", "N/A"),
            "confidence": latest.get("confidence", 0.95),
            "severity": latest.get("severity", {}).get("label") if isinstance(latest.get("severity"), dict) else latest.get("severity", "Low"),
            "segmentation": latest.get("segmentation", {}),
            "environmental_context": latest.get("environment") or latest.get("environmental_context", {}),
            "ai_health_report": latest.get("advisory") or latest.get("ai_health_report", {})
        }

    result = ai_provider.generate_chat_response(
        user_message=req.message,
        scan_context=scan_ctx,
        language=req.language
    )
    return AIChatResponse(
        reply=result["reply"],
        language=result["language"],
        timestamp=datetime.utcnow().strftime("%I:%M %p"),
        citations=result.get("citations", [])
    )

@router.post("/rag/query")
async def query_knowledge_base(req: RAGQueryRequest):
    """
    Direct RAG search across indexed plant pathology knowledge base chunks.
    """
    rag = get_rag_service()
    results = rag.retrieve(req.query, top_k=req.top_k or 4)
    formatted = []
    for chunk, score in results:
        formatted.append({
            "title": chunk.metadata.get("title", "Plant Pathology Guide"),
            "source": chunk.metadata.get("source", "PlantIQ Knowledge Base"),
            "document_id": chunk.metadata.get("document_id", "DOC-KB"),
            "score": score,
            "content": chunk.content
        })
    return {
        "query": req.query,
        "results_count": len(formatted),
        "results": formatted
    }
