
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WaterReading } from '@/types';

export const updateWaterReading = async (
  reading: WaterReading,
  readingValue: string,
  selectedDate: Date,
  notes: string
) => {
  try {
    // Validate input
    if (!readingValue.trim()) {
      toast.error('Please enter a reading value');
      return false;
    }

    // Convert reading.id to number for database operation
    const readingId = typeof reading.id === 'string' ? parseInt(reading.id) : reading.id;

    // Update the reading in Supabase
    const { error } = await supabase
      .from('water_readings')
      .update({
        reading: Number(readingValue),
        date: selectedDate.toISOString(),
        comment: notes,
      })
      .eq('id', readingId);
      
    if (error) {
      console.error('Error updating water reading:', error);
      toast.error('Failed to update water reading');
      return false;
    }
    
    toast.success('Reading updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating water reading:', error);
    toast.error('Failed to update reading');
    return false;
  }
};

export const deleteWaterReading = async (reading: WaterReading) => {
  if (!confirm('Are you sure you want to delete this reading? This action cannot be undone.')) {
    return false;
  }

  try {
    // Convert reading.id to number for database operation
    const readingId = typeof reading.id === 'string' ? parseInt(reading.id) : reading.id;

    const { error } = await supabase
      .from('water_readings')
      .delete()
      .eq('id', readingId);
      
    if (error) {
      console.error('Error deleting water reading:', error);
      toast.error('Failed to delete water reading');
      return false;
    }
    
    toast.success('Reading deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting water reading:', error);
    toast.error('Failed to delete reading');
    return false;
  }
};
