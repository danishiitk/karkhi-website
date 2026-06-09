-- Run this in your Supabase SQL Editor to remove all the auto-generated placeholder notes
UPDATE villages SET notes = NULL WHERE notes LIKE '%Village branch identified%';
UPDATE people SET notes = NULL WHERE notes LIKE '%Branch metadata for%';
