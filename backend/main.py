from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routes import products

settings = get_settings()

app = FastAPI(title="PriceWise API", version="1.0.0")

app.include_router(products.router, prefix=settings.API_PREFIX)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    from database import connect_to_mongo
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    from database import close_mongo_connection
    await close_mongo_connection()

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "PriceWise Backend is running"}

@app.get("/")
async def root():
    return {"message": "Welcome to PriceWise API"}
