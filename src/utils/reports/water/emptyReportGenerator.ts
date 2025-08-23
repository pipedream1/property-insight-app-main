
import { DateRange } from "@/hooks/useReportGeneration";
import { WaterReportData } from "./types";

/**
 * Generate empty report when no data is available
 */
export const generateEmptyReport = (reportPeriodLabel: string, dateRange?: DateRange, reason?: string): WaterReportData => {
  return {
    generatedAt: new Date().toISOString(),
    summary: `Water usage summary for ${reportPeriodLabel} (${reason || 'No data available'})`,
    reportPeriod: reportPeriodLabel,
    dateRange: dateRange 
      ? { 
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString() 
        }
      : null,
    chartData: [],
    totalUsage: 0,
    averageDailyUsage: 0,
    percentChange: 0,
    targetUsage: 0,
    efficiency: {
      status: 'good' as const,
      message: reason || 'No data available for this period'
    },
    details: {
      mainReading: 0,
      subReadings: [
        { 
          name: 'Borehole Water', 
          value: 0,
          percentOfTotal: 0,
          trend: undefined
        },
        { 
          name: 'Knysna Municipality', 
          value: 0,
          percentOfTotal: 0,
          trend: undefined
        }
      ]
    },
    historicalComparison: {
      sameMonthLastYear: null,
      averageForSeason: null
    },
    monthlyComparison: []
  };
};
