
/**
 * Generates CSS styles for charts and visualizations in reports
 */
export const generateChartStyles = (): string => {
  return `
    /* Charts */
    .chart-container {
      margin: 30px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .chart-container h3 {
      margin-top: 0;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 25px;
      font-weight: 600;
      color: #145D62;
    }
    
    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 250px;
      gap: 40px;
      margin-top: 30px;
      margin-bottom: 100px; /* Increased to accommodate labels below */
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
      position: relative;
    }
    
    .chart-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      position: relative;
    }
    
    .chart-bar {
      width: 60px;
      background-color: #145D62;
      border-radius: 4px 4px 0 0;
      transition: height 0.3s ease;
      border: 1px solid rgba(0,0,0,0.1);
      position: absolute;
      bottom: 0;
    }
    
    .chart-label {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      width: 100%;
    }
    
    .chart-value {
      position: absolute;
      bottom: -55px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
      text-align: center;
      width: 100%;
    }
    
    .chart-daily {
      position: absolute;
      bottom: -75px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #4b5563;
      text-align: center;
      width: 100%;
    }
    
    /* Stat cards */
    .stats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 25px;
      justify-content: center;
    }
    
    .stat-card {
      flex: 1;
      min-width: 200px;
      max-width: 250px;
      background: #f8fafc;
      border-radius: 8px;
      padding: 15px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .target-card, .historical-card {
      background: #f0f9fa;
      border-color: #ccedee;
    }
    
    .stat-card h3 {
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 12px;
      color: #145D62;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      font-weight: 600;
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin: 10px 0;
      text-align: center;
    }
    
    .stat-change {
      font-size: 14px;
      margin: 8px 0 0;
      text-align: center;
      font-weight: 500;
    }
    
    .stat-note {
      font-size: 14px;
      margin-top: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    .positive {
      color: #059669;
    }
    
    .negative {
      color: #dc2626;
    }
  `;
};
