
-- Drop the specific policy that's causing the conflict and recreate all policies properly
DROP POLICY IF EXISTS "Public can view reservoir readings" ON public.reservoir_readings;

-- Check what policies currently exist and drop them systematically
DO $$ 
DECLARE
    pol_name text;
BEGIN
    -- Get all policy names for the table and drop them
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'reservoir_readings' 
        AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.reservoir_readings';
    END LOOP;
END $$;

-- Now create fresh public access policies
CREATE POLICY "Public can view reservoir readings" 
  ON public.reservoir_readings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can create reservoir readings" 
  ON public.reservoir_readings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update reservoir readings" 
  ON public.reservoir_readings 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete reservoir readings" 
  ON public.reservoir_readings 
  FOR DELETE 
  USING (true);
