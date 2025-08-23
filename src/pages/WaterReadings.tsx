
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopNavigation from '@/components/TopNavigation';
import { useWaterReadings, WATER_SOURCES } from '@/hooks/useWaterReadings';
import AddReadingDialog from '@/components/water-readings/AddReadingDialog';
import ReadingsTab from '@/components/water-readings/ReadingsTab';
import MonthlyUsageTab from '@/components/water-readings/MonthlyUsageTab';
import { ReservoirCard } from '@/components/water-readings/ReservoirCard';
import { BackButton } from '@/components/ui/back-button';

const WaterReadingsPage = () => {
  const [isAddingReading, setIsAddingReading] = useState(false);
  const { 
    readings, 
    reservoirReadings,
    isLoading, 
    fetchReadings, 
    fetchReservoirReadings,
    calculateUsageData, 
    getLatestReadingBySource 
  } = useWaterReadings();
  const usageData = calculateUsageData();

  const handleReadingUpdated = () => {
    fetchReadings();
    fetchReservoirReadings();
  };

  // Convert hook readings to component readings format
  const convertedReadings = readings.map(reading => ({
    id: reading.id.toString(),
    source: reading.component_type,
    reading: reading.reading,
    readingDate: new Date(reading.date),
    createdAt: new Date(reading.created_at || reading.date),
    notes: reading.comment
  }));

  // Convert getLatestReadingBySource function
  const convertedGetLatestReading = (source: string) => {
    const latest = getLatestReadingBySource(source);
    if (!latest) return null; // Changed from undefined to null for consistency
    
    return {
      id: latest.id.toString(),
      source: latest.component_type,
      reading: latest.reading,
      readingDate: new Date(latest.date),
      createdAt: new Date(latest.created_at || latest.date),
      notes: latest.comment
    };
  };

  console.log('WaterReadings Debug:', { 
    readings: readings.length, 
    convertedReadings: convertedReadings.length,
    isLoading 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">Water Readings</h1>
        </div>

        <Tabs defaultValue="readings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readings">Readings</TabsTrigger>
            <TabsTrigger value="reservoir">Reservoir</TabsTrigger>
            <TabsTrigger value="usage">Monthly Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="mt-6">
            <ReadingsTab
              waterSources={WATER_SOURCES.filter(source => source.value !== 'Reservoir')}
              readings={convertedReadings}
              isLoading={isLoading}
              onAddReading={() => setIsAddingReading(true)}
              getLatestReadingBySource={convertedGetLatestReading}
              onReadingUpdated={handleReadingUpdated}
            />
          </TabsContent>

          <TabsContent value="reservoir" className="mt-6">
            <div className="max-w-md mx-auto">
              <ReservoirCard 
                readings={reservoirReadings}
                onReadingAdded={handleReadingUpdated}
              />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            <MonthlyUsageTab usageData={usageData} />
          </TabsContent>
        </Tabs>

        <AddReadingDialog
          isOpen={isAddingReading}
          onOpenChange={setIsAddingReading}
          waterSources={WATER_SOURCES.filter(source => source.value !== 'Reservoir')}
          onReadingSaved={handleReadingUpdated}
        />
      </main>
    </div>
  );
};

export default WaterReadingsPage;
