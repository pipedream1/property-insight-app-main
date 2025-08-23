
import React from 'react';
import { Button } from '@/components/ui/button';

interface EditReadingActionsProps {
  onUpdate: () => void;
  onDelete: () => void;
}

const EditReadingActions: React.FC<EditReadingActionsProps> = ({
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={onUpdate}>
        Update Reading
      </Button>
      <Button 
        variant="destructive" 
        onClick={onDelete}
        className="px-4"
      >
        Delete
      </Button>
    </div>
  );
};

export default EditReadingActions;
