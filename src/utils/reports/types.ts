
export interface WaterReportData {
  generatedAt: string;
  summary: string;
  reportPeriod?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  } | null;
  chartData: Array<{ 
    month: string; 
    usage: number;
    dailyAverage?: number;
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
      percentOfTotal: number;
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
  // New field for monthly comparison data
  monthlyComparison?: Array<{
    month: string;
    totalUsage: number;
    sources: {
      [sourceName: string]: {
        usage: number;
        percentage: number;
      }
    }
  }>;
}

export interface Component {
  name: string;
  condition: string;
  lastInspection: string;
  photos?: string[];
  comment?: string;
  component_type: string; // Added the missing component_type property
}

export interface ComponentReportData {
  generatedAt: string;
  summary: string;
  componentType: string;
  status: {
    good: number;
    fair: number;
    needsAttention: number;
  };
  components: Component[];
}

export interface ReportData {
  generatedAt: string;
  summary: string;
  [key: string]: any;
}
