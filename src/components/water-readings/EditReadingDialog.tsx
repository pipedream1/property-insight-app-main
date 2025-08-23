
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WaterReading } from '@/types';
import EditReadingForm from './components/EditReadingForm';
import EditReadingActions from './components/EditReadingActions';
import { updateWaterReading, deleteWaterReading } from './utils/readingOperations';

interface EditReadingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reading: WaterReading | null;
  onReadingUpdated: () => void;
}

const EditReadingDialog: React.FC<EditReadingDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  reading,
  onReadingUpdated 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [readingValue, setReadingValue] = useState('');
  const [notes, setNotes] = useState('');

  // Update form when reading changes
  useEffect(() => {
    if (reading) {
      setSelectedDate(reading.readingDate);
      setReadingValue(reading.reading.toString());
      setNotes(reading.notes || '');
    }
  }, [reading]);

  const handleUpdateReading = async () => {
    if (!reading) return;

    const success = await updateWaterReading(reading, readingValue, selectedDate, notes);
    if (success) {
      onOpenChange(false);
      onReadingUpdated();
    }
  };

  const handleDeleteReading = async () => {
    if (!reading) return;

    const success = await deleteWaterReading(reading);
    if (success) {
      onOpenChange(false);
      onReadingUpdated();
    }
  };

  if (!reading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Water Reading</DialogTitle>
          <DialogDescription>
            Modify the water meter reading for {reading.source}.
          </DialogDescription>
        </DialogHeader>
        <EditReadingForm
          reading={reading}
          readingValue={readingValue}
          setReadingValue={setReadingValue}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          notes={notes}
          setNotes={setNotes}
        />
        <EditReadingActions
          onUpdate={handleUpdateReading}
          onDelete={handleDeleteReading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditReadingDialog;
