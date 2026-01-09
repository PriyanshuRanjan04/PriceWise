from fastapi import APIRouter, HTTPException, Depends
from database import get_database
from models.product import Product, PriceHistory
from services.serpapi_service import serpapi_service
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/tracker", tags=["tracker"])

@router.post("/track")
async def track_product(product_data: dict, db = Depends(get_database)):
    """
    Add a product to the database to start tracking its price.
    """
    try:
        # Check if already tracking
        existing = await db.products.find_one({"product_id": product_data["product_id"]})
        
        if existing:
            return {"message": "Already tracking this product", "id": str(existing["_id"])}
        
        # Initial history entry
        product_data["history"] = [
            {"price": product_data["price"], "timestamp": datetime.utcnow()}
        ]
        product_data["last_updated"] = datetime.utcnow()
        
        result = await db.products.insert_one(product_data)
        return {"message": "Started tracking product", "id": str(result.inserted_id)}
    except Exception as e:
        print(f"Track Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{product_id}")
async def get_price_history(product_id: str, db = Depends(get_database)):
    try:
        product = await db.products.find_one({"product_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {"history": product.get("history", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracked")
async def get_tracked_products(db = Depends(get_database)):
    """
    Get all tracked products with their latest price and history.
    """
    try:
        # Convert _id to string for JSON serialization
        products = await db.products.find().to_list(length=100)
        for p in products:
            p["id"] = str(p["_id"])
            del p["_id"]
        return {"products": products}
    except Exception as e:
        print(f"Error fetching tracked products: {e}")
        raise HTTPException(status_code=500, detail=str(e))
