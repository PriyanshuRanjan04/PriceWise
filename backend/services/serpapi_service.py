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
            "google_domain": "google.co.in",
            "gl": "in", # Target Indian market
            "hl": "en"
        }

        async with httpx.AsyncClient() as client:
            print(f"Searching SerpApi for: {query}")
            response = await client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("shopping_results", [])
            print(f"Found {len(results)} shopping results for: {query}")
            
            if not results:
                print(f"SerpApi raw response keys: {data.keys()}")
                if "error" in data:
                    print(f"SerpApi Error: {data['error']}")
            
            return self._normalize_results(results)

    def _normalize_results(self, results):
        """
        Normalize SerpApi data to our Product schema.
        Ensures price is captured correctly from various SerpApi fields.
        """
        normalized = []
        for item in results:
            # SerpApi can return price in 'price', 'extracted_price', or 'raw_price'
            price = item.get("price") or item.get("extracted_price")
            
            # If price is a number (extracted_price), format it as ₹
            if isinstance(price, (int, float)):
                price = f"₹{price:,}"
            elif price and "$" in str(price):
                # Fallback: If for some reason it's still in USD, mark it clearly
                # or we could do a rough conversion (1 USD ~ 83 INR)
                # But gl: in should prevent this.
                pass

            normalized.append({
                "title": item.get("title"),
                "price": price or "Price N/A",
                "source": item.get("source"),
                "link": item.get("link"),
                "thumbnail": item.get("thumbnail"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
                "product_id": item.get("product_id") or self._generate_id(item)
            })
        return normalized

    def _generate_id(self, item):
        import hashlib
        # Prioritize link as unique identifier
        unique_str = item.get("link") or (item.get("title", "") + item.get("source", ""))
        return hashlib.md5(unique_str.encode()).hexdigest()

serpapi_service = SerpApiService()
