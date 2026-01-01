# Database Schema Design

PriceWise can utilize **PostgreSQL** for relational integrity (Users, Alerts) combined with **JSONB** or **MongoDB** for flexible product data storage. Below is a normalized schema design suitable for a SQL-based approach (PostgreSQL).

## 1. Users Table
Stores user account information and authentication details (managed by Clerk).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    preferences JSONB DEFAULT '{}' -- Stores preferred categories, currency, etc.
);
```

## 2. Products Table
Stores normalized product information. A single product might be linked to multiple store URLs.

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    description TEXT,
    unique_identifier VARCHAR(255), -- e.g., UPC, EAN, or a normalized slug
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. ProductLinks Table (One-to-Many with Products)
Connects a normalized product to specific listings on external sites (Amazon, Flipkart).

```sql
CREATE TABLE product_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_name VARCHAR(50) NOT NULL, -- 'Amazon', 'Flipkart'
    url TEXT NOT NULL,
    external_id VARCHAR(255), -- ID on the external site (e.g., ASIN)
    current_price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    in_stock BOOLEAN DEFAULT TRUE,
    last_checked TIMESTAMP DEFAULT NOW()
);
```

## 4. PriceHistory Table (TimeSeries Data)
Tracks price changes over time for a specific product link.

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES product_links(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## 5. Alerts Table
Stores user price alerts.

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    target_price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. SearchHistory Table
Tracks user search behavior for personalization.

```sql
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    category_inferred VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);
```
