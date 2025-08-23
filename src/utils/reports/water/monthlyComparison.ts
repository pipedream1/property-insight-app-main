
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { calculatePeriodUsageFromReadings } from "./usageCalculations";

/**
 * Generate monthly comparison data for a single month report using real data
 * Shows only current month breakdown by water sources
 */
export const generateSingleMonthComparisonData = (readings: any[], reportMonth: Date) => {
  const monthlyComparison = [];
  
  // For single month reports, show only the current month with source breakdown
  const monthName = format(reportMonth, 'MMM yyyy');
  const monthStart = startOfMonth(reportMonth);
  const monthEnd = endOfMonth(reportMonth);
  
  const monthUsage = calculatePeriodUsageFromReadings(readings, monthStart, monthEnd);
  
  monthlyComparison.push({
    month: monthName,
    totalUsage: monthUsage.total,
    sources: {
      'Borehole Water': {
        usage: monthUsage.borehole,
        percentage: monthUsage.total > 0 ? Math.round((monthUsage.borehole / monthUsage.total) * 100) : 0
      },
      'Knysna Municipality': {
        usage: monthUsage.municipal,
        percentage: monthUsage.total > 0 ? Math.round((monthUsage.municipal / monthUsage.total) * 100) : 0
      }
    }
  });
  
  return monthlyComparison;
};

/**
 * Generate monthly comparison data for a custom date range using real data
 * Shows up to 6 months for detailed comparison when using custom date ranges
 */
export const generateDateRangeComparisonData = (readings: any[], startDate: Date, endDate: Date) => {
  const monthlyComparison = [];
  
  let currentDate = new Date(startDate);
  currentDate.setDate(1); // Start from the beginning of the month
  
  let monthCount = 0;
  const maxMonths = 6; // Show more months for custom date range reports
  
  while (currentDate <= endDate && monthCount < maxMonths) {
    const monthName = format(currentDate, 'MMM yyyy');
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    const monthUsage = calculatePeriodUsageFromReadings(readings, monthStart, monthEnd);
    
    monthlyComparison.push({
      month: monthName,
      totalUsage: monthUsage.total,
      sources: {
        'Borehole Water': {
          usage: monthUsage.borehole,
          percentage: monthUsage.total > 0 ? Math.round((monthUsage.borehole / monthUsage.total) * 100) : 0
        },
        'Knysna Municipality': {
          usage: monthUsage.municipal,
          percentage: monthUsage.total > 0 ? Math.round((monthUsage.municipal / monthUsage.total) * 100) : 0
        }
      }
    });
    
    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthCount++;
  }
  
  return monthlyComparison;
};
