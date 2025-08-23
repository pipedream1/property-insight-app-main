
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches maintenance tasks for the specified components from Supabase
 */
export async function fetchMaintenanceTasks(componentNames: string[]) {
  try {
    console.log('Fetching maintenance tasks for components:', componentNames);
    
    if (!componentNames || componentNames.length === 0) {
      console.log('No component names provided, returning empty tasks');
      return { pending: [], completed: [] };
    }

    // First, let's see what maintenance tasks exist in the database
    const { data: allTasks, error: allTasksError } = await supabase
      .from('maintenance_tasks')
      .select('*');
      
    if (allTasksError) {
      console.error('Error fetching all tasks for debugging:', allTasksError);
    } else {
      console.log('All maintenance tasks in database:', allTasks);
    }

    // Create a more flexible search - try both exact matches and partial matches
    const searchTerms = componentNames.map(name => name.toLowerCase().trim()).filter(Boolean);
    console.log('Search terms for maintenance tasks:', searchTerms);

    // Fetch all maintenance tasks and filter in JavaScript for more flexible matching
    const { data: allMaintenanceTasks, error: fetchError } = await supabase
      .from('maintenance_tasks')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching maintenance tasks:', fetchError);
      return { pending: [], completed: [] };
    }

    console.log('Total maintenance tasks found:', allMaintenanceTasks?.length || 0);

    if (!allMaintenanceTasks || allMaintenanceTasks.length === 0) {
      return { pending: [], completed: [] };
    }

    // Filter tasks based on flexible matching
    const matchingTasks = allMaintenanceTasks.filter(task => {
      // If task has a component_name, try to match it
      if (task.component_name && task.component_name.trim() !== '') {
        const taskComponentName = task.component_name.toLowerCase().trim();
        
        // Try exact matches first
        if (searchTerms.includes(taskComponentName)) {
          return true;
        }
        
        // Try partial matches - check if any search term is contained in the task component name
        // or if the task component name is contained in any search term
        if (searchTerms.some(term => 
          taskComponentName.includes(term) || term.includes(taskComponentName)
        )) {
          return true;
        }
      }
      
      // If component_name is empty or doesn't match, try matching by component_type
      if (task.component_type && task.component_type.trim() !== '') {
        const taskComponentType = task.component_type.toLowerCase().trim();
        
        // Try exact matches with component type
        if (searchTerms.includes(taskComponentType)) {
          console.log(`Matched task by component_type: ${task.component_type} -> ${task.description.substring(0, 50)}...`);
          return true;
        }
        
        // Try partial matches with component type
        if (searchTerms.some(term => 
          taskComponentType.includes(term) || term.includes(taskComponentType)
        )) {
          console.log(`Matched task by partial component_type: ${task.component_type} -> ${task.description.substring(0, 50)}...`);
          return true;
        }
      }
      
      return false;
    });

    console.log('Matching maintenance tasks found:', matchingTasks.length);
    console.log('Matching tasks:', matchingTasks.map(t => ({ 
      id: t.id, 
      component_type: t.component_type,
      component_name: t.component_name, 
      description: t.description.substring(0, 100), 
      completed_at: t.completed_at 
    })));

    // Separate pending and completed tasks
    const pendingTasks = matchingTasks.filter(task => !task.completed_at);
    const completedTasks = matchingTasks.filter(task => !!task.completed_at);

    // For completed tasks, only show those from the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentCompletedTasks = completedTasks.filter(task => 
      task.completed_at && new Date(task.completed_at) >= threeMonthsAgo
    );

    const result = {
      pending: pendingTasks || [],
      completed: recentCompletedTasks || []
    };
    
    console.log('Final maintenance tasks result:', {
      pending: result.pending.length,
      completed: result.completed.length,
      pendingTasks: result.pending.map(t => ({ type: t.component_type, name: t.component_name })),
      completedTasks: result.completed.map(t => ({ type: t.component_type, name: t.component_name }))
    });

    return result;
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error);
    return { pending: [], completed: [] };
  }
}
