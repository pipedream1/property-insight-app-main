
/**
 * Generates CSS styles for component condition badges
 */
export const generateConditionBadgeStyles = (): string => {
  return `
    /* Component condition badges */
    .condition-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .condition-excellent {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .condition-good {
      background-color: #e0f2fe;
      color: #0369a1;
    }
    
    .condition-fair {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .condition-poor {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .condition-critical {
      background-color: #7f1d1d;
      color: #ffffff;
    }
  `;
};
