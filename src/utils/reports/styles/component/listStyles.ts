
/**
 * Generates CSS styles for component list views
 */
export const generateComponentListStyles = (): string => {
  return `
    /* Component list styles */
    .component-list {
      margin-top: 20px;
    }
    
    .component-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .component-name {
      font-weight: 600;
      font-size: 16px;
    }
  `;
};
