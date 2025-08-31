
import { DateRange } from "@/hooks/useReportGeneration";
import { format, differenceInDays, addDays, startOfMonth, endOfMonth } from "date-fns";
import { getMonthNumber } from "./dateUtils";
import { supabase } from "@/integrations/supabase/client";
import { WaterReportData } from "./water/types";
import { 
  calculatePeriodUsageFromReadings, 
  calculateSameMonthLastYearUsage, 
  calculateSeasonalAverageUsage 
} from "./water/usageCalculations";
import { 
  generateSingleMonthComparisonData, 
  generateDateRangeComparisonData 
} from "./water/monthlyComparison";
import { generateEmptyReport } from "./water/emptyReportGenerator";
import { VALID_WATER_SOURCES, normalizeWaterSource } from "@/constants/waterSources";

/**
 * Generates data for a water report using real data from the database
 */
export const generateWaterReportData = async (selectedMonth: string, selectedYear: string, dateRange?: DateRange): Promise<WaterReportData> => {
  const currentDate = new Date();
  
  // If dateRange is provided, use it; otherwise, use month/year
  const reportDate = dateRange 
    ? { 
        start: dateRange.startDate,
        end: dateRange.endDate
      } 
    : { 
        start: new Date(parseInt(selectedYear), getMonthNumber(selectedMonth), 1),
        end: new Date(parseInt(selectedYear), getMonthNumber(selectedMonth) + 1, 0)
      };
  
  // Calculate previous period for comparison (same length)
  const daysDifference = differenceInDays(reportDate.end, reportDate.start) + 1;
  const previousPeriodEnd = addDays(reportDate.start, -1);
  const previousPeriodStart = addDays(previousPeriodEnd, -daysDifference + 1);
  
  const reportPeriodLabel = dateRange 
    ? `${format(dateRange.startDate, 'MMM d')} - ${format(dateRange.endDate, 'MMM d, yyyy')}`
    : `${selectedMonth} ${selectedYear}`;

  const previousPeriodLabel = `${format(previousPeriodStart, 'MMM d')} - ${format(previousPeriodEnd, 'MMM d, yyyy')}`;
  
  try {
    console.log('Fetching water readings from database...');
    
    // Fetch actual water readings from the database
  const { data: readings, error } = await supabase
      .from('water_readings')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching water readings:', error);
      console.log('Falling back to empty report generation');
      return generateEmptyReport(reportPeriodLabel, dateRange, `Database error: ${error.message}`);
    }
    
    // Fetch reservoir data for the report period
    console.log('Fetching reservoir readings for report period...');
    const { data: reservoirReadings, error: reservoirError } = await supabase
      .from('reservoir_readings')
      .select('*')
      .gte('reading_date', reportDate.start.toISOString())
      .lte('reading_date', reportDate.end.toISOString())
      .order('reading_date', { ascending: true });
    
    if (reservoirError) {
      console.warn('Error fetching reservoir readings:', reservoirError);
    }
    
    console.log(`Found ${readings?.length || 0} water readings and ${reservoirReadings?.length || 0} reservoir readings in database`);
    
    if (!readings || readings.length === 0) {
      console.warn('No water readings found in database');
      return generateEmptyReport(reportPeriodLabel, dateRange, 'No water readings available');
    }
    
    // Transform and calculate actual usage for current period
    // Normalize sources before calculations so naming differences don't exclude data
    const normalizedReadings = (readings || []).map(r => ({
      ...r,
      component_type: normalizeWaterSource(r.component_type) || r.component_type,
      component_name: normalizeWaterSource(r.component_name) || r.component_name,
    }));

    const currentPeriodUsage = calculatePeriodUsageFromReadings(normalizedReadings, reportDate.start, reportDate.end);
    const previousPeriodUsage = calculatePeriodUsageFromReadings(normalizedReadings, previousPeriodStart, previousPeriodEnd);
    
    console.log('Current period usage:', currentPeriodUsage);
    console.log('Previous period usage:', previousPeriodUsage);
    
    // Calculate change percentage properly using real data
    const percentChange = previousPeriodUsage.total > 0 
      ? Math.round(((currentPeriodUsage.total - previousPeriodUsage.total) / previousPeriodUsage.total) * 100)
      : 0;
    
    // Calculate daily averages
    const currentDailyAverage = daysDifference > 0 ? Math.round(currentPeriodUsage.total / daysDifference) : 0;
    const previousDailyAverage = daysDifference > 0 ? Math.round(previousPeriodUsage.total / daysDifference) : 0;
    
    // Calculate efficiency rating based on actual usage patterns
    const targetDailyUsage = 350; // Example target
    const targetPeriodUsage = targetDailyUsage * daysDifference;
    const efficiencyRating = currentPeriodUsage.total > targetPeriodUsage * 1.2 ? 'high' : 
                            (currentPeriodUsage.total > targetPeriodUsage ? 'average' : 'good');
    
    const efficiencyMessage = efficiencyRating === 'high' ? 'Usage significantly above target' :
                              efficiencyRating === 'average' ? 'Usage slightly above target' :
                              'Usage within efficient range';
    
    // Generate historical comparison data using real data
    const sameMonthLastYear = calculateSameMonthLastYearUsage(readings, reportDate.start, reportDate.end);
    const seasonalAverage = calculateSeasonalAverageUsage(readings, reportDate.start);
    
    // Generate monthly comparison data using real readings
    const monthlyComparison = dateRange ? 
      generateDateRangeComparisonData(readings, dateRange.startDate, dateRange.endDate) : 
      generateSingleMonthComparisonData(readings, new Date(parseInt(selectedYear), getMonthNumber(selectedMonth)));
    
    // Transform reservoir data for chart
    const reservoirData = reservoirReadings?.map(reading => ({
      date: reading.reading_date,
      percentage_full: Number(reading.percentage_full),
      water_level: Number(reading.water_level)
    })) || [];

    return {
      generatedAt: new Date().toISOString(),
      summary: `Water usage summary for ${reportPeriodLabel}`,
      reportPeriod: reportPeriodLabel,
      dateRange: dateRange 
        ? { 
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString() 
          }
        : null,
      chartData: [
        { 
          month: previousPeriodLabel, 
          usage: previousPeriodUsage.total,
          dailyAverage: previousDailyAverage
        },
        { 
          month: reportPeriodLabel, 
          usage: currentPeriodUsage.total,
          dailyAverage: currentDailyAverage
        }
      ],
      totalUsage: currentPeriodUsage.total,
      averageDailyUsage: currentDailyAverage,
      percentChange: percentChange,
      targetUsage: targetPeriodUsage,
      efficiency: {
        status: efficiencyRating,
        message: efficiencyMessage
      },
      details: {
        mainReading: currentPeriodUsage.total,
        subReadings: [
          { 
            name: 'Borehole Water', 
            value: currentPeriodUsage.borehole,
            percentOfTotal: currentPeriodUsage.total > 0 ? Math.round((currentPeriodUsage.borehole / currentPeriodUsage.total) * 100) : 0,
            trend: currentPeriodUsage.borehole > previousPeriodUsage.borehole ? 'up' : 'down'
          },
          { 
            name: 'Knysna Municipality', 
            value: currentPeriodUsage.municipal,
            percentOfTotal: currentPeriodUsage.total > 0 ? Math.round((currentPeriodUsage.municipal / currentPeriodUsage.total) * 100) : 0,
            trend: currentPeriodUsage.municipal > previousPeriodUsage.municipal ? 'up' : 'down'
          }
        ]
      },
      historicalComparison: {
        sameMonthLastYear: sameMonthLastYear ? {
          usage: sameMonthLastYear,
          percentDifference: sameMonthLastYear > 0 ? Math.round(((currentPeriodUsage.total - sameMonthLastYear) / sameMonthLastYear) * 100) : 0
        } : null,
        averageForSeason: seasonalAverage ? {
          usage: seasonalAverage,
          percentDifference: seasonalAverage > 0 ? Math.round(((currentPeriodUsage.total - seasonalAverage) / seasonalAverage) * 100) : 0
        } : null
      },
      monthlyComparison: monthlyComparison,
      reservoirData: reservoirData.length > 0 ? reservoirData : undefined
    };
  } catch (error) {
    console.error('Error generating water report:', error);
    return generateEmptyReport(reportPeriodLabel, dateRange, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
