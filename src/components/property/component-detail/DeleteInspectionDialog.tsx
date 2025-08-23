
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DeleteInspectionDialogProps {
  inspectionToDelete: any | null;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
}

const DeleteInspectionDialog: React.FC<DeleteInspectionDialogProps> = ({ 
  inspectionToDelete, 
  onOpenChange, 
  onDelete 
}) => {
  return (
    <AlertDialog open={!!inspectionToDelete} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this inspection record? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInspectionDialog;
