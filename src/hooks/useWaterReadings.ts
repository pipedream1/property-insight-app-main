
import { useState, useEffect } from 'react';
import { WaterReading, ReservoirReading } from '@/types/waterReadings';
import { fetchWaterReadings, fetchReservoirReadings } from '@/api/waterReadingsApi';
import { calculateUsageData, getLatestReadingBySource } from '@/utils/waterReadingCalculations';

export const useWaterReadings = () => {
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [reservoirReadings, setReservoirReadings] = useState<ReservoirReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReadings = async () => {
    const data = await fetchWaterReadings();
    setReadings(data);
  };

  const fetchReservoir = async () => {
    const data = await fetchReservoirReadings();
    setReservoirReadings(data);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchReadings(), fetchReservoir()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const usageData = calculateUsageData(readings);
  
  const getLatestReading = (source: string) => getLatestReadingBySource(readings, source);

  return {
    readings,
    reservoirReadings,
    isLoading,
    fetchReadings,
    fetchReservoirReadings: fetchReservoir,
    calculateUsageData: () => usageData,
    getLatestReadingBySource: getLatestReading,
  };
};

// Re-export types and constants for backward compatibility
export type { WaterReading, ReservoirReading, MonthlyUsage } from '@/types/waterReadings';
export { WATER_SOURCES } from '@/constants/waterSources';
