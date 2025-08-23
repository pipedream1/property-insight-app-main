
/**
 * Generates CSS styles for component status indicators
 */
export const generateComponentStatusStyles = (): string => {
  return `
    /* Component status indicators */
    .component-status {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .status-item {
      flex: 1;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
    }
    
    .status-good {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .status-fair {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .status-attention {
      background-color: #fee2e2;
      color: #b91c1c;
    }
  `;
};
