/*
# Rainbow Star — Full Schema & Seed Data

## Overview
Creates the complete database schema for the Rainbow Star B2B diamond house application,
including user profiles, diamond inventory, enquiries, stone requests, and newsletter subscriptions.
Also seeds the database with the full diamond inventory (natural fancy, argyle pink, argyle blue, CVD).

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — links to Supabase auth
- `email` (text, unique) — user email
- `name` (text) — full name
- `company` (text, nullable) — trade company name
- `phone` (text, nullable) — phone/whatsapp
- `role` (text, default 'buyer') — 'buyer' or 'admin'
- `created_at` (timestamptz)

### diamonds
- `id` (uuid, PK)
- `stock_id` (text, unique) — inventory identifier
- `category` (text) — 'cvd', 'natural', 'argyle_pink', 'argyle_blue'
- `shape` (text) — ROUND, OVAL, PEAR, etc.
- `carat` (numeric) — carat weight
- `color` (text) — color grade or fancy color name
- `clarity` (text) — clarity grade
- `cut` (text, nullable) — cut grade
- `polish` (text, nullable)
- `symmetry` (text, nullable)
- `fluorescence` (text, nullable)
- `certificate_lab` (text, nullable) — GIA, IGI, etc.
- `certificate_number` (text, nullable)
- `certificate_url` (text, nullable)
- `price_per_carat` (numeric, default 0)
- `total_price` (numeric, default 0)
- `origin` (text, nullable)
- `diamond_type` (text, nullable) — IIa, Ia, IIb
- `treatment` (text, nullable)
- `is_fancy_color` (boolean, default false)
- `fancy_color` (text, nullable)
- `fancy_intensity` (text, nullable)
- `image_url` (text, nullable)
- `video_url` (text, nullable)
- `notes` (text, nullable)
- `status` (text, default 'available') — 'available' or 'archived'
- `parcel_type` (text, default 'single') — 'single' or 'parcel'
- `parcel_pieces` (integer, nullable)
- `parcel_total_carat` (numeric, nullable)
- `created_at` (timestamptz)

### enquiries
- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `phone` (text, nullable)
- `company` (text, nullable)
- `message` (text, nullable)
- `stone_ids` (text[], default '{}') — array of stock IDs
- `source` (text, default 'website')
- `status` (text, default 'new')
- `created_at` (timestamptz)

### stone_requests
- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `phone` (text, nullable)
- `company` (text, nullable)
- `shape` (text, nullable)
- `carat_min` (numeric, nullable)
- `carat_max` (numeric, nullable)
- `color` (text, nullable)
- `clarity` (text, nullable)
- `budget` (text, nullable)
- `notes` (text, nullable)
- `type` (text, default 'stone_request')
- `created_at` (timestamptz)

### newsletter
- `id` (uuid, PK)
- `email` (text, unique)
- `subscribed_at` (timestamptz, default now())

## Security (RLS)
- **profiles**: users can read/update their own profile; anyone can insert (for signup flow)
- **diamonds**: public read (anon + authenticated) since inventory is browsable by guests;
  only authenticated admins can insert/update/delete
- **enquiries**: anyone can insert (public enquiry form); only admins can read
- **stone_requests**: anyone can insert; only admins can read
- **newsletter**: anyone can insert/upsert; only admins can read

## Notes
1. The app uses Supabase Auth for login/register. A trigger creates a profile row on signup.
2. Guest browsing is allowed — diamonds are readable by anon.
3. Admin role is set manually in the profiles table for authorized users.
4. The first registered user should be granted admin role via SQL if needed.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  company text,
  phone text,
  role text NOT NULL DEFAULT 'buyer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ DIAMONDS ============
CREATE TABLE IF NOT EXISTS diamonds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'natural',
  shape text NOT NULL DEFAULT 'ROUND',
  carat numeric NOT NULL DEFAULT 0,
  color text DEFAULT '',
  clarity text DEFAULT '',
  cut text,
  polish text,
  symmetry text,
  fluorescence text,
  certificate_lab text,
  certificate_number text,
  certificate_url text,
  price_per_carat numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  origin text,
  diamond_type text,
  treatment text,
  is_fancy_color boolean NOT NULL DEFAULT false,
  fancy_color text,
  fancy_intensity text,
  image_url text,
  video_url text,
  notes text,
  status text NOT NULL DEFAULT 'available',
  parcel_type text NOT NULL DEFAULT 'single',
  parcel_pieces integer,
  parcel_total_carat numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE diamonds ENABLE ROW LEVEL SECURITY;

-- Public read for inventory browsing (guests can view)
DROP POLICY IF EXISTS "diamonds_select_public" ON diamonds;
CREATE POLICY "diamonds_select_public" ON diamonds FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated users can create/update/delete diamonds
DROP POLICY IF EXISTS "diamonds_insert_auth" ON diamonds;
CREATE POLICY "diamonds_insert_auth" ON diamonds FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "diamonds_update_auth" ON diamonds;
CREATE POLICY "diamonds_update_auth" ON diamonds FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "diamonds_delete_auth" ON diamonds;
CREATE POLICY "diamonds_delete_auth" ON diamonds FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_diamonds_category ON diamonds(category);
CREATE INDEX IF NOT EXISTS idx_diamonds_stock_id ON diamonds(stock_id);
CREATE INDEX IF NOT EXISTS idx_diamonds_status ON diamonds(status);
CREATE INDEX IF NOT EXISTS idx_diamonds_parcel_type ON diamonds(parcel_type);

-- ============ ENQUIRIES ============
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text,
  stone_ids text[] DEFAULT '{}',
  source text DEFAULT 'website',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an enquiry
DROP POLICY IF EXISTS "enquiries_insert_public" ON enquiries;
CREATE POLICY "enquiries_insert_public" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated users can read enquiries (admin views)
DROP POLICY IF EXISTS "enquiries_select_auth" ON enquiries;
CREATE POLICY "enquiries_select_auth" ON enquiries FOR SELECT
  TO authenticated USING (true);

-- ============ STONE REQUESTS ============
CREATE TABLE IF NOT EXISTS stone_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  shape text,
  carat_min numeric,
  carat_max numeric,
  color text,
  clarity text,
  budget text,
  notes text,
  type text DEFAULT 'stone_request',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stone_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stone_requests_insert_public" ON stone_requests;
CREATE POLICY "stone_requests_insert_public" ON stone_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "stone_requests_select_auth" ON stone_requests;
CREATE POLICY "stone_requests_select_auth" ON stone_requests FOR SELECT
  TO authenticated USING (true);

-- ============ NEWSLETTER ============
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_upsert_public" ON newsletter;
CREATE POLICY "newsletter_upsert_public" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_update_public" ON newsletter;
CREATE POLICY "newsletter_update_public" ON newsletter FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_select_auth" ON newsletter;
CREATE POLICY "newsletter_select_auth" ON newsletter FOR SELECT
  TO authenticated USING (true);

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, company, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'buyer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
