# Phase 1 Implementation Checklist

Phase 1 focuses on setting up the core infrastructure and a "Walking Skeleton" - a tiny implementation of the system that performs a small end-to-end function (e.g., frontend calls backend, backend returns mock data).

## ✅ Frontend Setup (Next.js)
- [ ] Initialize Next.js project (`npx create-next-app@latest`)
- [ ] Install dependencies: `clerk`, `framer-motion`, `zustand`, `lucide-react`, `axios`
- [ ] Configure Tailwind CSS
- [ ] Setup Clerk Authentication (Login/Signup pages)
- [ ] Create basic Layout (Navbar, Footer)
- [ ] Create `api.ts` axios instance for backend communication

## ✅ Backend Setup (FastAPI)
- [ ] Create virtual environment & install `fastapi`, `uvicorn`, `pydantic`, `motor` (or `sqlalchemy`), `python-dotenv`
- [ ] Create `main.py` with valid Health Check endpoint (`/health`)
- [ ] Configure `CORS` to allow frontend requests
- [ ] Setup environment variables (`.env`)

## ✅ Database Integration
- [ ] Setup connection to Database (MongoDB or PostgreSQL)
- [ ] Create `User` model
- [ ] Create `Product` model

## ✅ Core Feature: Real Product Search & Aggregation
- [ ] Backend: Integration with **SerpApi (Google Shopping)** for real-time data.
- [ ] Backend: Create `GET /products/search?q=...` endpoint fetching live results.
- [ ] Frontend: Create Search Bar & connection to Backend.
- [ ] Frontend: Display Real Product Cards with images/prices from Amazon, Walmart, etc.

## ✅ Deployment Prep
- [ ] Create `Dockerfile` for Backend (Optional for local dev, good for later)
- [ ] Ensure `npm run build` passes on Frontend
