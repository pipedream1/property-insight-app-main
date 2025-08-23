
/**
 * Generates CSS styles for maintenance tasks in component reports
 */
export const generateMaintenanceTasksStyles = (): string => {
  return `
    /* Maintenance section styles */
    .maintenance-section {
      margin: 25px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    .maintenance-section-title {
      margin-bottom: 20px;
      color: #2c3e50;
      font-size: 20px;
      border-bottom: 2px solid #dee2e6;
      padding-bottom: 8px;
    }
    
    .no-maintenance-data {
      text-align: center;
      padding: 20px;
      background-color: #fff;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }
    
    .no-tasks-hint {
      color: #6c757d;
      font-size: 13px;
      font-style: italic;
      margin-top: 10px;
      line-height: 1.4;
    }
    
    .maintenance-lists {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .maintenance-column {
      flex: 1;
      min-width: 300px;
      padding: 10px;
      border-radius: 6px;
    }
    
    .maintenance-column.pending {
      background-color: #fff0f6;
      border: 1px solid #fcc2d7;
    }
    
    .maintenance-column.completed {
      background-color: #f0f9ff;
      border: 1px solid #a5d8ff;
    }
    
    .maintenance-column-title {
      font-size: 16px;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ced4da;
    }
    
    .maintenance-column.pending .maintenance-column-title {
      color: #e64980;
    }
    
    .maintenance-column.completed .maintenance-column-title {
      color: #1971c2;
    }
    
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .task-item {
      padding: 12px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .task-even {
      background-color: rgba(255, 255, 255, 0.7);
    }
    
    .task-odd {
      background-color: rgba(255, 255, 255, 0.4);
    }
    
    .completed-task {
      border-left: 4px solid #20c997;
      opacity: 0.8;
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
    }
    
    .task-priority {
      padding: 3px 6px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
    }
    
    .priority-high {
      background-color: #ffe3e3;
      color: #c92a2a;
    }
    
    .priority-medium {
      background-color: #fff3bf;
      color: #e67700;
    }
    
    .priority-low {
      background-color: #d3f9d8;
      color: #2b8a3e;
    }
    
    .task-date {
      color: #868e96;
    }
    
    .task-component {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .task-description {
      font-size: 14px;
      color: #495057;
    }
    
    .no-tasks {
      color: #868e96;
      font-style: italic;
      text-align: center;
      padding: 15px 0;
    }
  `;
};
