
import { useState, useEffect } from 'react';
import { WaterReading, ReservoirReading } from '@/types/waterReadings';
import { fetchWaterReadings, fetchReservoirReadings, fetchWaterSourcesWithIds, WaterSourceOption } from '@/api/waterReadingsApi';
import { calculateUsageData, getLatestReadingBySource } from '@/utils/waterReadingCalculations';

export const useWaterReadings = () => {
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [reservoirReadings, setReservoirReadings] = useState<ReservoirReading[]>([]);
  const [waterSources, setWaterSources] = useState<WaterSourceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReadings = async () => {
    const data = await fetchWaterReadings();
    setReadings(data);
  };

  const fetchReservoir = async () => {
    const data = await fetchReservoirReadings();
    setReservoirReadings(data);
  };

  const fetchSources = async () => {
    const data = await fetchWaterSourcesWithIds();
    setWaterSources(data);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchReadings(), fetchReservoir(), fetchSources()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const usageData = calculateUsageData(readings);
  
  const getLatestReading = (source: string) => getLatestReadingBySource(readings, source);

  return {
    readings,
    reservoirReadings,
    waterSources,
    isLoading,
    fetchReadings,
    fetchReservoirReadings: fetchReservoir,
    fetchWaterSources: fetchSources,
    calculateUsageData: () => usageData,
    getLatestReadingBySource: getLatestReading,
  };
};

// Re-export types and constants for backward compatibility
export type { WaterReading, ReservoirReading, MonthlyUsage } from '@/types/waterReadings';
export { WATER_SOURCES } from '@/constants/waterSources';
