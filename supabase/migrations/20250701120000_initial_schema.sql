/*
          # Initial Schema: Products, Transactions, and Storage
          This migration sets up the initial database structure for the digital store, including tables for products and transactions, and configures file storage for product assets.

          ## Query Description: This script is safe to run on a new project. It creates new tables and storage buckets. If you have existing tables named `products` or `transactions`, or storage buckets named `thumbnails` and `templates`, this script will fail. No data will be lost as it only performs additive operations.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables Created: `products`, `transactions`
          - Storage Buckets Created: `thumbnails` (public), `templates` (private)
          - Columns:
            - `products`: id, title, description, price, thumbnail_url, file_path, created_at
            - `transactions`: id, email, product_id, reference, verified, download_token, created_at
          - Relationships: `transactions.product_id` references `products.id`
          
          ## Security Implications:
          - RLS Status: Enabled on both tables.
          - Policy Changes: Yes.
            - `products`: Allows public read access (`SELECT`).
            - `transactions`: Allows public read access (`SELECT`). This is for demo purposes and should be locked down in production.
          - Auth Requirements: None for read access. Write access is currently open but should be restricted to admins.
          
          ## Performance Impact:
          - Indexes: Primary key indexes are automatically created.
          - Triggers: None.
          - Estimated Impact: Low. Initial setup of tables.
          */

-- 1. Create Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL,
    thumbnail_url TEXT,
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    reference TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    download_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Storage Buckets
-- Bucket for public-facing thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Bucket for private, secure template files
INSERT INTO storage.buckets (id, name, public)
VALUES ('templates', 'templates', FALSE)
ON CONFLICT (id) DO NOTHING;


-- 4. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow public read access to all products
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
USING (TRUE);

-- Allow anonymous users to perform all operations on products (for admin demo)
-- !!WARNING!! THIS SHOULD BE REPLACED WITH AUTHENTICATED ADMIN-ONLY POLICIES IN PRODUCTION
CREATE POLICY "Allow anon full access to products for admin"
ON products
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

-- Allow public read access to transactions (for demo purposes)
-- !!WARNING!! THIS SHOULD BE LOCKED DOWN IN PRODUCTION
CREATE POLICY "Allow public read access to transactions"
ON transactions
FOR SELECT
USING (TRUE);

-- Allow anonymous users to create transactions
CREATE POLICY "Allow anon to create transactions"
ON transactions
FOR INSERT
WITH CHECK (TRUE);

-- Allow anonymous users to update transactions (for payment verification demo)
-- !!WARNING!! THIS SHOULD BE HANDLED BY A SECURE EDGE FUNCTION IN PRODUCTION
CREATE POLICY "Allow anon to update transactions for verification"
ON transactions
FOR UPDATE
USING (TRUE)
WITH CHECK (TRUE);

-- Set permissions for storage buckets
CREATE POLICY "Allow public read access to thumbnails"
ON storage.objects FOR SELECT
USING ( bucket_id = 'thumbnails' );

CREATE POLICY "Allow anon to upload to thumbnails"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'thumbnails' );

CREATE POLICY "Allow anon to delete from thumbnails"
ON storage.objects FOR DELETE
USING ( bucket_id = 'thumbnails' );

CREATE POLICY "Allow anon to upload to templates"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'templates' );

CREATE POLICY "Allow anon to delete from templates"
ON storage.objects FOR DELETE
USING ( bucket_id = 'templates' );
