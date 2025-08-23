
import { useState, useEffect, useCallback } from 'react';
import { MaintenanceTask } from '@/types';
import { 
  fetchMaintenanceTasks, 
  completeMaintenanceTask, 
  deleteMaintenanceTask 
} from '@/services/maintenanceService';

export function useMaintenanceTasks(includeCompleted = false) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMaintenanceTasks(includeCompleted);
      
      // Process photos from the JSON string format if available
      const processedTasks = data.map(task => {
        let photos: string[] = [];
        
        // Parse photo_url if it exists and is not null
        if ('photo_url' in task && task.photo_url) {
          try {
            // Ensure we have a proper string[] type for photos
            if (typeof task.photo_url === 'string') {
              try {
                const parsed = JSON.parse(task.photo_url);
                if (Array.isArray(parsed)) {
                  // If parsed is an array, filter for strings
                  photos = parsed.filter((url): url is string => typeof url === 'string');
                } else if (typeof parsed === 'string') {
                  // If parsed is a string, use it as a single URL
                  photos = [parsed];
                } else {
                  // Fallback to empty array for any other type
                  photos = [];
                }
              } catch (e) {
                // If parsing fails, assume it's a single URL string
                photos = [task.photo_url];
              }
            } else if (Array.isArray(task.photo_url)) {
              // Already an array, ensure all items are strings
              // Fix the type issue by explicitly typing task.photo_url as any[]
              const photoArray = task.photo_url as any[];
              photos = photoArray.filter((url): url is string => 
                typeof url === 'string'
              );
            }
          } catch (e) {
            console.error('Error processing photo URLs:', e);
            photos = [];
          }
        }
        
        // Add photos to the task object and remove photo_url
        const { photo_url, ...restTask } = task as any;
        return {
          ...restTask,
          photos
        };
      });
      
      setTasks(processedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error loading maintenance tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [includeCompleted]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completeTask = async (id: string) => {
    try {
      await completeMaintenanceTask(id);
      await loadTasks();
      return true;
    } catch (err) {
      console.error('Error completing task:', err);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteMaintenanceTask(id);
      await loadTasks();
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      return false;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    refreshTasks: loadTasks,
    completeTask,
    deleteTask
  };
}
