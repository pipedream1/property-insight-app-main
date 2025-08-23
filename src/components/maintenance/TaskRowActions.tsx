
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Trash } from 'lucide-react';
import { MaintenanceTask } from '@/types';
import { useNavigate } from 'react-router-dom';

interface TaskRowActionsProps {
  task: MaintenanceTask;
  showCompleted: boolean;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskRowActions: React.FC<TaskRowActionsProps> = ({
  task,
  showCompleted,
  onCompleteTask,
  onDeleteTask
}) => {
  const navigate = useNavigate();
  
  const handleNavigateToComponent = () => {
    if (task.componentType) {
      if (task.componentName) {
        navigate(`/property-components/${task.componentType}/${task.componentName.replace(/\s+/g, '-').toLowerCase()}`);
      } else {
        navigate(`/property-components/${task.componentType}`);
      }
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleNavigateToComponent}
        className="hidden group-hover:flex items-center"
      >
        <ArrowRight className="h-4 w-4 mr-1" />
        <span>View</span>
      </Button>
      
      {!showCompleted ? (
        <>
          <Button 
            size="sm" 
            variant="outline" 
            className="hidden group-hover:flex items-center text-green-600 border-green-300 hover:bg-green-50"
            onClick={() => onCompleteTask(task.id)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Complete</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="hidden group-hover:flex items-center text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => onDeleteTask(task.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          size="sm" 
          variant="outline"
          className="hidden group-hover:flex items-center text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => onDeleteTask(task.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
