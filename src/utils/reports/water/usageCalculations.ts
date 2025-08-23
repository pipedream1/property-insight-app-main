
import { startOfMonth, endOfMonth } from "date-fns";
import { WaterUsageCalculation } from "./types";

/**
 * Calculate usage for a specific period using real readings
 */
export const calculatePeriodUsageFromReadings = (readings: any[], startDate: Date, endDate: Date): WaterUsageCalculation => {
  const periodStart = startOfMonth(startDate);
  const periodEnd = endOfMonth(endDate);
  
  let boreholeUsage = 0;
  let municipalUsage = 0;
  
  // Define water source groups
  const boreholeComponents = ['Borehole1', 'Borehole2', 'Borehole3', 'Borehole4'];
  const municipalComponents = ['KnysnaWater'];
  
  // Calculate usage for each source group
  [...boreholeComponents, ...municipalComponents].forEach(componentName => {
    const componentReadings = readings
      .filter(reading => {
        const readingDate = new Date(reading.date);
        return reading.component_name === componentName &&
               readingDate >= periodStart &&
               readingDate <= periodEnd;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (componentReadings.length >= 2) {
      // Get first and last readings of the period
      const firstReading = componentReadings[0].reading || 0;
      const lastReading = componentReadings[componentReadings.length - 1].reading || 0;
      const usage = Math.max(0, lastReading - firstReading);
      
      if (boreholeComponents.includes(componentName)) {
        boreholeUsage += usage;
      } else if (municipalComponents.includes(componentName)) {
        municipalUsage += usage;
      }
    }
  });
  
  return {
    borehole: Math.round(boreholeUsage),
    municipal: Math.round(municipalUsage),
    total: Math.round(boreholeUsage + municipalUsage)
  };
};

/**
 * Calculate usage for the same month last year
 */
export const calculateSameMonthLastYearUsage = (readings: any[], currentStart: Date, currentEnd: Date): number => {
  const lastYearStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), 1);
  const lastYearEnd = new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth() + 1, 0);
  
  const lastYearUsage = calculatePeriodUsageFromReadings(readings, lastYearStart, lastYearEnd);
  return lastYearUsage.total;
};

/**
 * Calculate seasonal average usage
 */
export const calculateSeasonalAverageUsage = (readings: any[], currentDate: Date): number => {
  // Calculate average for the same month over the past 3 years
  let totalUsage = 0;
  let validMonths = 0;
  
  for (let i = 1; i <= 3; i++) {
    const yearStart = new Date(currentDate.getFullYear() - i, currentDate.getMonth(), 1);
    const yearEnd = new Date(currentDate.getFullYear() - i, currentDate.getMonth() + 1, 0);
    
    const yearUsage = calculatePeriodUsageFromReadings(readings, yearStart, yearEnd);
    if (yearUsage.total > 0) {
      totalUsage += yearUsage.total;
      validMonths++;
    }
  }
  
  return validMonths > 0 ? Math.round(totalUsage / validMonths) : 0;
};
