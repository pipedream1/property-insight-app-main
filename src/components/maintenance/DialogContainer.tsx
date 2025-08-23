
import React from 'react';
import { CompleteTaskDialog } from './CompleteTaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { ImageDialog } from '@/components/property/inspection/ImageDialog';

interface DialogContainerProps {
  taskToComplete: string | null;
  taskToDelete: string | null;
  selectedImage: string | null;
  onCompleteOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onImageOpenChange: (open: boolean) => void;
  onCompleteConfirm: () => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export const DialogContainer: React.FC<DialogContainerProps> = ({
  taskToComplete,
  taskToDelete,
  selectedImage,
  onCompleteOpenChange,
  onDeleteOpenChange,
  onImageOpenChange,
  onCompleteConfirm,
  onDeleteConfirm
}) => {
  return (
    <>
      <CompleteTaskDialog 
        taskId={taskToComplete} 
        onOpenChange={onCompleteOpenChange} 
        onConfirm={onCompleteConfirm} 
      />
      
      <DeleteTaskDialog 
        taskId={taskToDelete}
        onOpenChange={onDeleteOpenChange} 
        onConfirm={onDeleteConfirm} 
      />
      
      <ImageDialog 
        selectedImage={selectedImage} 
        onOpenChange={onImageOpenChange} 
      />
    </>
  );
};
