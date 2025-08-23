
/**
 * Generates HTML for the maintenance tasks section
 */
export function renderMaintenanceTasksSection(maintenanceTasks: any): string {
  const hasPendingTasks = maintenanceTasks.pending && maintenanceTasks.pending.length > 0;
  const hasCompletedTasks = maintenanceTasks.completed && maintenanceTasks.completed.length > 0;
  const hasAnyTasks = hasPendingTasks || hasCompletedTasks;

  return `
    <div class="maintenance-section">
      <h3 class="maintenance-section-title">Maintenance Tasks</h3>
      
      ${!hasAnyTasks ? `
        <div class="no-maintenance-data">
          <p class="no-tasks">No maintenance tasks found for the components in this report.</p>
          <p class="no-tasks-hint">Maintenance tasks are linked to components by matching component names. Ensure that maintenance tasks are created with component names that match those used in property inspections.</p>
        </div>
      ` : `
        <div class="maintenance-lists">
          <div class="maintenance-column pending">
            <h4 class="maintenance-column-title">Pending Tasks (${maintenanceTasks.pending.length})</h4>
            ${hasPendingTasks ? `
              <div class="task-list">
                ${maintenanceTasks.pending.map((task, index) => `
                  <div class="task-item ${index % 2 === 0 ? 'task-even' : 'task-odd'}">
                    <div class="task-header">
                      <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                      <span class="task-date">${new Date(task.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div class="task-component">${task.component_type}${task.component_name ? ': ' + task.component_name : ''}</div>
                    <div class="task-description">${task.description}</div>
                  </div>
                `).join('')}
              </div>
            ` : `<p class="no-tasks">No pending maintenance tasks</p>`}
          </div>
          
          <div class="maintenance-column completed">
            <h4 class="maintenance-column-title">Completed Tasks - Last 3 Months (${maintenanceTasks.completed.length})</h4>
            ${hasCompletedTasks ? `
              <div class="task-list">
                ${maintenanceTasks.completed.map((task, index) => `
                  <div class="task-item completed-task ${index % 2 === 0 ? 'task-even' : 'task-odd'}">
                    <div class="task-header">
                      <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                      <span class="task-date">Completed: ${new Date(task.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div class="task-component">${task.component_type}${task.component_name ? ': ' + task.component_name : ''}</div>
                    <div class="task-description">${task.description}</div>
                  </div>
                `).join('')}
              </div>
            ` : `<p class="no-tasks">No completed maintenance tasks in the last 3 months</p>`}
          </div>
        </div>
      `}
    </div>
  `;
}
