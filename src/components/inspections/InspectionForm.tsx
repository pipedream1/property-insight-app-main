import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Camera, Upload, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import Webcam from 'react-webcam';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useInspections } from '@/hooks/useInspections';

interface InspectionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInspectionSaved: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  isOpen,
  onOpenChange,
  onInspectionSaved,
}) => {
  const { createInspection, isCreating } = useInspections();
  const [propertyId, setPropertyId] = useState('');
  const [inspectionDate, setInspectionDate] = useState<Date>(new Date());
  const [inspectorName, setInspectorName] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && photos.length < 5) {
      // Convert base64 to blob and upload
      const blob = await fetch(imageSrc).then(res => res.blob());
      await uploadPhoto(blob);
    } else if (photos.length >= 5) {
      toast.error('Maximum 5 photos allowed');
    }
  }, [photos]);

  const uploadPhoto = async (file: Blob) => {
    try {
      const fileName = `inspection-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const { data, error } = await supabase.storage
        .from('inspection-photos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('inspection-photos')
        .getPublicUrl(fileName);

      setPhotos(prev => [...prev, publicUrl]);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length + files.length <= 5) {
      for (let i = 0; i < files.length; i++) {
        await uploadPhoto(files[i]);
      }
    } else {
      toast.error('Maximum 5 photos allowed');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId.trim() || !inspectorName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const inspectionData = {
      property_id: propertyId.trim(),
      inspection_date: inspectionDate.toISOString().split('T')[0],
      inspector_name: inspectorName.trim(),
      notes: notes.trim() || null,
      photos: photos,
      status: 'pending',
    };

    createInspection(inspectionData, {
      onSuccess: () => {
        onInspectionSaved();
        onOpenChange(false);
        // Reset form
        setPropertyId('');
        setInspectionDate(new Date());
        setInspectorName('');
        setNotes('');
        setPhotos([]);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Property Inspection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property ID *</Label>
            <Input
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Inspection Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(inspectionDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={inspectionDate}
                  onSelect={(date) => date && setInspectionDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspectorName">Inspector Name *</Label>
            <Input
              id="inspectorName"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              placeholder="Enter inspector name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter inspection notes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Photos ({photos.length}/5)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(!showCamera)}
              >
                <Camera className="mr-2 h-4 w-4" />
                {showCamera ? 'Hide Camera' : 'Take Photo'}
              </Button>
              <label>
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </span>
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {showCamera && (
              <div className="space-y-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full max-w-sm mx-auto"
                />
                <Button type="button" onClick={capturePhoto}>
                  Capture Photo
                </Button>
              </div>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Saving...' : 'Save Inspection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
