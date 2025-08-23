
import { ReportType } from '@/integrations/supabase/client';
import { ComponentStatusFilter as ComponentStatusFilterType } from '@/components/reports/ComponentStatusFilter';

export const filterReports = (
  reports: ReportType[], 
  type: 'water' | 'component', 
  statusFilter?: ComponentStatusFilterType
): ReportType[] => {
  let filtered = reports.filter(r => r.type === type);
  
  // Apply status filter for component reports
  if (type === 'component' && statusFilter) {
    filtered = filtered.filter(report => {
      try {
        const data = typeof report.data === 'string' 
          ? JSON.parse(report.data) 
          : report.data;
        
        if (!data || !data.components) return false;
        
        // Check if the report contains components with the filtered status
        return data.components.some((component: any) => {
          const condition = component.condition?.toLowerCase() || 'unknown';
          
          switch (statusFilter) {
            case 'good':
              return condition.includes('good') || condition.includes('excellent');
            case 'fair':
              return condition.includes('fair');
            case 'poor':
              return condition.includes('poor') || condition.includes('critical');
            case 'unknown':
              return condition === 'unknown' || condition === '';
            default:
              return true;
          }
        });
      } catch (e) {
        console.error('Error filtering report by status:', e);
        return true; // Include report if we can't parse it
      }
    });
  }
  
  return filtered;
};
