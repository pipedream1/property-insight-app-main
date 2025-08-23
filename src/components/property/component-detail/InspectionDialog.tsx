
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InspectionForm from '../InspectionForm';
import { ComponentCondition } from '@/types';
import { InspectionType } from '@/types/inspection';

interface InspectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    inspectionDate: Date,
    inspectionCondition: ComponentCondition,
    inspectionNotes: string,
    capturedImages: string[]
  ) => Promise<void>;
  currentInspection: InspectionType | null;
  isEditing: boolean;
}

const InspectionDialog: React.FC<InspectionDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentInspection,
  isEditing
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Inspection' : 'Record Component Inspection'}</DialogTitle>
        </DialogHeader>
        <InspectionForm 
          onSubmit={onSubmit}
          initialValues={currentInspection ? {
            date: currentInspection.created_at ? new Date(currentInspection.created_at) : new Date(),
            condition: currentInspection.condition as ComponentCondition,
            notes: currentInspection.comment,
            images: currentInspection.photo_url ? 
              (typeof currentInspection.photo_url === 'string' ? 
                JSON.parse(currentInspection.photo_url) : 
                currentInspection.photo_url) : []
          } : undefined}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDialog;
