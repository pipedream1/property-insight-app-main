export interface WaterUsageCalculation {
  borehole: number;
  municipal: number;
  total: number;
}

export interface WaterReportData {
  generatedAt: string;
  summary: string;
  reportPeriod: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  } | null;
  chartData: Array<{
    month: string;
    usage: number;
    dailyAverage: number;
  }>;
  totalUsage: number;
  averageDailyUsage: number;
  percentChange: number;
  targetUsage?: number;
  efficiency?: {
    status: 'good' | 'average' | 'high';
    message: string;
  };
  details?: {
    mainReading: number;
    subReadings: Array<{
      name: string;
      value: number;
      percentOfTotal?: number;
      trend?: 'up' | 'down' | 'stable';
    }>;
  };
  historicalComparison?: {
    sameMonthLastYear?: {
      usage: number;
      percentDifference: number;
    };
    averageForSeason?: {
      usage: number;
      percentDifference: number;
    };
  };
  monthlyComparison: Array<{
    month: string;
    totalUsage: number;
    sources: {
      [sourceName: string]: {
        usage: number;
        percentage: number;
      };
    };
  }>;
  reservoirData?: Array<{
    date: string;
    percentage_full: number;
    water_level: number;
  }>;
}
