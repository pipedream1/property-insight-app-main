
import { WaterReading, MonthlyUsage } from '@/types/waterReadings';
import { VALID_WATER_SOURCES, SOURCE_COLORS } from '@/constants/waterSources';

export const calculateUsageData = (readings: WaterReading[]): MonthlyUsage[] => {
  console.log('Calculating usage data from readings:', readings.length);
  
  if (!readings || readings.length === 0) {
    console.log('No readings available, returning empty usage data');
    return [];
  }

  const monthlyData: { [key: string]: MonthlyUsage } = {};
  
  // Group readings by month and source
  const groupedReadings: { [monthYear: string]: { [source: string]: WaterReading[] } } = {};
  
  readings.forEach(reading => {
    if (!reading.reading || !reading.date) {
      console.log('Skipping reading with missing data:', reading);
      return;
    }
    
    const date = new Date(reading.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Use component_type first, then component_name as fallback
    const sourceType = reading.component_type || reading.component_name || 'Unknown';
    
    // Skip if not a valid water source
    if (!VALID_WATER_SOURCES.includes(sourceType)) {
      console.log('Skipping invalid source:', sourceType);
      return;
    }
    
    if (!groupedReadings[monthYear]) {
      groupedReadings[monthYear] = {};
    }
    
    if (!groupedReadings[monthYear][sourceType]) {
      groupedReadings[monthYear][sourceType] = [];
    }
    
    groupedReadings[monthYear][sourceType].push(reading);
  });
  
  // Calculate usage for each month and source
  Object.keys(groupedReadings).forEach(monthYear => {
    const date = new Date(monthYear + '-01');
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: date.toLocaleDateString('en-US', { month: 'long' }),
        year: date.getFullYear(),
        sources: [],
        total: 0
      };
    }
    
    Object.keys(groupedReadings[monthYear]).forEach(sourceType => {
      const sourceReadings = groupedReadings[monthYear][sourceType];
      
      // Sort readings by date
      sourceReadings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      if (sourceReadings.length >= 2) {
        // Calculate usage as difference between last and first reading
        const firstReading = sourceReadings[0];
        const lastReading = sourceReadings[sourceReadings.length - 1];
        const usage = Number(lastReading.reading) - Number(firstReading.reading);
        
        console.log(`${sourceType} usage for ${monthYear}:`, {
          first: firstReading.reading,
          last: lastReading.reading,
          usage: usage
        });
        
        // Only include positive usage values
        if (usage > 0) {
          monthlyData[monthYear].sources.push({
            source: sourceType,
            usage: usage,
            color: SOURCE_COLORS[sourceType as keyof typeof SOURCE_COLORS] || '#666666'
          });
          
          monthlyData[monthYear].total += usage;
        }
      } else if (sourceReadings.length === 1) {
        // If only one reading, we can't calculate usage for that month
        console.log(`Only one reading for ${sourceType} in ${monthYear}, cannot calculate usage`);
      }
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
  
  // Filter readings for the specific source using both component_type and component_name
  const filtered = readings.filter(reading => {
    const matches = reading.component_type === source || reading.component_name === source;
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
