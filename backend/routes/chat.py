from fastapi import APIRouter, HTTPException, Body
from services.ai_service import ai_service
from services.serpapi_service import serpapi_service
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    include_search: bool = True
    context_products: Optional[List] = None

@router.post("/")
async def chat_with_ai(request: ChatRequest = Body(...)):
    """
    Unified AI Chat Endpoint.
    1. Optionally searches for products if intent is detected or requested.
    2. Sends context + results to AI for reasoning.
    """
    try:
        results = []
        if request.include_search and len(request.message.split()) > 2:
            # Simple heuristic: if message is more than 2 words, try searching
            results = await serpapi_service.search_products(request.message)
        
        response = await ai_service.get_chat_response(
            user_query=request.message,
            search_results=results or request.context_products
        )
        
        return {
            "response": response,
            "results": results
        }
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
