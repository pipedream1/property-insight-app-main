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
    // Basic validation before hitting the network
    if (!inspection.property_id) {
      toast.error('Property ID is required');
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('inspections')
      .insert([inspection])
      .select()
      .single();

    if (error) {
      const msg = typeof error.message === 'string' ? error.message : JSON.stringify(error);
      console.error('Error creating inspection:', error);
      if (msg.toLowerCase().includes('permission')) {
        toast.error('Permission denied creating inspection (check RLS & auth)');
      } else if (msg.toLowerCase().includes('network')) {
        toast.error('Network issue creating inspection');
      } else {
        toast.error('Failed to create inspection');
      }
      return null;
    }

    return data as Inspection;
  } catch (error) {
    console.error('Unexpected error creating inspection:', error);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('failed to fetch')) {
      toast.error('Network error: could not reach database');
    } else {
      toast.error('Failed to create inspection');
    }
    return null;
  }
};

export const uploadInspectionPhoto = async (file: Blob, fileName: string): Promise<string | null> => {
  try {
    const BUCKET = 'inspection-photos';
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { upsert: false });

    if (error) {
      const msg = typeof error.message === 'string' ? error.message.toLowerCase() : '';
      console.error('Error uploading photo:', error);
      if (msg.includes('duplicate')) {
        toast.error('Photo already exists');
      } else if (msg.includes('permission')) {
        toast.error('No permission to upload photo (check bucket policies)');
      } else {
        toast.error('Failed to upload photo');
      }
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('failed to fetch')) {
      toast.error('Network error during photo upload');
    } else {
      toast.error('Failed to upload photo');
    }
    return null;
  }
};
