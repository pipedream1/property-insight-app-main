
import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface TaskDateDisplayProps {
  date: Date;
  isCompleted?: boolean;
}

export const TaskDateDisplay: React.FC<TaskDateDisplayProps> = ({ 
  date, 
  isCompleted = false 
}) => {
  return (
    <div className="flex items-center">
      {isCompleted ? (
        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
      )}
      <div>
        <div className="text-sm">{format(date, 'PPP')}</div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};
