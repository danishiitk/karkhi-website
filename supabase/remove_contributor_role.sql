-- =====================================================================
-- Run this script in the Supabase SQL Editor to safely remove the 
-- 'contributor' role from your existing database enum type.
-- =====================================================================

-- 1. Reassign any existing contributors to village_admin (just in case)
UPDATE profiles 
SET role = 'village_admin' 
WHERE role = 'contributor';

-- 2. Create a new enum type without the 'contributor' value
CREATE TYPE user_role_new AS ENUM ('super_admin', 'village_admin', 'viewer');

-- 3. DROP all policies that depend on the `role` column
DROP POLICY IF EXISTS "Super admin can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admin can manage villages" ON villages;
DROP POLICY IF EXISTS "Contributors can insert people" ON people;
DROP POLICY IF EXISTS "Admins can update people" ON people;
DROP POLICY IF EXISTS "Super admin can delete people" ON people;

-- 4. Drop the default on the role column to safely change its type
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- 5. Alter the column to use the new enum type
ALTER TABLE profiles 
  ALTER COLUMN role TYPE user_role_new USING role::text::user_role_new;

-- 6. Set the default back using the new type
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'viewer'::user_role_new;

-- 7. Drop the old enum type and rename the new one
DROP TYPE user_role;
ALTER TYPE user_role_new RENAME TO user_role;

-- 8. RECREATE the policies
CREATE POLICY "Super admin can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admin can manage villages" ON villages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

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
