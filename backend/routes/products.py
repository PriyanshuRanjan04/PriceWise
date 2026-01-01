from fastapi import APIRouter, HTTPException, Query
from services.serpapi_service import serpapi_service

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/search")
async def search_products(q: str = Query(..., description="Product search query")):
    """
    Search for products using SerpApi (Google Shopping).
    """
    try:
        results = await serpapi_service.search_products(q)
        return {"results": results}
    except Exception as e:
        print(f"Search Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
