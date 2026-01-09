from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PriceHistory(BaseModel):
    price: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Product(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    price: str
    source: str
    link: str
    thumbnail: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    product_id: str # External ID from SerpApi
    history: List[PriceHistory] = []
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
class Watchlist(BaseModel):
    user_id: str
    product_ids: List[str] = [] # List of internal MongoDB IDs
