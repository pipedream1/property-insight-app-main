
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WaterSourceOption } from '@/api/waterReadingsApi';
import { addPendingReading, trySyncPendingReadings } from '@/utils/storage/pendingReadings';

interface AddReadingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  waterSources: WaterSourceOption[];
  onReadingSaved: () => void;
}

export const AddReadingDialog = ({ isOpen, onOpenChange, waterSources, onReadingSaved }: AddReadingDialogProps) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [reading, setReading] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Try syncing any pending items whenever dialog opens
  useEffect(() => {
    const doSync = async () => {
      if (!isOpen) return;
      const res = await trySyncPendingReadings(async (r) => {
        // prefer FK if provided
        if (r.water_source_id) {
          const fk = await supabase.from('water_readings').insert([{ ...r }]);
          if (!fk.error) return { error: null };
        }
        return await supabase.from('water_readings').insert([
          {
            component_type: r.component_type,
            component_name: r.component_name,
            reading: r.reading,
            date: r.date,
            comment: r.comment,
            photo_taken: false,
            photo_url: null,
          },
        ]);
      });
      if (res.success > 0) {
        toast.success(`Synced ${res.success} pending reading${res.success > 1 ? 's' : ''}`);
        onReadingSaved();
      }
    };
    void doSync();
  }, [isOpen, onReadingSaved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSourceId || !reading.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const readingValue = parseFloat(reading);
    if (isNaN(readingValue) || readingValue < 0) {
      toast.error('Please enter a valid reading value');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected water source to get its name and fallback flag
      const selectedWaterSource = waterSources.find(source => source.id.toString() === selectedSourceId);

      let error: { message: string } | null = null;

      if (selectedWaterSource && !selectedWaterSource.isFallback) {
        // New schema path with FK only when the option came from DB
        const res = await supabase
          .from('water_readings')
          .insert([
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...( { water_source_id: parseInt(selectedSourceId) } as any ),
              reading: readingValue,
              date: selectedDate.toISOString(),
              comment: notes.trim() || null,
              photo_taken: false,
              photo_url: null,
            },
          ]);
        error = res.error;
        if (error) console.warn('FK insert failed, will try legacy:', error.message);
      }

      if (error || !selectedWaterSource || selectedWaterSource.isFallback) {
        // Legacy schema path using component_type/name
        const legacyResult = await supabase
          .from('water_readings')
          .insert([
            {
              component_type: selectedWaterSource?.name ?? 'Unknown',
              component_name: selectedWaterSource?.name ?? 'Unknown',
              reading: readingValue,
              date: selectedDate.toISOString(),
              comment: notes.trim() || null,
              photo_taken: false,
              photo_url: null,
            },
          ]);
        error = legacyResult.error;
      }

      if (error) {
        console.error('Error saving water reading:', error);
        // If blocked by RLS, queue locally and inform the user.
        if (error.message?.toLowerCase().includes('row-level security')) {
          addPendingReading({
            component_type: selectedWaterSource?.name ?? 'Unknown',
            component_name: selectedWaterSource?.name ?? 'Unknown',
            water_source_id: selectedWaterSource?.isFallback ? undefined : parseInt(selectedSourceId),
            reading: readingValue,
            date: selectedDate.toISOString(),
            comment: notes.trim() || null,
          });
          toast.info('You are not permitted to write yet. Saved offline and will sync automatically when permissions/migrations are applied.');
          onOpenChange(false);
        } else {
          toast.error(`Failed to save reading: ${error.message}`);
        }
        return;
      }

      toast.success('Reading saved successfully');
      onReadingSaved();
      onOpenChange(false);
      
      // Reset form
      setSelectedSourceId('');
      setReading('');
      setSelectedDate(new Date());
      setNotes('');
    } catch (error) {
      console.error('Error saving water reading:', error);
      toast.error('Failed to save reading');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Water Reading</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Water Source *</Label>
            <Select value={selectedSourceId} onValueChange={setSelectedSourceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                {waterSources.length === 0 && (
                  <SelectItem value="__none__" disabled>
                    No sources available (check connectivity)
                  </SelectItem>
                )}
                {waterSources.map((source) => (
                  <SelectItem key={source.id} value={source.id.toString()}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reading">Reading (L) *</Label>
            <Input
              id="reading"
              type="number"
              step="1"
              min="0"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="Enter cumulative meter reading in liters"
              required
            />
            <p className="text-xs text-muted-foreground">
              Tip: This is the cumulative meter value. Monthly usage is calculated from increases during the selected month.
            </p>
          </div>

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
              {isSubmitting ? 'Saving...' : 'Add Reading'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReadingDialog;
