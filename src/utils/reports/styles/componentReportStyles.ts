
import { generateComponentStatusStyles } from './component/statusStyles';
import { generateComponentListStyles } from './component/listStyles';
import { generateConditionBadgeStyles } from './component/conditionBadgeStyles';
import { generateComponentDetailStyles } from './component/detailStyles';
import { generatePhotoStyles } from './component/photoStyles';
import { generateMaintenanceTasksStyles } from './component/maintenanceTasksStyles';

/**
 * Generates CSS styles specific to component reports by combining
 * all component-related style modules
 */
export const generateComponentReportStyles = (): string => {
  // Component report specific styles
  const componentReportBaseStyles = `
    /* Component report specific base styles */
    .component-report-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .component-section {
      margin-bottom: 20px;
    }
    
    .component-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .component-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    .component-category-section {
      margin-bottom: 18px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .component-category-header {
      background-color: #f8fafc;
      padding: 8px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .component-category-title {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
    }
    
    .component-category-items {
      padding: 12px;
    }
    
    .component-item-card {
      margin-bottom: 14px;
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background-color: #ffffff;
    }
    
    .component-item-card:last-child {
      margin-bottom: 0;
    }
    
    .component-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .component-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .component-item-name {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
    }
    
    .component-type-label {
      font-size: 11px;
      background-color: #f1f5f9;
      color: #475569;
      padding: 2px 6px;
      border-radius: 10px;
    }
    
    .component-info {
      font-size: 13px;
    }
    
    .component-info p {
      margin: 4px 0;
    }
    
    /* Responsive adjustments */
    @media print {
      .component-report-container {
        gap: 10px;
      }
      
      .component-section {
        page-break-inside: avoid;
      }
      
      .component-category-section {
        page-break-inside: avoid;
      }
      
      .component-item-card {
        page-break-inside: avoid;
      }
    }
  `;

  return `
    ${componentReportBaseStyles}
    ${generateComponentStatusStyles()}
    ${generateComponentListStyles()}
    ${generateConditionBadgeStyles()}
    ${generateComponentDetailStyles()}
    ${generatePhotoStyles()}
    ${generateMaintenanceTasksStyles()}
  `;
};
