
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MaintenanceTask } from '@/types';
import { TableLoadingState } from './TableLoadingState';
import { TableEmptyState } from './TableEmptyState';
import { TaskRow } from './TaskRow';

interface TasksTableProps {
  tasks: MaintenanceTask[];
  isLoading: boolean;
  error: Error | null;
  showCompleted: boolean;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onImageClick: (url: string) => void;
  refreshTasks: () => void;
}

export const TasksTable: React.FC<TasksTableProps> = ({ 
  tasks, 
  isLoading, 
  error, 
  showCompleted, 
  onCompleteTask, 
  onDeleteTask,
  onImageClick,
  refreshTasks
}) => {
  if (isLoading) {
    return <TableLoadingState />;
  }
  
  if (error) {
    return <TableEmptyState showCompleted={showCompleted} refreshTasks={refreshTasks} isError={true} />;
  }
  
  if (tasks.length === 0) {
    return <TableEmptyState showCompleted={showCompleted} />;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Created</TableHead>
          {showCompleted && <TableHead>Completed</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TaskRow 
            key={task.id}
            task={task}
            showCompleted={showCompleted}
            onCompleteTask={onCompleteTask}
            onDeleteTask={onDeleteTask}
            onImageClick={onImageClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};
