-- MegaMall SQL starter (Postgres / MySQL compatible ideas)
-- Point Supabase/PostgREST at this table, or sync rows into data/live-catalog.json

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  slug          TEXT,
  sku           TEXT,
  name          TEXT NOT NULL,
  title         TEXT,
  brand         TEXT,
  price         NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  mrp           NUMERIC,
  currency      TEXT DEFAULT 'INR',
  rating        NUMERIC DEFAULT 4.5,
  review_count  INTEGER DEFAULT 0,
  category      TEXT,
  subcategory   TEXT,
  store_id      TEXT,
  image         TEXT,
  image_url     TEXT,
  description   TEXT,
  colors        TEXT,
  sizes         TEXT,
  stock         INTEGER,
  badges        TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Optional mall structure
CREATE TABLE IF NOT EXISTS stores (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  category     TEXT,
  subcategory  TEXT,
  floor        INTEGER DEFAULT 0,
  image        TEXT,
  description  TEXT
);

-- Example row
INSERT INTO products (id, name, price, category, brand, store_id, image, stock, badges)
VALUES (
  'sql-1',
  'City Runner',
  4999,
  'sports',
  'Velocity Gear',
  'velocity',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80',
  20,
  'new,sale'
)
ON CONFLICT (id) DO NOTHING;
