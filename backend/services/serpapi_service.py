import os
import httpx
from config import get_settings

settings = get_settings()

class SerpApiService:
    BASE_URL = "https://serpapi.com/search.json"

    async def search_products(self, query: str):
        if not settings.SERPAPI_KEY:
            raise Exception("SERPAPI_KEY is missing in environment variables.")

        params = {
            "engine": "google_shopping",
            "q": query,
            "api_key": settings.SERPAPI_KEY,
            "google_domain": "google.com",
            "gl": "us", # Target US market for now
            "hl": "en"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            return self._normalize_results(data.get("shopping_results", []))

    def _normalize_results(self, results):
        """
        Normalize SerpApi data to our Product schema.
        """
        normalized = []
        for item in results:
            normalized.append({
                "title": item.get("title"),
                "price": item.get("price"),
                "source": item.get("source"),
                "link": item.get("link"),
                "thumbnail": item.get("thumbnail"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
                "product_id": item.get("product_id") 
            })
        return normalized

serpapi_service = SerpApiService()
