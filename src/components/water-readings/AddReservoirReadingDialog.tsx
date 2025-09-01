
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReservoirReading } from '@/hooks/useWaterReadings';
import { addPendingReservoirReading, trySyncPendingReservoirReadings } from '@/utils/storage/pendingReservoirReadings';

interface AddReservoirReadingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReadingSaved: () => void;
  editingReading?: ReservoirReading;
}

export const AddReservoirReadingDialog = ({ 
  isOpen, 
  onOpenChange, 
  onReadingSaved,
  editingReading 
}: AddReservoirReadingDialogProps) => {
  const [waterLevel, setWaterLevel] = useState('4.0');
  const [percentageFull, setPercentageFull] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Try to sync pending reservoir readings whenever dialog opens
  useEffect(() => {
    const doSync = async () => {
      if (!isOpen) return;
      const res = await trySyncPendingReservoirReadings(async (r) => {
        return await supabase.from('reservoir_readings').insert([{ ...r }]);
      });
      if (res.success > 0) {
        toast.success(`Synced ${res.success} pending reservoir reading${res.success>1?'s':''}`);
        onReadingSaved();
      }
    };
    void doSync();
  }, [isOpen, onReadingSaved]);

  useEffect(() => {
    if (editingReading && editingReading.id !== 'default') {
      setWaterLevel(editingReading.water_level.toString());
      setPercentageFull(editingReading.percentage_full.toString());
      setSelectedDate(new Date(editingReading.reading_date));
      setNotes(editingReading.notes || '');
    } else {
      // Reset to defaults for new reading
      setWaterLevel('4.0');
      setPercentageFull('');
      setSelectedDate(new Date());
      setNotes('');
    }
  }, [editingReading, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waterLevel.trim() || !percentageFull.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const waterLevelNum = parseFloat(waterLevel);
    const percentageNum = parseFloat(percentageFull);
    
    if (isNaN(waterLevelNum) || isNaN(percentageNum)) {
      toast.error('Please enter valid numbers');
      return;
    }

    if (waterLevelNum < 0 || waterLevelNum > 5) {
      toast.error('Water level must be between 0 and 5 meters');
      return;
    }

    if (percentageNum < 0 || percentageNum > 100) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    setIsSubmitting(true);

    try {
      const readingData = {
        water_level: waterLevelNum,
        percentage_full: percentageNum,
        reading_date: selectedDate.toISOString(),
        notes: notes.trim() || null,
      };

  let error;

      if (editingReading && editingReading.id !== 'default') {
        // Update existing reading
        const { error: updateError } = await supabase
          .from('reservoir_readings')
          .update(readingData)
          .eq('id', editingReading.id);
        error = updateError;
      } else {
        // Insert new reading
        const { error: insertError } = await supabase
          .from('reservoir_readings')
          .insert([readingData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving reservoir reading:', error);
        if (String(error.message || '').toLowerCase().includes('row-level security')) {
          addPendingReservoirReading(readingData);
          toast.info('No permission to write yet. Reading saved offline and will sync automatically once permissions are applied.');
          onOpenChange(false);
        } else {
          toast.error(`Failed to save reading: ${error.message}`);
        }
        return;
      }

      toast.success(editingReading && editingReading.id !== 'default' ? 'Reading updated successfully' : 'Reading added successfully');
      onReadingSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reservoir reading:', error);
      toast.error('Failed to save reading');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingReading && editingReading.id !== 'default' ? 'Edit Reservoir Reading' : 'Add Reservoir Reading'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Reading Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterLevel">Physical Depth (meters) *</Label>
            <Input
              id="waterLevel"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              placeholder="Enter depth in meters (e.g., 4.0)"
              required
            />
            <p className="text-xs text-gray-600">Manually measured water depth</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Electronic Meter Reading (%) *</Label>
            <Input
              id="percentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={percentageFull}
              onChange={(e) => setPercentageFull(e.target.value)}
              placeholder="Enter percentage (e.g., 80.5)"
              required
            />
            <p className="text-xs text-gray-600">Reading from electronic meter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this reading..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingReading && editingReading.id !== 'default' ? 'Update Reading' : 'Add Reading')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
