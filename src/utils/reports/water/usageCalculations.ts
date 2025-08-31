
import { startOfMonth, endOfMonth } from "date-fns";
import { WaterUsageCalculation } from "./types";
import type { WaterReading } from "@/types/waterReadings";
// View provides canonical component_type/source_name; no client normalization needed

/**
 * Calculate usage for a specific period using real readings
 */
export const calculatePeriodUsageFromReadings = (readings: WaterReading[], startDate: Date, endDate: Date): WaterUsageCalculation => {
  const periodStart = startOfMonth(startDate);
  const periodEnd = endOfMonth(endDate);
  
  let boreholeUsage = 0;
  let municipalUsage = 0;
  
  // Define water source groups
  // Support both component_type (preferred) and component_name variants
  const boreholeComponents = ['Borehole 1', 'Borehole 2', 'Borehole 3', 'Borehole 4'];
  const municipalComponents = ['Knysna Water'];
  
  // Calculate usage for each source group
  [...boreholeComponents, ...municipalComponents].forEach(componentName => {
    // All readings for this source (any date), sorted asc
    type CanonicalReading = WaterReading & { source_name?: string | null };
    const allForSource = (readings as CanonicalReading[])
      .filter(r => (r.component_type === componentName) || (r.component_name === componentName) || (r.source_name === componentName))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (allForSource.length === 0) return;

    // In-period readings
    const inPeriod = allForSource.filter(r => {
      const d = new Date(r.date);
      return d >= periodStart && d <= periodEnd;
    });

    let usage = 0;
    if (inPeriod.length >= 2) {
      const before = allForSource.filter(r => new Date(r.date) < periodStart);
      const baseline = before.length > 0 ? Number(before[before.length - 1].reading) || 0 : null;
      const seq: number[] = [];
      if (baseline !== null) seq.push(baseline);
      inPeriod.forEach(r => seq.push(Number(r.reading) || 0));
      if (seq.length >= 2) {
        for (let i = 1; i < seq.length; i++) {
          const delta = seq[i] - seq[i - 1];
          if (delta > 0) usage += delta;
        }
      }
    } else if (inPeriod.length === 1) {
      const only = Number(inPeriod[0].reading) || 0;
      const before = allForSource.filter(r => new Date(r.date) < periodStart);
      const prev = before.length > 0 ? before[before.length - 1] : undefined;
      if (prev && prev.reading != null) {
        const baseline = Number(prev.reading) || 0;
        usage = Math.max(0, only - baseline);
      }
    }

    if (usage > 0) {
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
export const calculateSameMonthLastYearUsage = (readings: WaterReading[], currentStart: Date, currentEnd: Date): number => {
  const lastYearStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), 1);
  const lastYearEnd = new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth() + 1, 0);
  
  const lastYearUsage = calculatePeriodUsageFromReadings(readings, lastYearStart, lastYearEnd);
  return lastYearUsage.total;
};

/**
 * Calculate seasonal average usage
 */
export const calculateSeasonalAverageUsage = (readings: WaterReading[], currentDate: Date): number => {
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
