
/**
 * Generates CSS styles for usage breakdown section in water reports
 */
export const generateUsageBreakdownStyles = (): string => {
  return `
    /* Breakdown */
    .usage-breakdown {
      margin-top: 30px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .usage-breakdown h3 {
      margin-top: 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-weight: 600;
      color: #145D62;
      text-align: center;
    }
    
    .usage-breakdown ul {
      list-style: none;
      padding: 0;
      margin: 15px 0 0 0;
    }
    
    .usage-breakdown li {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 30px;
      align-items: center;
      padding: 14px 20px;
      margin-bottom: 10px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
    }
    
    .reading-name {
      font-weight: 500;
      font-size: 15px;
    }
    
    .reading-value {
      text-align: right;
      font-weight: 600;
      font-size: 15px;
    }
    
    .reading-percentage {
      text-align: right;
      color: #4b5563;
      font-size: 15px;
      font-weight: 500;
    }
    
    .reading-trend {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    
    .reading-trend.up {
      color: #dc2626;
    }
    
    .reading-trend.down {
      color: #059669;
    }
    
    .reading-trend.stable {
      color: #9ca3af;
    }
  `;
};
