
import { WaterReportData } from './water/types';

/**
 * Generates HTML content for a water report
 */
export const renderWaterReport = (
  month: string, 
  year: string, 
  data: WaterReportData
): string => {
  // Use the report period from the data if available, otherwise fallback to month/year
  const reportPeriod = data.reportPeriod || `${month} ${year}`;
  
  // Format efficiency status
  const getEfficiencyColor = () => {
    if (!data.efficiency) return 'gray';
    return data.efficiency.status === 'good' ? 'green' : 
           data.efficiency.status === 'average' ? 'orange' : 'red';
  };
  
  // Format trend indicators
  const getTrendSymbol = (trend: string | undefined) => {
    if (!trend) return '';
    return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  };

  // Generate comparative chart for water sources side by side
  const generateSourceComparison = () => {
    if (!data.monthlyComparison || data.monthlyComparison.length === 0) {
      return '<p class="text-muted">No comparison data available</p>';
    }
    
    // For single month reports, show source comparison
    const monthData = data.monthlyComparison[0];
    
    // Find the maximum usage value for proper scaling
    const maxUsage = Math.max(...Object.values(monthData.sources).map(source => source.usage), monthData.totalUsage);

    return `
      <div class="monthly-comparison">
        <h3>Water Source Comparison - ${monthData.month}</h3>
        <div class="comparison-chart">
          ${Object.entries(monthData.sources).map(([sourceName, sourceData]) => `
            <div class="source-column">
              <div class="source-name">${sourceName}</div>
              <div class="source-bar-wrapper">
                <div class="source-bar ${sourceName.toLowerCase().includes('borehole') ? 'borehole-bar' : 'municipal-bar'}" 
                     style="height: ${maxUsage > 0 ? (sourceData.usage / maxUsage) * 180 : 20}px">
                </div>
              </div>
              <div class="source-value">${sourceData.usage.toLocaleString()} kL</div>
              <div class="source-percentage">${sourceData.percentage}%</div>
            </div>
          `).join('')}
          <div class="source-column">
            <div class="source-name">Total Usage</div>
            <div class="source-bar-wrapper">
              <div class="source-bar total-bar" 
                   style="height: ${maxUsage > 0 ? (monthData.totalUsage / maxUsage) * 180 : 20}px">
              </div>
            </div>
            <div class="source-value">${monthData.totalUsage.toLocaleString()} kL</div>
            <div class="source-percentage">100%</div>
          </div>
        </div>
      </div>
    `;
  };

  // Generate reservoir data chart if available
  const generateReservoirChart = () => {
    if (!data.reservoirData || data.reservoirData.length === 0) {
      return '';
    }

    const chartPoints = data.reservoirData.map((reading, index) => {
      const x = (index / (data.reservoirData!.length - 1)) * 100;
      const y = 100 - reading.percentage_full; // Invert Y axis for SVG
      return `${x},${y}`;
    }).join(' ');

    return `
      <div class="reservoir-chart-container" style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="text-align: center; margin-bottom: 20px; color: #145D62; font-weight: 600;">Reservoir Levels - ${reportPeriod}</h3>
        <div style="position: relative; width: 100%; height: 300px; background: white; border-radius: 4px; border: 1px solid #e5e7eb;">
          <svg width="100%" height="100%" viewBox="0 0 100 100" style="position: absolute;">
            <defs>
              <linearGradient id="reservoirGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
              </linearGradient>
            </defs>
            <polyline points="${chartPoints}" fill="none" stroke="#3b82f6" stroke-width="2" />
            <polygon points="${chartPoints} 100,100 0,100" fill="url(#reservoirGradient)" />
            ${data.reservoirData.map((reading, index) => {
              const x = (index / (data.reservoirData!.length - 1)) * 100;
              const y = 100 - reading.percentage_full;
              return `<circle cx="${x}" cy="${y}" r="3" fill="#3b82f6" />`;
            }).join('')}
          </svg>
          <div style="position: absolute; left: 10px; top: 10px; font-size: 12px; color: #6b7280;">100%</div>
          <div style="position: absolute; left: 10px; bottom: 10px; font-size: 12px; color: #6b7280;">0%</div>
          <div style="position: absolute; right: 10px; bottom: 10px; font-size: 12px; color: #6b7280;">
            Latest: ${data.reservoirData[data.reservoirData.length - 1]?.percentage_full}%
          </div>
        </div>
        <div style="margin-top: 15px; display: flex; justify-content: space-between; font-size: 14px; color: #4b5563;">
          <span>Period Average: ${Math.round(data.reservoirData.reduce((sum, r) => sum + r.percentage_full, 0) / data.reservoirData.length)}%</span>
          <span>Readings: ${data.reservoirData.length}</span>
        </div>
      </div>
    `;
  };

  // Determine if this is a monthly or custom date range report
  const isCustomDateRange = !!data.dateRange;
  const reportTypeLabel = isCustomDateRange ? 'Custom Date Range' : 'Monthly Report';

  // Generate usage metrics with historical comparison side by side
  const generateUsageMetrics = () => {
    return `
      <div class="stats-container">
        <div class="stat-card">
          <h3>Total Usage</h3>
          <p class="stat-value">${data.totalUsage.toLocaleString()} kL</p>
          <p class="stat-change ${data.percentChange > 0 ? 'negative' : 'positive'}">
            ${data.percentChange > 0 ? '↑' : '↓'} ${Math.abs(data.percentChange)}% from previous period
          </p>
        </div>
        
        <div class="stat-card">
          <h3>Daily Average</h3>
          <p class="stat-value">${data.averageDailyUsage?.toLocaleString() || 'N/A'} kL</p>
        </div>
        
        <div class="stat-card target-card">
          <h3>Target Usage</h3>
          <p class="stat-value">${data.targetUsage?.toLocaleString() || 'N/A'} kL</p>
          <p class="stat-note" style="color: ${getEfficiencyColor()};">
            ${data.efficiency?.message || ''}
          </p>
        </div>

        ${data.historicalComparison ? `
        <div class="stat-card historical-card">
          <h3>Historical Comparison</h3>
          <div class="historical-data">
            ${data.historicalComparison.sameMonthLastYear ? `
              <div class="historical-item">
                <h4>Same Period Last Year</h4>
                <div class="historical-value">${data.historicalComparison.sameMonthLastYear.usage.toLocaleString()} kL</div>
                <div class="historical-comparison-trend ${data.historicalComparison.sameMonthLastYear.percentDifference > 0 ? 'negative' : 'positive'}">
                  ${data.historicalComparison.sameMonthLastYear.percentDifference > 0 ? '↑' : '↓'} 
                  ${Math.abs(data.historicalComparison.sameMonthLastYear.percentDifference)}%
                </div>
              </div>
            ` : ''}
            
            ${data.historicalComparison.averageForSeason ? `
              <div class="historical-item">
                <h4>Seasonal Average</h4>
                <div class="historical-value">${data.historicalComparison.averageForSeason.usage.toLocaleString()} kL</div>
                <div class="historical-comparison-trend ${data.historicalComparison.averageForSeason.percentDifference > 0 ? 'negative' : 'positive'}">
                  ${data.historicalComparison.averageForSeason.percentDifference > 0 ? '↑' : '↓'} 
                  ${Math.abs(data.historicalComparison.averageForSeason.percentDifference)}%
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  };

  return `
    <div class="report-section">
      <h2>Water Usage Summary</h2>
      <p>Reporting period: ${reportPeriod}</p>
      <p class="report-type-label">${reportTypeLabel}</p>
      
      ${generateUsageMetrics()}
      
      ${generateSourceComparison()}
      
      ${generateReservoirChart()}
      
      <div class="usage-breakdown">
        <h3>Water Source Breakdown</h3>
        <ul>
          ${data.details && data.details.subReadings ? 
            data.details.subReadings.map(reading => `
              <li>
                <span class="reading-name">${reading.name}</span>
                <span class="reading-value">${reading.value.toLocaleString()} kL</span>
                ${reading.trend ? `<span class="reading-trend ${reading.trend}">${getTrendSymbol(reading.trend)}</span>` : ''}
              </li>
            `).join('') : 'No reading data available'}
        </ul>
      </div>
    </div>
  `;
};
