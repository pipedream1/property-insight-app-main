
/**
 * Generates common CSS styles shared across all report types
 */
export const generateCommonStyles = (): string => {
  return `
    /* General styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f9fafb;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
      text-align: center;
    }
    
    h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      color: #4b5563;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    h4 {
      font-size: 16px;
      font-weight: 500;
      color: #4b5563;
      margin-top: 15px;
      margin-bottom: 5px;
    }
    
    p {
      margin: 8px 0;
    }
    
    /* Report sections */
    .report-section {
      background: #ffffff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 25px;
    }
    
    .report-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .report-footer {
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    /* Media queries for responsiveness */
    @media (max-width: 768px) {
      .comparison-chart {
        flex-direction: column;
        align-items: center;
      }
      
      .month-column {
        width: 100%;
        max-width: 300px;
      }
      
      .source-bars {
        width: 100%;
      }
      
      .stats-container {
        flex-direction: column;
      }
    }
  `;
};

/**
 * Generates color variables for consistent styling across reports
 */
export const generateColorVars = (): { [key: string]: string } => {
  return {
    primary: '#4f46e5',
    secondary: '#8b5cf6',
    border: '#e5e7eb',
    bgMuted: '#f3f4f6',
    textMuted: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    text: '#374151',
    background: '#ffffff',
    borderDark: '#d1d5db',
    bgHover: '#f9fafb',
    statusGood: '#d1fae5',
    statusGoodText: '#065f46',
    statusFair: '#fef3c7',
    statusFairText: '#92400e',
    statusAttention: '#fee2e2',
    statusAttentionText: '#b91c1c',
    cardShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };
};

