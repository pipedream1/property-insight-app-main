
import { WaterReading, MonthlyUsage } from '@/types/waterReadings';
import { VALID_WATER_SOURCES, SOURCE_COLORS } from '@/constants/waterSources';

export const calculateUsageData = (readings: WaterReading[]): MonthlyUsage[] => {
  console.log('Calculating usage data from readings:', readings.length);
  
  if (!readings || readings.length === 0) {
    console.log('No readings available, returning empty usage data');
    return [];
  }

  const monthlyData: { [key: string]: MonthlyUsage } = {};

  // Build per-source lists sorted by date asc (component_type is already canonical from the view)
  const normalized = readings;

  const bySource: Record<string, WaterReading[]> = {};
  normalized.forEach(r => {
  const src = r.component_type || r.source_name || r.component_name || 'Unknown';
    if (!VALID_WATER_SOURCES.includes(src)) return;
    if (!bySource[src]) bySource[src] = [];
    bySource[src].push(r);
  });
  Object.values(bySource).forEach(list => list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

  // Determine all month keys present in the dataset
  const monthKeys = new Set<string>();
  normalized.forEach(r => {
    if (!r.date) return;
    const d = new Date(r.date);
    monthKeys.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  });

  // Compute usage per month and source, using baseline from previous reading when needed
  monthKeys.forEach(monthYear => {
    const [yy, mm] = monthYear.split('-').map(Number);
    const monthStart = new Date(yy, mm - 1, 1);
    const monthEnd = new Date(yy, mm, 0);

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthStart.toLocaleDateString('en-US', { month: 'long' }),
        year: monthStart.getFullYear(),
        sources: [],
        total: 0,
      };
    }

    VALID_WATER_SOURCES.forEach(source => {
      const list = bySource[source] || [];
      if (list.length === 0) return;

      const inMonth = list.filter(r => {
        const t = new Date(r.date).getTime();
        return t >= monthStart.getTime() && t <= monthEnd.getTime();
      });

      if (inMonth.length >= 2) {
        // Build a sequence including baseline if present, then sum positive deltas
        const before = list.filter(r => new Date(r.date).getTime() < monthStart.getTime());
        const baselineReading = before.length > 0 ? Number(before[before.length - 1].reading) || 0 : null;
        const seq: number[] = [];
        if (baselineReading !== null) seq.push(baselineReading);
        inMonth.forEach(r => seq.push(Number(r.reading) || 0));
        if (seq.length < 2) {
          // Fallback to simple last-first
          const first = Number(inMonth[0].reading) || 0;
          const last = Number(inMonth[inMonth.length - 1].reading) || 0;
          const usageFallback = last - first;
          if (usageFallback > 0) {
            monthlyData[monthYear].sources.push({
              source,
              usage: usageFallback,
              color: SOURCE_COLORS[source as keyof typeof SOURCE_COLORS] || '#666666',
            });
            monthlyData[monthYear].total += usageFallback;
          }
        } else {
          let sum = 0;
          for (let i = 1; i < seq.length; i++) {
            const delta = seq[i] - seq[i - 1];
            if (delta > 0) sum += delta;
          }
          const usage = sum;
          if (usage > 0) {
            monthlyData[monthYear].sources.push({
              source,
              usage,
              color: SOURCE_COLORS[source as keyof typeof SOURCE_COLORS] || '#666666',
            });
            monthlyData[monthYear].total += usage;
          }
        }
      } else if (inMonth.length === 1) {
        const only = Number(inMonth[0].reading) || 0;
        const before = list.filter(r => new Date(r.date).getTime() < monthStart.getTime());
        const prev = before.length > 0 ? before[before.length - 1] : undefined;
        if (prev && prev.reading != null) {
          const baseline = Number(prev.reading) || 0;
          const usage = Math.max(0, only - baseline);
          if (usage > 0) {
            monthlyData[monthYear].sources.push({
              source,
              usage,
              color: SOURCE_COLORS[source as keyof typeof SOURCE_COLORS] || '#666666',
            });
            monthlyData[monthYear].total += usage;
          }
        }
      }
      // If no readings in month or no baseline, we add nothing (UI still shows 0 via source list)
    });
  });
  
  const result = Object.values(monthlyData)
    .filter(monthData => monthData.sources.length > 0) // Only include months with calculated usage
    .sort((a, b) => 
      new Date(`${b.year}-${b.month}`).getTime() - new Date(`${a.year}-${a.month}`).getTime()
    );
  
  console.log('Calculated usage data:', result);
  return result;
};

export const getLatestReadingBySource = (readings: WaterReading[], source: string): WaterReading | undefined => {
  console.log('Getting latest reading for source:', source);
  console.log('Available readings:', readings.length);
  
  if (!readings || readings.length === 0) {
    console.log('No readings available');
    return undefined;
  }
  
  // Skip if not a valid water source
  if (!VALID_WATER_SOURCES.includes(source)) {
    console.log('Invalid source requested:', source);
    return undefined;
  }
  
  // Filter readings for the specific source using canonical component_type (from view),
  // falling back to source_name/component_name when necessary
  const filtered = readings.filter(reading => {
    const matches =
      reading.component_type === source ||
      reading.source_name === source ||
      reading.component_name === source;
    if (matches) {
      console.log('Found matching reading for', source, ':', reading);
    }
    return matches;
  });
  
  console.log(`Found ${filtered.length} readings for source: ${source}`);
  
  if (filtered.length === 0) {
    console.log('No readings found for source:', source);
    return undefined;
  }
  
  // Sort by date and get the latest
  const latest = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  console.log('Latest reading for', source, ':', latest);
  return latest;
};
