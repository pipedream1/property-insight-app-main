import { supabase } from '@/integrations/supabase/client';

export type WaterSource = {
  id: number;
  canonical_name: string;
  created_at?: string | null;
};

export type WaterSourceAlias = {
  id: number;
  water_source_id: number;
  alias: string;
  created_at?: string | null;
};

// These tables may not be present in generated Supabase types; use a minimal cast.
const s = supabase as unknown as {
  from: (table: string) => {
    select: (cols: string) => any;
    insert: (values: any) => any;
    delete: () => { eq: (col: string, val: any) => any };
  };
};

export async function fetchWaterSources(): Promise<WaterSource[]> {
  const { data, error } = await s.from('water_sources').select('*');
  if (error) throw error;
  return (data ?? []) as WaterSource[];
}

export async function fetchWaterSourceAliases(): Promise<WaterSourceAlias[]> {
  const { data, error } = await s.from('water_source_aliases').select('*');
  if (error) throw error;
  return (data ?? []) as WaterSourceAlias[];
}

export async function addAlias(water_source_id: number, alias: string) {
  const { error } = await s.from('water_source_aliases').insert([{ water_source_id, alias }]);
  if (error) throw error;
}

export async function deleteAlias(id: number) {
  const { error } = await s.from('water_source_aliases').delete().eq('id', id);
  if (error) throw error;
}
