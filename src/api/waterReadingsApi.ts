
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WaterReading, ReservoirReading } from '@/types/waterReadings';
import { VALID_WATER_SOURCES } from '@/constants/waterSources';

export const fetchWaterReadings = async (): Promise<WaterReading[]> => {
  try {
    console.log('Fetching water readings from database...');
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .order('date', { ascending: false });

    console.log('Raw data from Supabase:', data);
    console.log('Error if any:', error);

    if (error) {
      console.error('Error fetching water readings:', error);
      toast.error('Failed to fetch water readings');
      return [];
    }

    if (data && data.length > 0) {
      // Filter out WaterMeter and other invalid sources
      const filteredData = data.filter(reading => {
        const sourceType = reading.component_type || reading.component_name || '';
        return VALID_WATER_SOURCES.includes(sourceType);
      });
      
      console.log(`Successfully fetched ${data.length} total readings, ${filteredData.length} valid readings`);
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
