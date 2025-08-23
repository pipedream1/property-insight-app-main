
import { ReportType } from '@/integrations/supabase/client';
import { buildReportTemplate } from './reports/reportTemplateBuilder';

/**
 * Generates HTML content for displaying a report
 */
export const generateReportHtml = async (report: ReportType): Promise<string> => {
  return await buildReportTemplate(report);
};
