
import { supabase, ReportType } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Fetches all reports from the database
 */
export const fetchReports = async (): Promise<ReportType[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
      return [];
    }
    
    return data as unknown as ReportType[];
  } catch (error) {
    console.error('Error:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
};

/**
 * Creates a new report in the database
 */
export const createReport = async (reportData: Omit<ReportType, 'id' | 'created_at'>): Promise<ReportType | null> => {
  try {
    console.log('Sending report data:', reportData);
    
    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select();
    
    if (error) {
      console.error('Error generating report:', error);
      throw error;
    }
    
    // Convert the returned data to match ReportType (particularly converting id from number to string)
    if (data && data.length > 0) {
      const report = {
        ...data[0],
        id: String(data[0].id) // Convert number id to string to match ReportType
      } as ReportType;
      
      return report;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
};
