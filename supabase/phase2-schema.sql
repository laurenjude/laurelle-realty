-- =====================================================
-- LAURELLE REALTY — PHASE 2 SCHEMA
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- ─────────────────────────────────────────────────────
-- STEP 1: EXTENSIONS
-- ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────
-- STEP 2: NEW TABLES
-- ─────────────────────────────────────────────────────

-- profiles (auto-populated by trigger on signup)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL DEFAULT '',
  phone       TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- saved_properties
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID        NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- viewings
CREATE TABLE IF NOT EXISTS public.viewings (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id    UUID        NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  preferred_date DATE        NOT NULL,
  preferred_time TEXT        NOT NULL,
  notes          TEXT,
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add status column to inquiries (if it does not exist yet)
ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'
  CHECK (status IN ('new', 'contacted', 'closed'));

-- ─────────────────────────────────────────────────────
-- STEP 3: HELPER FUNCTION (prevents RLS recursion)
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- ─────────────────────────────────────────────────────
-- STEP 4: AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────
-- STEP 5: ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────

-- ── profiles ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select"      ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;

-- Users can see their own profile; admins can see all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Trigger inserts with SECURITY DEFINER — this allows manual fallback inserts
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── saved_properties ──
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_select_own"  ON public.saved_properties;
DROP POLICY IF EXISTS "saved_insert_own"  ON public.saved_properties;
DROP POLICY IF EXISTS "saved_delete_own"  ON public.saved_properties;

CREATE POLICY "saved_select_own" ON public.saved_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_insert_own" ON public.saved_properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_delete_own" ON public.saved_properties
  FOR DELETE USING (auth.uid() = user_id);

-- ── viewings ──
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "viewings_select"     ON public.viewings;
DROP POLICY IF EXISTS "viewings_insert_own" ON public.viewings;
DROP POLICY IF EXISTS "viewings_update"     ON public.viewings;

CREATE POLICY "viewings_select" ON public.viewings
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "viewings_insert_own" ON public.viewings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "viewings_update" ON public.viewings
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- ── properties: add admin write policies ──
DROP POLICY IF EXISTS "properties_admin_insert" ON public.properties;
DROP POLICY IF EXISTS "properties_admin_update" ON public.properties;
DROP POLICY IF EXISTS "properties_admin_delete" ON public.properties;

CREATE POLICY "properties_admin_insert" ON public.properties
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "properties_admin_update" ON public.properties
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "properties_admin_delete" ON public.properties
  FOR DELETE USING (public.is_admin());

-- ── inquiries: add admin read/update policies ──
DROP POLICY IF EXISTS "inquiries_admin_select" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_admin_update" ON public.inquiries;

CREATE POLICY "inquiries_admin_select" ON public.inquiries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "inquiries_admin_update" ON public.inquiries
  FOR UPDATE USING (public.is_admin());

-- ─────────────────────────────────────────────────────
-- STEP 6: STORAGE BUCKET FOR PROPERTY IMAGES
-- ─────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "prop_images_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "prop_images_admin_insert"  ON storage.objects;
DROP POLICY IF EXISTS "prop_images_admin_update"  ON storage.objects;
DROP POLICY IF EXISTS "prop_images_admin_delete"  ON storage.objects;

CREATE POLICY "prop_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "prop_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "prop_images_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "prop_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images' AND public.is_admin());

-- ─────────────────────────────────────────────────────
-- STEP 7: PROMOTE YOUR ACCOUNT TO ADMIN
-- Replace the email below with your actual email
-- ─────────────────────────────────────────────────────
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'laurenjude9@gmail.com';
