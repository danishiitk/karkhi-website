-- Run this script in the Supabase SQL Editor to cleanly delete the columns

-- 1. Drop the search vector and index since it depends on the notes column
DROP INDEX IF EXISTS idx_people_search;
ALTER TABLE people DROP COLUMN IF EXISTS search_vector;

-- 2. Drop the notes and confidence columns
ALTER TABLE people DROP COLUMN IF EXISTS notes;
ALTER TABLE people DROP COLUMN IF EXISTS confidence;

ALTER TABLE villages DROP COLUMN IF EXISTS notes;
ALTER TABLE villages DROP COLUMN IF EXISTS confidence;

-- 3. Drop the confidence_level enum type
DROP TYPE IF EXISTS confidence_level CASCADE;

-- 4. Re-create the search vector without the notes column
ALTER TABLE people ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(urdu_name, '') || ' ' || coalesce(hindi_name, ''))
  ) STORED;

CREATE INDEX idx_people_search ON people USING GIN (search_vector);
