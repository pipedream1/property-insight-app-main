
import { ReportType } from "@/integrations/supabase/client";
import { generateReportStyles } from './styleGenerator';
import { renderWaterReport } from './waterReportRenderer';
import { renderComponentReport } from './componentReportRenderer';

/**
 * Builds the complete HTML document for a report
 */
export const buildReportTemplate = async (report: ReportType): Promise<string> => {
  const data = report.data;
  
  if (!data) {
    return `<html><body><h1>Error: No report data available</h1></body></html>`;
  }

  const isWaterReport = report.type === 'water';
  
  // Get the content based on report type
  const content = isWaterReport 
    ? renderWaterReport(report.month, report.year, data)
    : await renderComponentReport(report.month, report.year, data);
  
  // Return the complete HTML document
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${report.name}</title>
      <style>
        ${generateReportStyles()}
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1>${report.name}</h1>
        <p>Generated on ${new Date(data.generatedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      
      ${content}
      
      <div class="report-footer">
        <p>This report was automatically generated from the property management system.</p>
        <p>For questions or concerns, please contact the property management office.</p>
      </div>
    </body>
    </html>
  `;
};
