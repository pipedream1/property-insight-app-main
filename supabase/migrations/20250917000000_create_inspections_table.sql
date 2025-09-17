-- Create inspections table for property component inspections
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  inspector_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  photos JSONB DEFAULT '[]'::jsonb, -- Array of photo URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own inspections" ON inspections FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert their own inspections" ON inspections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own inspections" ON inspections FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for inspection photos
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', true);

-- Storage policies for inspection photos
CREATE POLICY "Users can upload inspection photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inspection-photos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can view inspection photos" ON storage.objects FOR SELECT USING (bucket_id = 'inspection-photos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own inspection photos" ON storage.objects FOR DELETE USING (bucket_id = 'inspection-photos' AND auth.uid() IS NOT NULL);
