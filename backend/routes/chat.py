from fastapi import APIRouter, HTTPException, Body
from services.ai_service import ai_service
from services.serpapi_service import serpapi_service
from pydantic import BaseModel
from typing import Optional, List
from database import get_database
from models.history import HistoryItem

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    include_search: bool = True
    context_products: Optional[List] = None
    user_id: Optional[str] = None # Clerk ID

@router.post("/")
async def chat_with_ai(request: ChatRequest = Body(...)):
    """
    Unified AI Chat Endpoint.
    1. Optionally searches for products if intent is detected or requested.
    2. Sends context + results to AI for reasoning.
    3. Saves conversation to history if user_id is provided.
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
        
        # Save to History if Authenticated
        if request.user_id:
            try:
                db = await get_database()
                history_item = HistoryItem(
                    user_id=request.user_id,
                    type="chat",
                    query=request.message,
                    response_summary=response[:200] + "..." if len(response) > 200 else response,
                    related_products=len(results)
                )
                await db.history.insert_one(history_item.dict(by_alias=True))
            except Exception as e:
                print(f"Failed to save chat history: {e}")

        return {
            "response": response,
            "results": results
        }
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
