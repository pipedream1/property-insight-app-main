
import { ReportType } from '@/integrations/supabase/client';
import { generateReportHtml } from './reportRenderer';

/**
 * Opens a report in a new tab
 */
export const viewReport = async (report: ReportType): Promise<void> => {
  try {
    // Get the HTML content
    const html = await generateReportHtml(report);
    
    // Create a blob from the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open the blob in a new window
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error viewing report:', error);
  }
};

/**
 * Downloads a report as an HTML file
 */
export const downloadReport = async (report: ReportType): Promise<void> => {
  try {
    // Get the HTML content
    const html = await generateReportHtml(report);
    
    // Create a blob and download link
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger a click
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading report:', error);
  }
};
