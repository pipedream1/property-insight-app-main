
/**
 * Generates CSS styles for component details sections
 */
export const generateComponentDetailStyles = (): string => {
  return `
    /* Component details styles */
    .component-details {
      margin-top: 10px;
      font-size: 14px;
      color: #6b7280;
    }
    
    .component-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    
    .component-info {
      flex: 1;
    }
    
    .component-thumbnails {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .thumbnail-container {
      position: relative;
    }
    
    .thumbnail {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    
    .more-photos {
      font-size: 12px;
      color: #6b7280;
      align-self: center;
    }
    
    .component-comment {
      margin-top: 10px;
      padding: 10px;
      background-color: #f3f4f6;
      border-radius: 4px;
      font-size: 14px;
      font-style: italic;
    }
    
    /* Location map is now smaller and opened on demand */
    .location-info {
      display: none;
      margin-top: 5px;
    }
    
    .thumbnail-container:hover .location-info {
      display: block;
      position: absolute;
      z-index: 10;
      background: white;
      padding: 5px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 180px;
    }
    
    .static-map {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
    
    .map-caption {
      display: block;
      font-size: 11px;
      text-align: center;
      margin-top: 3px;
      color: #4b5563;
    }
    
    /* Component category section styles */
    .component-category-section {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }
    
    .component-category-header {
      background-color: #f8fafc;
      padding: 14px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    
    .component-category-header:hover {
      background-color: #f1f5f9;
    }
    
    .component-category-header.active {
      background-color: #e0f2fe;
      border-bottom-color: #0891b2;
    }
    
    .component-category-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
    }
    
    .collapsible-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    
    .chevron-icon {
      color: #64748b;
      font-size: 12px;
      transition: transform 0.2s ease;
      display: inline-block;
    }
    
    .component-category-header.active .chevron-icon {
      transform: rotate(180deg);
    }
    
    .component-category-items {
      padding: 0;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .component-category-items[style*="block"] {
      padding: 20px;
    }
    
    .component-item-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
      background-color: #fefefe;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .component-item-card:last-child {
      margin-bottom: 0;
    }
    
    .component-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .component-meta {
      flex: 1;
    }
    
    .component-item-name {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }
    
    .component-type-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Print styles */
    @media print {
      .component-category-items {
        display: block !important;
        padding: 20px !important;
      }
      
      .collapsible-icon {
        display: none;
      }
      
      .component-category-header {
        cursor: default;
        background-color: #f8fafc !important;
      }
    }
  `;
};
