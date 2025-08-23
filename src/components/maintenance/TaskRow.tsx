
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { MaintenanceTask } from '@/types';
import TaskPhotos from './TaskPhotos';
import { PriorityBadge } from './PriorityBadge';
import { TaskDateDisplay } from './TaskDateDisplay';
import { TaskRowActions } from './TaskRowActions';

interface TaskRowProps {
  task: MaintenanceTask;
  showCompleted: boolean;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onImageClick: (url: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ 
  task, 
  showCompleted, 
  onCompleteTask, 
  onDeleteTask,
  onImageClick
}) => {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="font-medium">{task.componentType}</div>
        {task.componentName && (
          <div className="text-muted-foreground text-sm">{task.componentName}</div>
        )}
        {/* Display task photos if available */}
        {task.photos && task.photos.length > 0 && (
          <TaskPhotos photos={task.photos} onImageClick={onImageClick} />
        )}
      </TableCell>
      <TableCell>{task.description}</TableCell>
      <TableCell><PriorityBadge priority={task.priority} /></TableCell>
      <TableCell>
        <TaskDateDisplay date={task.createdAt} />
      </TableCell>
      {showCompleted && task.completedAt && (
        <TableCell>
          <TaskDateDisplay date={task.completedAt} isCompleted={true} />
        </TableCell>
      )}
      <TableCell className="text-right">
        <TaskRowActions 
          task={task}
          showCompleted={showCompleted}
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
        />
      </TableCell>
    </TableRow>
  );
};
