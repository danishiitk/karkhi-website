-- ============================================================
-- Karkhi Family Tree — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- 1. Custom ENUM types
CREATE TYPE user_role AS ENUM ('super_admin', 'village_admin', 'viewer');
CREATE TYPE confidence_level AS ENUM ('high', 'medium', 'low');
-- 2. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  assigned_village_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 3. Villages table
CREATE TABLE villages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  urdu_name TEXT NOT NULL,
  hindi_name TEXT,
  alternate_spellings TEXT[] DEFAULT '{}',
  confidence confidence_level NOT NULL DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- 4. People table (males only — no mother/spouse fields)
CREATE TABLE people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  urdu_name TEXT,
  hindi_name TEXT,
  father_id TEXT REFERENCES people(id) ON DELETE SET NULL,
  village_id TEXT NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  generation INTEGER,
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  confidence confidence_level NOT NULL DEFAULT 'medium',
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Full-text search column (auto-generated)
ALTER TABLE people ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(urdu_name, '') || ' ' || coalesce(hindi_name, '') || ' ' || coalesce(notes, ''))
  ) STORED;
CREATE INDEX idx_people_search ON people USING GIN (search_vector);
CREATE INDEX idx_people_village ON people (village_id);
CREATE INDEX idx_people_father ON people (father_id);
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- 5. Row Level Security
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
-- Profiles policies
CREATE POLICY "Public profiles read" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admin can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
-- Villages policies
CREATE POLICY "Public villages read" ON villages
  FOR SELECT USING (true);
CREATE POLICY "Super admin can manage villages" ON villages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
-- People policies
CREATE POLICY "Public people read" ON people
  FOR SELECT USING (true);
CREATE POLICY "Contributors can insert people" ON people
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'village_admin')
      AND (
        profiles.role = 'super_admin'
        OR profiles.assigned_village_id = village_id
      )
    )
  );
CREATE POLICY "Admins can update people" ON people
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'village_admin' AND profiles.assigned_village_id = people.village_id)
      )
    )
  );
CREATE POLICY "Super admin can delete people" ON people
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
-- 6. Recursive lineage function (used for ancestor lookups)
CREATE OR REPLACE FUNCTION get_lineage(person_id TEXT)
RETURNS TABLE(
  id TEXT,
  name TEXT,
  urdu_name TEXT,
  father_id TEXT,
  village_id TEXT,
  generation INTEGER,
  depth INTEGER
) AS $$
  WITH RECURSIVE lineage AS (
    SELECT p.id, p.name, p.urdu_name, p.father_id, p.village_id, p.generation, 0 AS depth
    FROM people p WHERE p.id = person_id
    UNION ALL
    SELECT p.id, p.name, p.urdu_name, p.father_id, p.village_id, p.generation, l.depth + 1
    FROM people p
    INNER JOIN lineage l ON p.id = l.father_id
  )
  SELECT * FROM lineage ORDER BY depth;
$$ LANGUAGE sql STABLE;
