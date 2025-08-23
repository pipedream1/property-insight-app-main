
export const generatePhotoStyles = (): string => {
  return `
    .component-photos {
      margin-top: 12px;
      padding-bottom: 8px;
      border-top: 1px solid #f0f0f0;
      padding-top: 8px;
    }
    
    .photo-gallery-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: 100%;
      margin-bottom: 8px;
    }
    
    .photo-container {
      position: relative;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      background: #f8f9fa;
      flex-shrink: 0;
    }
    
    .inspection-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      display: block;
    }
    
    .inspection-photo:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
    
    .inspection-photo.enlarged {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
      z-index: 1000;
      width: auto;
      height: auto;
      max-width: 85vw;
      max-height: 85vh;
      object-fit: contain;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.7);
      border: 2px solid #ffffff;
    }
    
    .photo-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 999;
      backdrop-filter: blur(4px);
      cursor: pointer;
    }
    
    .photo-close-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(51, 51, 51, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      z-index: 1001;
      transition: background-color 0.2s;
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .photo-close-button:hover {
      background: rgba(102, 102, 102, 0.9);
    }
    
    .more-photos {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #666;
      background: #f1f5f9;
      padding: 4px 6px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      min-width: 50px;
      height: 50px;
      text-align: center;
      flex-shrink: 0;
    }
    
    .photo-count-info {
      font-size: 11px;
      color: #666;
      text-align: left;
      margin-top: 4px;
      font-style: italic;
    }
    
    /* Improved layout for many photos */
    .component-photos .photo-gallery-grid {
      max-height: none; /* Allow full height for all photos */
    }
    
    /* Compact layout for reports with many photos */
    @media screen and (max-width: 768px) {
      .photo-container {
        width: 45px;
        height: 45px;
      }
      
      .photo-gallery-grid {
        gap: 4px;
      }
      
      .inspection-photo.enlarged {
        max-width: 95vw;
        max-height: 95vh;
        padding: 10px;
      }
      
      .more-photos {
        min-width: 45px;
        height: 45px;
        font-size: 9px;
      }
    }
    
    /* Print styles for reports */
    @media print {
      .photo-container {
        width: 35px;
        height: 35px;
        break-inside: avoid;
      }
      
      .photo-gallery-grid {
        gap: 3px;
      }
      
      .component-photos {
        margin-top: 6px;
        padding-bottom: 4px;
        page-break-inside: avoid;
      }
      
      .inspection-photo.enlarged {
        position: static !important;
        transform: none !important;
        max-width: 100% !important;
        max-height: none !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
      }
      
      .photo-overlay,
      .photo-close-button {
        display: none !important;
      }
      
      .more-photos {
        min-width: 35px;
        height: 35px;
        font-size: 8px;
      }
    }
  `;
};
