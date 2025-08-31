
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WaterReading, ReservoirReading } from '@/types/waterReadings';
import { VALID_WATER_SOURCES, normalizeWaterSource } from '@/constants/waterSources';

export const fetchWaterReadings = async (): Promise<WaterReading[]> => {
  try {
    console.log('Fetching water readings from canonical view...');
    // Query view not present in generated types; use a minimal cast
    const { data, error }: { data: unknown; error: { message: string } | null } = await (supabase as unknown as {
      from: (relation: string) => {
        select: (columns: string) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>
        }
      }
    })
      .from('v_water_readings_canonical')
      .select('*')
      .order('date', { ascending: false });

    console.log('Raw data from Supabase:', data);
    console.log('Error if any:', error);

    if (error) {
      console.error('Error fetching water readings:', error);
      toast.error('Failed to fetch water readings');
      return [];
    }

    type CanonicalRow = Partial<WaterReading> & {
      source_name?: string | null;
      water_source_id?: number | null;
    };
    const rows: CanonicalRow[] = Array.isArray(data) ? (data as CanonicalRow[]) : [];

    if (rows.length > 0) {
      // Prefer canonical source_name from the view; fall back to normalization heuristics if missing
      const filteredData: WaterReading[] = rows
        .map((r) => {
          const source = r.source_name
            || normalizeWaterSource(r.component_type)
            || normalizeWaterSource(r.component_name)
            || r.component_type
            || r.component_name;

          return {
            ...r,
            // Keep downstream compatibility by setting component_type to canonical label
            component_type: String(source ?? ''),
            component_name: (r.component_name ?? (source ? String(source) : null)) as string | null,
          } as WaterReading;
        })
        .filter((r) => VALID_WATER_SOURCES.includes(r.component_type));

      console.log(`Successfully fetched ${rows.length} total readings from view, ${filteredData.length} valid readings`);
      console.log('Sample reading:', filteredData[0]);
      return filteredData || [];
    } else {
      console.log('No water readings found in database');
      return [];
    }
  } catch (error) {
    console.error('Exception while fetching water readings:', error);
    toast.error('Failed to fetch water readings');
    return [];
  }
};

export const fetchReservoirReadings = async (): Promise<ReservoirReading[]> => {
  try {
    console.log('Fetching reservoir readings...');
    const { data, error } = await supabase
      .from('reservoir_readings')
      .select('*')
      .order('reading_date', { ascending: false });

    if (error) {
      console.error('Error fetching reservoir readings:', error);
      toast.error('Failed to fetch reservoir readings');
      return [];
    }

    console.log('Fetched reservoir readings:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching reservoir readings:', error);
    toast.error('Failed to fetch reservoir readings');
    return [];
  }
};

export interface WaterSourceOption {
  id: number;
  name: string;
  label: string;
}

export const fetchWaterSourcesWithIds = async (): Promise<WaterSourceOption[]> => {
  try {
    console.log('Fetching active water sources with IDs...');
    
    // Use raw query since water_sources table might not be in generated types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (supabase as any)
      .from('water_sources')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (result.error) {
      console.error('Error fetching water sources:', result.error);
      toast.error('Failed to fetch water sources');
      return [];
    }
    
    interface WaterSourceRow {
      id: number;
      name: string;
    }
    
    const sources: WaterSourceOption[] = (result.data || []).map((source: WaterSourceRow) => ({
      id: source.id,
      name: source.name,
      label: source.name
    }));

    console.log(`Fetched ${sources.length} active water sources`);
    return sources;
  } catch (error) {
    console.error('Error fetching water sources:', error);
    toast.error('Failed to fetch water sources');
    return [];
  }
};
