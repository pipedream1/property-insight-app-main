
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CameraCapture from '@/components/CameraCapture';
import { ComponentCondition } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InspectionFormProps {
  onSubmit: (
    inspectionDate: Date,
    inspectionCondition: ComponentCondition,
    inspectionNotes: string,
    capturedImages: string[]
  ) => void;
  initialValues?: {
    date?: Date;
    condition?: ComponentCondition;
    notes?: string;
    images?: string[];
  };
  isEditing?: boolean;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ 
  onSubmit, 
  initialValues = {}, 
  isEditing = false 
}) => {
  const [inspectionDate, setInspectionDate] = useState<Date>(initialValues.date || new Date());
  const [inspectionCondition, setInspectionCondition] = useState<ComponentCondition>(
    initialValues.condition as ComponentCondition || ComponentCondition.GOOD
  );
  const [inspectionNotes, setInspectionNotes] = useState(initialValues.notes || '');
  const [capturedImages, setCapturedImages] = useState<string[]>(initialValues.images || []);

  const handleImageCaptured = (imageUrl: string) => {
    setCapturedImages([...capturedImages, imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    setCapturedImages(newImages);
  };

  const handleSubmit = () => {
    onSubmit(
      inspectionDate,
      inspectionCondition as ComponentCondition,
      inspectionNotes,
      capturedImages
    );
  };

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-4 py-2 pb-24">
        <div className="space-y-2">
          <Label htmlFor="date">Inspection Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(inspectionDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={inspectionDate}
                onSelect={(date) => date && setInspectionDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Component Condition</Label>
          <select
            id="condition"
            value={inspectionCondition}
            onChange={(e) => setInspectionCondition(e.target.value as ComponentCondition)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
          >
            {Object.values(ComponentCondition).map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Inspection Notes</Label>
          <Textarea
            id="notes"
            value={inspectionNotes}
            onChange={(e) => setInspectionNotes(e.target.value)}
            placeholder="Describe the current condition and any issues..."
            rows={4}
          />
        </div>

        <div>
          <Label className="mb-2 block">Photos</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Add multiple photos to document the component condition. You can take or upload up to 5 photos.
          </p>
          <CameraCapture 
            onImageCaptured={handleImageCaptured} 
            capturedImages={capturedImages} 
            onRemoveImage={handleRemoveImage}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-10">
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={capturedImages.length > 5}
            size="lg"
          >
            {isEditing ? 'Update Inspection' : 'Save Inspection'}
          </Button>
          {capturedImages.length > 5 && (
            <p className="text-destructive text-sm mt-2">
              You can only upload a maximum of 5 photos.
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default InspectionForm;
