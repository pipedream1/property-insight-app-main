
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { WaterReading } from '@/types';

interface EditReadingFormProps {
  reading: WaterReading;
  readingValue: string;
  setReadingValue: (value: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const EditReadingForm: React.FC<EditReadingFormProps> = ({
  reading,
  readingValue,
  setReadingValue,
  selectedDate,
  setSelectedDate,
  notes,
  setNotes,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source">Water Source</Label>
        <Input
          id="source"
          value={reading.source}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reading">Reading Value</Label>
        <Input
          id="reading"
          type="number"
          value={readingValue}
          onChange={(e) => setReadingValue(e.target.value)}
          placeholder="Enter meter reading"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Reading Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes"
        />
      </div>
    </div>
  );
};

export default EditReadingForm;
