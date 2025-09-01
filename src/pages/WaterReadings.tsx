
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopNavigation from '@/components/TopNavigation';
import { useWaterReadings } from '@/hooks/useWaterReadings';
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
    waterSources,
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
  reading: Number(reading.reading ?? 0),
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
  reading: Number(latest.reading ?? 0),
      readingDate: new Date(latest.date),
      createdAt: new Date(latest.created_at || latest.date),
      notes: latest.comment
    };
  };

  // Convert waterSources for backwards compatibility with ReadingsTab
  const legacyWaterSources = waterSources.map(source => ({
    value: source.name,
    label: source.label
  }));

  console.log('WaterReadings Debug:', { 
    readings: readings.length, 
    convertedReadings: convertedReadings.length,
    waterSources: waterSources.length,
    isLoading 
  });

  // Lightweight UI hint when no sources are available (should rarely happen due to fallbacks)
  const noSources = !isLoading && waterSources.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">Water Readings</h1>
        </div>

        {noSources && (
          <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
            No water sources were loaded. We'll try using built-in defaults, but please check your connection or run the DB migrations.
          </div>
        )}

        <Tabs defaultValue="readings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readings">Readings</TabsTrigger>
            <TabsTrigger value="reservoir">Reservoir</TabsTrigger>
            <TabsTrigger value="usage">Monthly Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="mt-6">
            <ReadingsTab
              waterSources={legacyWaterSources}
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
            <MonthlyUsageTab usageData={usageData} readings={readings} reservoirReadings={reservoirReadings} />
          </TabsContent>
        </Tabs>

        <AddReadingDialog
          isOpen={isAddingReading}
          onOpenChange={setIsAddingReading}
          waterSources={waterSources}
          onReadingSaved={handleReadingUpdated}
        />
      </main>
    </div>
  );
};

export default WaterReadingsPage;
