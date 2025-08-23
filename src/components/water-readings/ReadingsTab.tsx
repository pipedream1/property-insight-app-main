
import React, { useState } from 'react';
import { WaterReading } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import WaterSourceCard from './WaterSourceCard';
import ReadingsListDialog from './ReadingsListDialog';
import EditReadingDialog from './EditReadingDialog';

interface ReadingsTabProps {
  waterSources: Array<{ value: string; label: string }>;
  readings: WaterReading[];
  isLoading: boolean;
  onAddReading: () => void;
  getLatestReadingBySource: (source: string) => WaterReading | null;
  onReadingUpdated: () => void;
}

const ReadingsTab: React.FC<ReadingsTabProps> = ({
  waterSources,
  readings,
  isLoading,
  onAddReading,
  getLatestReadingBySource,
  onReadingUpdated,
}) => {
  const [selectedSource, setSelectedSource] = useState<{ name: string; label: string } | null>(null);
  const [editingReading, setEditingReading] = useState<WaterReading | null>(null);
  const [showReadingsList, setShowReadingsList] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleViewAllReadings = (sourceName: string, sourceLabel: string) => {
    setSelectedSource({ name: sourceName, label: sourceLabel });
    setShowReadingsList(true);
  };

  const handleEditLatest = (sourceName: string) => {
    const latest = getLatestReadingBySource(sourceName);
    if (latest) {
      setEditingReading(latest);
      setShowEditDialog(true);
    }
  };

  const handleEditReading = (reading: WaterReading) => {
    setEditingReading(reading);
    setShowReadingsList(false);
    setShowEditDialog(true);
  };

  const handleReadingUpdated = () => {
    onReadingUpdated();
    setShowEditDialog(false);
    setShowReadingsList(false);
  };

  return (
    <div>
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-xl font-semibold">Water Meter Readings</h2>
      </div>
      
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={onAddReading} 
          className="gap-1"
        >
          <PlusCircle className="h-4 w-4" /> Add Reading
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {waterSources.map((source) => (
          <WaterSourceCard
            key={source.value}
            sourceName={source.value}
            sourceLabel={source.label}
            latestReading={getLatestReadingBySource(source.value)}
            isLoading={isLoading}
            onViewAllReadings={() => handleViewAllReadings(source.value, source.label)}
            onEditLatest={() => handleEditLatest(source.value)}
          />
        ))}
      </div>

      {/* Readings List Dialog */}
      <ReadingsListDialog
        isOpen={showReadingsList}
        onOpenChange={setShowReadingsList}
        readings={readings}
        sourceName={selectedSource?.name || ''}
        sourceLabel={selectedSource?.label || ''}
        onEditReading={handleEditReading}
        isLoading={isLoading}
      />

      {/* Edit Reading Dialog */}
      <EditReadingDialog
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        reading={editingReading}
        onReadingUpdated={handleReadingUpdated}
      />
    </div>
  );
};

export default ReadingsTab;
