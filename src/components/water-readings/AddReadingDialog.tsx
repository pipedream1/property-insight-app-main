
import React, { useState } from 'react';
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

interface AddReadingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  waterSources: Array<{ value: string; label: string }>;
  onReadingSaved: () => void;
}

export const AddReadingDialog = ({ isOpen, onOpenChange, waterSources, onReadingSaved }: AddReadingDialogProps) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [reading, setReading] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSource || !reading.trim()) {
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
      const { error } = await supabase
        .from('water_readings')
        .insert([
          {
            component_type: selectedSource,
            component_name: selectedSource, // Set component_name to match component_type for consistency
            reading: readingValue,
            date: selectedDate.toISOString(),
            comment: notes.trim() || null,
            photo_taken: false,
            photo_url: null,
          },
        ]);

      if (error) {
        console.error('Error saving water reading:', error);
        toast.error('Failed to save reading');
        return;
      }

      toast.success('Reading saved successfully');
      onReadingSaved();
      onOpenChange(false);
      
      // Reset form
      setSelectedSource('');
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
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                {waterSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
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
