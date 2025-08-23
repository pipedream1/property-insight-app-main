
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface CompleteTaskDialogProps {
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const CompleteTaskDialog: React.FC<CompleteTaskDialogProps> = ({ 
  taskId, 
  onOpenChange, 
  onConfirm 
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    toast.success('Task marked as completed');
  };
  
  return (
    <AlertDialog open={!!taskId} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Maintenance Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this task as completed? This will remove it from the active tasks list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Mark as Complete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
