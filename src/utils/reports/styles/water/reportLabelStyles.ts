
/**
 * Generates CSS styles for report type labels in water reports
 */
export const generateReportLabelStyles = (): string => {
  return `
    /* Report type label */
    .report-type-label {
      display: inline-block;
      background-color: #f0f9fa;
      color: #145D62;
      font-size: 0.875rem;
      padding: 0.375rem 1rem;
      border-radius: 9999px;
      margin-bottom: 1rem;
      border: 1px solid #145D62;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      margin-top: 0.5rem;
    }
  `;
};
