
import { useState, useEffect } from 'react';
import { ReportType } from '@/integrations/supabase/client';
import { fetchReports } from '@/services/reportService';
import { useReportGeneration } from './useReportGeneration';
import { useReportDownload } from './useReportDownload';

export function useReports() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReports();
      setReports(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  return {
    reports,
    isLoading,
    fetchReports: fetchReportsData
  };
}

// Re-export other hooks for backward compatibility
export { useReportGeneration } from './useReportGeneration';
export { useReportDownload } from './useReportDownload';
