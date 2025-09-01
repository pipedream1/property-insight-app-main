-- Optional: Relax RLS to allow authenticated users to insert their own readings
-- Apply when ready via the migrations workflow after setting SUPABASE_DB_URL.

-- ensure policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'water_readings' AND policyname = 'allow_authenticated_inserts'
  ) THEN
    CREATE POLICY "allow_authenticated_inserts" ON public.water_readings
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END$$;
