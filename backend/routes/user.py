from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional
from pydantic import BaseModel, Field
from models.user import User, UserCreate
from models.history import HistoryItem
from database import get_database
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/sync")
async def sync_user(user_data: UserCreate):
    db = await get_database()
    existing_user = await db.users.find_one({"clerk_id": user_data.clerk_id})
    
    if existing_user:
        await db.users.update_one(
            {"clerk_id": user_data.clerk_id},
            {"$set": {
                "last_login": datetime.utcnow(),
                "email": user_data.email,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name
            }}
        )
        return {"message": "User synced"}
    
    new_user = User(
        clerk_id=user_data.clerk_id,
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    await db.users.insert_one(new_user.dict(by_alias=True))
    return {"message": "User created"}

@router.get("/{clerk_id}/history")
async def get_history(clerk_id: str, limit: int = 20):
    db = await get_database()
    cursor = db.history.find({"user_id": clerk_id}).sort("timestamp", -1).limit(limit)
    history = await cursor.to_list(length=limit)
    
    # Convert _id to string
    for item in history:
        item["id"] = str(item["_id"])
        del item["_id"]
        
    return history

@router.post("/history")
async def add_history(item: HistoryItem):
    db = await get_database()
    await db.history.insert_one(item.dict(by_alias=True))
    return {"message": "History added"}

# --- Bookmarks ---

class BookmarkItem(BaseModel):
    user_id: str
    product: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

@router.get("/{clerk_id}/bookmarks")
async def get_bookmarks(clerk_id: str):
    db = await get_database()
    cursor = db.bookmarks.find({"user_id": clerk_id}).sort("timestamp", -1)
    bookmarks = await cursor.to_list(length=100)
    
    for item in bookmarks:
        item["id"] = str(item["_id"])
        del item["_id"]
        
    return bookmarks

@router.post("/bookmarks")
async def add_bookmark(item: BookmarkItem):
    db = await get_database()
    
    # Check if already exists
    existing = await db.bookmarks.find_one({
        "user_id": item.user_id,
        "product.product_id": item.product.get("product_id")
    })
    
    if existing:
        return {"message": "Already bookmarked"}

    await db.bookmarks.insert_one(item.dict(by_alias=True))
    return {"message": "Bookmark added"}

@router.delete("/{clerk_id}/bookmarks/{product_id}")
async def remove_bookmark(clerk_id: str, product_id: str):
    db = await get_database()
    result = await db.bookmarks.delete_one({
        "user_id": clerk_id,
        "product.product_id": product_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
        
    return {"message": "Bookmark removed"}
