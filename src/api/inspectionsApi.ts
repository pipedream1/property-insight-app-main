import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Inspection {
  id: string;
  property_id: string;
  inspection_date: string;
  inspector_name: string;
  notes: string | null;
  status: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export const fetchInspections = async (): Promise<Inspection[]> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inspections:', error);
      toast.error('Failed to fetch inspections');
      return [];
    }

    return (data || []) as Inspection[];
  } catch (error) {
    console.error('Error fetching inspections:', error);
    toast.error('Failed to fetch inspections');
    return [];
  }
};

export const createInspection = async (inspection: Omit<Inspection, 'id' | 'created_at' | 'updated_at'>): Promise<Inspection | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('inspections')
      .insert([inspection])
      .select()
      .single();

    if (error) {
      console.error('Error creating inspection:', error);
      toast.error('Failed to create inspection');
      return null;
    }

    return data as Inspection;
  } catch (error) {
    console.error('Error creating inspection:', error);
    toast.error('Failed to create inspection');
    return null;
  }
};

export const uploadInspectionPhoto = async (file: Blob, fileName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('inspection-photos')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('inspection-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    toast.error('Failed to upload photo');
    return null;
  }
};
