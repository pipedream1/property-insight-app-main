
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceTask } from "@/types";

interface CreateMaintenanceTaskParams {
  componentType: string;
  componentName?: string;
  description: string;
  inspectionId?: number;
  priority?: 'Low' | 'Medium' | 'High';
}

export const createMaintenanceTask = async (params: CreateMaintenanceTaskParams): Promise<MaintenanceTask> => {
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .insert({
      component_type: params.componentType,
      component_name: params.componentName,
      description: params.description,
      inspection_id: params.inspectionId || null,
      priority: params.priority || 'Medium'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating maintenance task:', error);
    throw new Error('Failed to create maintenance task');
  }

  return {
    id: data.id,
    componentType: data.component_type,
    componentName: data.component_name,
    description: data.description,
    createdAt: new Date(data.created_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : null,
    inspectionId: data.inspection_id,
    priority: data.priority as 'Low' | 'Medium' | 'High'
  };
};

export const fetchMaintenanceTasks = async (includeCompleted = false): Promise<MaintenanceTask[]> => {
  let query = supabase
    .from('maintenance_tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeCompleted) {
    query = query.is('completed_at', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching maintenance tasks:', error);
    throw new Error('Failed to fetch maintenance tasks');
  }

  // Fetch related inspection photos for each task
  const tasksWithPhotos = await Promise.all((data || []).map(async (task) => {
    let photos: string[] = [];
    
    // If task has an inspection_id, fetch photos from property_components
    if (task.inspection_id) {
      const { data: inspection, error: inspectionError } = await supabase
        .from('property_components')
        .select('photo_url')
        .eq('id', task.inspection_id)
        .single();
        
      if (!inspectionError && inspection?.photo_url) {
        try {
          if (typeof inspection.photo_url === 'string') {
            try {
              const parsed = JSON.parse(inspection.photo_url);
              photos = Array.isArray(parsed) ? parsed : [inspection.photo_url];
            } catch {
              photos = [inspection.photo_url];
            }
          } else if (Array.isArray(inspection.photo_url)) {
            photos = inspection.photo_url;
          }
        } catch (e) {
          console.warn('Error parsing photo URLs for task:', e);
        }
      }
    }

    // Also check for dedicated maintenance photos
    const { data: maintenancePhotos, error: photosError } = await supabase
      .from('maintenance_photos')
      .select('photo_url')
      .eq('maintenance_task_id', task.id);

    if (!photosError && maintenancePhotos) {
      const additionalPhotos = maintenancePhotos.map(p => p.photo_url);
      photos = [...photos, ...additionalPhotos];
    }

    return {
      id: task.id,
      componentType: task.component_type,
      componentName: task.component_name,
      description: task.description,
      createdAt: new Date(task.created_at),
      completedAt: task.completed_at ? new Date(task.completed_at) : null,
      inspectionId: task.inspection_id,
      priority: task.priority as 'Low' | 'Medium' | 'High',
      photos: photos
    };
  }));

  return tasksWithPhotos;
};

export const completeMaintenanceTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('maintenance_tasks')
    .update({
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error completing maintenance task:', error);
    throw new Error('Failed to complete maintenance task');
  }
};

export const deleteMaintenanceTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('maintenance_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting maintenance task:', error);
    throw new Error('Failed to delete maintenance task');
  }
};
