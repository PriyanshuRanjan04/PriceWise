from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HistoryItem(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str  # Clerk User ID
    type: str  # 'search' or 'chat'
    query: str
    response_summary: Optional[str] = None
    related_products: Optional[int] = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
