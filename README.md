# PriceWise 🚀

**PriceWise** is an AI-powered shopping intelligence platform that aggregates product listings from multiple e-commerce sources, compares prices in real time, tracks price changes, and delivers personalized recommendations based on user behavior. The platform combines a modern interactive frontend with a scalable backend that handles product normalization, AI reasoning, price tracking, analytics, and secure integrations, creating a smart and user-centric shopping experience.

---

## 🎯 Core Problem It Solves

*   Prices vary across platforms (Amazon, Flipkart, official sites)
*   Users manually compare deals
*   No centralized price tracking
*   No personalized shopping intelligence

**PriceWise solves this using AI + automation.**

---

## 🖥️ Architecture

### Frontend (Next.js)

The frontend is responsible for User Interaction, Product Discovery, AI Chat Interface, and Visualizing Price Changes.

**Tech Stack:**
*   **Next.js (React)**: Server-side rendering, SEO, fast UI
*   **TypeScript**: Type safety, scalable code
*   **Tailwind CSS**: Fast, consistent styling
*   **Framer Motion**: Animations & micro-interactions
*   **Zustand**: Lightweight global state management
*   **Clerk**: Authentication & user sessions

### Backend (FastAPI)

The backend acts as the intelligence & data layer, handling Product Aggregation, Price Tracking, AI Orchestration, and Analytics.

**Tech Stack:**
*   **FastAPI (Python)**: High-performance API
*   **Pydantic**: Data validation
*   **MongoDB / PostgreSQL**: Data persistence
*   **Celery / APScheduler**: Background jobs
*   **Redis (Optional)**: Caching & rate limiting
*   **Groq / Gemini API**: AI reasoning

---

## ✨ Key Features

### 🔹 Product Search & Comparison
- User searches for a product.
- Frontend requests aggregated product data from backend.
- Displays same product across multiple platforms with prices.

### 🔹 AI Chat Assistant
- Conversational interface (e.g., *"Which deal is best?"*).
- Frontend sends query to backend AI endpoint.
- Displays explainable AI response.

### 🔹 Price Tracking System
- Scheduled background jobs periodically fetch latest prices.
- Stores price history and detects price drops.
- Visualizes trends with line charts.

### 🔹 User Analytics & Personalization
- Tracks searches, clicks, and category frequency.
- Computes preferred categories and budget range.

---

## 📂 Folder Structure

### Frontend
```
/frontend
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── products/
│   ├── chat/
│   └── profile/
├── components/
├── store/
├── lib/
└── styles/
```

### Backend
```
/backend
├── main.py
├── config.py
├── database.py
├── routes/
├── services/
├── models/
└── jobs/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm/yarn
- Python 3.10+
- MongoDB/PostgreSQL instance
- API Keys (Clerk, Gemini/Groq, etc.)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pricewise.git
    cd pricewise
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
