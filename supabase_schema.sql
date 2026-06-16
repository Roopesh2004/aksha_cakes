-- Aksha Cakes Supabase Schema Definitions
-- This script sets up the tables, relations, indexes, and Row Level Security (RLS) policies.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories Policies:
-- Allow anyone to read categories
CREATE POLICY "Allow public read access to categories" 
ON public.categories FOR SELECT 
USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow admin all actions on categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 2. CAKES TABLE
CREATE TABLE IF NOT EXISTS public.cakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    weight TEXT NOT NULL DEFAULT '1 kg', -- e.g., '0.5 kg', '1 kg', '2 kg'
    flavor TEXT NOT NULL DEFAULT 'Vanilla',
    image_url TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    available BOOLEAN DEFAULT true NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for cakes
ALTER TABLE public.cakes ENABLE ROW LEVEL SECURITY;

-- Cakes Policies:
-- Allow anyone to read cakes
CREATE POLICY "Allow public read access to cakes" 
ON public.cakes FOR SELECT 
USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow admin all actions on cakes" 
ON public.cakes FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery Policies:
-- Allow anyone to read gallery
CREATE POLICY "Allow public read access to gallery" 
ON public.gallery FOR SELECT 
USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow admin all actions on gallery" 
ON public.gallery FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews Policies:
-- Allow anyone to read approved reviews
CREATE POLICY "Allow public read access to approved reviews" 
ON public.reviews FOR SELECT 
USING (approved = true);

-- Allow anyone to insert reviews (for moderation by admin)
CREATE POLICY "Allow public to submit reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow admin all actions on reviews" 
ON public.reviews FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 5. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    cake_id UUID REFERENCES public.cakes(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    event_date DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for enquiries
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Enquiries Policies:
-- Allow public to insert enquiries (customer booking)
CREATE POLICY "Allow public to submit enquiries" 
ON public.enquiries FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (Admin) full access (read, edit status, delete)
CREATE POLICY "Allow admin all actions on enquiries" 
ON public.enquiries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 6. STORAGE BUCKETS SETUP NOTE
-- Note: Create buckets named 'cakes' and 'gallery' and make them public.
-- If SQL access is available, policies for storage:
-- (Uncomment and run if you have permissions on storage.objects)
/*
CREATE POLICY "Allow public to read cakes storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'cakes');

CREATE POLICY "Allow admin to manage cakes storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'cakes')
WITH CHECK (bucket_id = 'cakes');

CREATE POLICY "Allow public to read gallery storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Allow admin to manage gallery storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');
*/
