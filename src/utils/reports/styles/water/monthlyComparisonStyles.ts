
/**
 * Generates CSS styles for monthly comparison section in water reports
 * Optimized for side-by-side comparison layout similar to Monthly Usage tab
 */
export const generateMonthlyComparisonStyles = (): string => {
  return `
    /* Monthly comparison styles - side by side layout */
    .monthly-comparison {
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .monthly-comparison h3 {
      margin-top: 0;
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #145D62;
      font-weight: 600;
      color: #145D62;
      font-size: 20px;
    }
    
    .comparison-chart {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      gap: 20px;
      margin-top: 20px;
      padding: 0 20px;
      min-height: 300px;
      position: relative;
    }
    
    /* Add grid lines for better comparison */
    .comparison-chart::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: #d1d5db;
      z-index: 1;
    }
    
    .source-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      max-width: 150px;
      position: relative;
    }
    
    .source-name {
      font-size: 14px;
      margin-bottom: 15px;
      color: #4b5563;
      text-align: center;
      font-weight: 600;
      writing-mode: horizontal-tb;
      transform: none;
    }
    
    .source-bar-wrapper {
      display: flex;
      align-items: flex-end;
      height: 200px;
      width: 60px;
      position: relative;
      border-bottom: 2px solid #d1d5db;
      margin-bottom: 10px;
    }
    
    .source-bar {
      width: 100%;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: height 0.3s ease;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .borehole-bar {
      background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .municipal-bar {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .total-bar {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }
    
    .source-value {
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-top: 8px;
    }
    
    .source-percentage {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      text-align: center;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .comparison-chart {
        gap: 15px;
        padding: 0 10px;
        min-height: 250px;
      }
      
      .source-column {
        max-width: 120px;
      }
      
      .source-bar-wrapper {
        height: 150px;
        width: 50px;
      }
      
      .source-name {
        font-size: 12px;
      }
      
      .source-value {
        font-size: 12px;
      }
    }

    /* Visual separators between data sources */
    .source-column:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #e5e7eb;
    }
  `;
};
