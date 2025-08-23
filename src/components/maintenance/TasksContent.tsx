
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TasksTable } from './TasksTable';
import { MaintenanceTask } from '@/types';

interface TasksContentProps {
  tasks: MaintenanceTask[];
  isLoading: boolean;
  error: Error | null;
  showCompleted: boolean;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onImageClick: (url: string) => void;
  refreshTasks: () => void;
  tabValue: string;
}

export const TasksContent: React.FC<TasksContentProps> = ({
  tasks,
  isLoading,
  error,
  showCompleted,
  onCompleteTask,
  onDeleteTask,
  onImageClick,
  refreshTasks,
  tabValue
}) => {
  // Filter tasks based on completed status
  const filteredTasks = showCompleted 
    ? tasks.filter(t => t.completedAt)
    : tasks.filter(t => !t.completedAt);
    
  return (
    <TabsContent value={tabValue} className="mt-0">
      <TasksTable 
        tasks={filteredTasks}
        isLoading={isLoading}
        error={error}
        showCompleted={showCompleted}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
        onImageClick={onImageClick}
        refreshTasks={refreshTasks}
      />
    </TabsContent>
  );
};
