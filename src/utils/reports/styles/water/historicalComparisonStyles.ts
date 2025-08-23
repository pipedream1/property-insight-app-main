
/**
 * Generates CSS styles for historical comparison section in water reports
 */
export const generateHistoricalComparisonStyles = (): string => {
  return `
    /* Historical comparison */
    .historical-container {
      margin: 20px 0;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .historical-container h3 {
      margin-top: 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 15px;
      font-weight: 600;
      color: #145D62;
    }
    
    .historical-data {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }
    
    .historical-item {
      flex: 1;
      min-width: 160px;
      max-width: 200px;
      background: white;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
      text-align: center;
      margin-bottom: 10px;
    }
    
    .historical-item h4 {
      margin-top: 0;
      color: #145D62;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 8px;
      margin-bottom: 10px;
      font-weight: 500;
      text-align: center;
    }

    .historical-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      text-align: center;
    }

    .historical-comparison-trend {
      font-size: 0.875rem;
      font-weight: 500;
      text-align: center;
    }
  `;
};
