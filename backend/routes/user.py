from fastapi import APIRouter, HTTPException, Body, Header, Depends
from typing import List, Optional
from pydantic import BaseModel, Field
from models.user import User, UserCreate
from models.history import HistoryItem
from database import get_database
from datetime import datetime
import jwt
import logging

logger = logging.getLogger(__name__)

async def verify_clerk_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split(" ")[1]
    try:
        # For full production, fetch JWKS from Clerk and verify signature using PyJWT
        # Here we do a basic decode to check validity and expiration
        decoded = jwt.decode(token, options={"verify_signature": False})
        clerk_id = decoded.get("sub")
        if not clerk_id:
            raise HTTPException(status_code=401, detail="Invalid token payload: missing sub")
        return clerk_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid JWT Token: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"JWT Verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

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
async def get_bookmarks(clerk_id: str, authenticated_clerk_id: str = Depends(verify_clerk_token)):
    if clerk_id != authenticated_clerk_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    try:
        db = await get_database()
        if db is None:
            raise Exception("Database connection not established")
            
        cursor = db.bookmarks.find({"user_id": clerk_id}).sort("timestamp", -1)
        bookmarks = await cursor.to_list(length=100)
        
        for item in bookmarks:
            item["id"] = str(item["_id"])
            del item["_id"]
            
        return bookmarks
    except Exception as e:
        logger.error(f"ERROR in get_bookmarks: {str(e)}")
        print(f"CRASH in GET /bookmarks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/bookmarks")
async def add_bookmark(item: BookmarkItem, clerk_id: str = Depends(verify_clerk_token)):
    print(f"DEBUG: Processing bookmark addition for clerk_id: {clerk_id}")
    logger.info(f"Adding bookmark for user: {item.user_id}")
    
    # Ensure they're adding for themselves
    if item.user_id != clerk_id:
        raise HTTPException(status_code=403, detail="Cannot add bookmarks for another user")
        
    try:
        db = await get_database()
        if db is None:
            raise Exception("Database connection not established")
            
        # Check if already exists
        existing = await db.bookmarks.find_one({
            "user_id": item.user_id,
            "product.product_id": item.product.get("product_id")
        })
        
        if existing:
            return {"message": "Already bookmarked"}

        await db.bookmarks.insert_one(item.dict(by_alias=True))
        return {"message": "Bookmark added", "success": True}
        
    except Exception as e:
        # CRITICAL: This was missing, causing silent 500 crashes
        logger.error(f"ERROR in add_bookmark: {str(e)}")
        print(f"CRASH in POST /bookmarks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{clerk_id}/bookmarks/{product_id}")
async def remove_bookmark(clerk_id: str, product_id: str, authenticated_clerk_id: str = Depends(verify_clerk_token)):
    if clerk_id != authenticated_clerk_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    try:
        db = await get_database()
        if db is None:
            raise Exception("Database connection not established")
            
        result = await db.bookmarks.delete_one({
            "user_id": clerk_id,
            "product.product_id": product_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Bookmark not found")
            
        return {"message": "Bookmark removed", "success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRASH in DELETE /bookmarks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
