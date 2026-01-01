# 🚀 PriceWise Deployment Guide

Follow these steps to deploy your application to production.

## 1️⃣ GitHub Repository Setup (Local)
Run these commands in your project root (`c:/WORK/PriceWise`) to push your code to GitHub.

```bash
# Initialize connection
git init

# Add all files
git add .

# Save complete state
git commit -m "Initial commit - PriceWise Phase 1"

# === ACTION REQUIRED ===
# 1. Go to https://github.com/new
# 2. Create a repository named 'pricewise'
# 3. Copy the command that looks like: git remote add origin ...
# 4. Run it in your terminal, for example:
# git remote add origin https://github.com/YOUR_USERNAME/pricewise.git

# Push code
git push -u origin master
```

---

## 2️⃣ Backend Deployment (Render)
We use **Render** for the Python/FastAPI backend because it's free and easy.

1.  **Dashboard**: Go to [dashboard.render.com](https://dashboard.render.com/).
2.  **New Service**: Click **New +** → **Web Service** → **Build and deploy from a Git repository**.
3.  **Connect Repo**: Select your `pricewise` repository.
4.  **Configuration**:
    *   **Name**: `pricewise-backend`
    *   **Region**: Closest to you (e.g., Singapore/US).
    *   **Root Directory**: `backend` (⚠️ **CRITICAL STEP**)
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt` (Default is usually fine)
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (Auto-detected from Procfile)
5.  **Environment Variables** (Section lower down):
    *   Add `GROQ_API_KEY`: *(Paste your key)*
    *   Add `SERPAPI_KEY`: *(Paste your key)*
    *   Add `PYTHON_VERSION`: `3.11.9` (Optional, helps stability)
6.  **Deploy**: Click **Create Web Service**.

> **Note**: It will take a few minutes. Once done, copy the URL (e.g., `https://pricewise-backend.onrender.com`).

---

## 3️⃣ Frontend Deployment (Vercel)
We use **Vercel** for the Next.js frontend.

1.  **Dashboard**: Go to [vercel.com/new](https://vercel.com/new).
2.  **Import**: Find your `pricewise` repo and click **Import**.
3.  **Project Name**: `pricewise-frontend`.
4.  **Framework Preset**: Next.js (Auto-detected).
5.  **Root Directory**: Click **Edit** and select `frontend` (⚠️ **CRITICAL STEP**).
6.  **Environment Variables**:
    *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: *(From your Clerk Dashboard)*
    *   `CLERK_SECRET_KEY`: *(From your Clerk Dashboard)*
    *   `NEXT_PUBLIC_API_URL`: **Paste your Render Backend URL here** (e.g., `https://pricewise-backend.onrender.com`).
        *   *Note: Do NOT add a trailing slash `/` at the end.*
7.  **Deploy**: Click **Deploy**.

---

## 🔍 Verification
1.  Open your Vercel URL.
2.  Try searching for a product.
3.  If results appear, your Full Stack app is live! 🚀
