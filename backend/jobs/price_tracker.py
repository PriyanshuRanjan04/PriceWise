from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import get_database
from services.serpapi_service import serpapi_service
from datetime import datetime

scheduler = AsyncIOScheduler()

async def update_all_prices():
    """
    Background job to fetch latest prices for all tracked products.
    """
    db = await get_database()
    if db is None:
        print("Database not connected, skipping price update.")
        return

    tracked_products = await db.products.find().to_list(None)
    print(f"Running background price update for {len(tracked_products)} products...")

    for product in tracked_products:
        try:
            # Re-search the specific product to get latest price
            # In a real app, you'd use a specific 'product_details' engine if possible
            results = await serpapi_service.search_products(product["title"])
            
            # Find the match in results
            latest_match = next((item for item in results if item["product_id"] == product["product_id"]), None)
            
            if latest_match:
                new_price = latest_match["price"]
                
                # If price changed, add to history
                if new_price != product["price"]:
                    print(f"Price change detected for {product['title']}: {product['price']} -> {new_price}")
                    await db.products.update_one(
                        {"_id": product["_id"]},
                        {
                            "$push": {"history": {"price": new_price, "timestamp": datetime.utcnow()}},
                            "$set": {"price": new_price, "last_updated": datetime.utcnow()}
                        }
                    )
        except Exception as e:
            print(f"Failed to update price for {product['title']}: {e}")

def start_tracker():
    # Run every 6 hours
    scheduler.add_job(update_all_prices, 'interval', hours=6)
    scheduler.start()
    print("Price Tracker Scheduler started (Interval: 6h)")
