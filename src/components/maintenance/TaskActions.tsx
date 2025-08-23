
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface TaskActionsProps {
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  refreshTasks: () => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  showCompleted,
  setShowCompleted,
  refreshTasks
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger 
          value="active" 
          onClick={() => setShowCompleted(false)}
        >
          Active Tasks
        </TabsTrigger>
        <TabsTrigger 
          value="completed" 
          onClick={() => setShowCompleted(true)}
        >
          Completed Tasks
        </TabsTrigger>
      </TabsList>
      
      <Button variant="outline" onClick={refreshTasks}>
        Refresh
      </Button>
    </div>
  );
};
