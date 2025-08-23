
import { ReportType } from '@/integrations/supabase/client';
import { viewReport, downloadReport } from '@/utils/reportFileOperations';

export function useReportDownload() {
  const handleViewReport = async (report: ReportType) => {
    await viewReport(report);
  };

  const handleDownload = async (report: ReportType) => {
    await downloadReport(report);
  };

  return { handleDownload, handleViewReport };
}
