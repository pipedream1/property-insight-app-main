
import { Component } from '../types';

/**
 * Renders the components section of the report
 */
export const renderComponentsSection = (categorizedComponents: Record<string, Component[]>): string => {
  const categories = Object.keys(categorizedComponents);
  
  if (categories.length === 0) {
    return '<p class="text-muted">No components found for this report period.</p>';
  }

  return categories.map(category => {
    const components = categorizedComponents[category];
    
    return `
      <div class="component-category-section">
        <div class="component-category-header" onclick="toggleCollapsible(this)">
          <h4 class="component-category-title">${category}</h4>
          <div class="collapsible-icon">
            <span class="chevron-icon">▼</span>
          </div>
        </div>
        <div class="component-category-items" style="display: none;">
          ${components.map(component => renderComponentItem(component)).join('')}
        </div>
      </div>
    `;
  }).join('');
};

/**
 * Renders an individual component item
 */
const renderComponentItem = (component: Component): string => {
  const conditionClass = getConditionClass(component.condition);
  const lastInspectionDate = new Date(component.lastInspection).toLocaleDateString();
  
  // Process photos for display
  const photosHtml = renderComponentPhotos(component.photos || []);
  
  return `
    <div class="component-item-card">
      <div class="component-item-header">
        <div class="component-meta">
          <h5 class="component-item-name">${component.name}</h5>
          <span class="component-type-label">${component.condition}</span>
        </div>
        <span class="condition-badge ${conditionClass}">${component.condition}</span>
      </div>
      
      <div class="component-info">
        <p><strong>Last Inspection:</strong> ${lastInspectionDate}</p>
        ${component.comment ? `<p><strong>Notes:</strong> ${component.comment}</p>` : ''}
      </div>
      
      ${photosHtml}
    </div>
  `;
};

/**
 * Renders photos for a component with improved error handling and loading
 */
const renderComponentPhotos = (photos: string[]): string => {
  if (!photos || photos.length === 0) {
    return '';
  }

  // Show all photos, but with a reasonable layout limit
  const displayPhotos = photos.slice(0, 20); // Increased from 12 to 20
  const hasMorePhotos = photos.length > 20;

  console.log(`Rendering ${displayPhotos.length} photos for component (${hasMorePhotos ? `+${photos.length - 20} more` : 'all shown'})`);

  return `
    <div class="component-photos">
      <div class="photo-gallery-grid">
        ${displayPhotos.map((photo, index) => {
          // Ensure photo URL is properly formatted
          const photoUrl = photo.trim();
          if (!photoUrl) return '';
          
          return `
            <div class="photo-container">
              <img 
                src="${photoUrl}" 
                alt="Inspection photo ${index + 1}" 
                class="inspection-photo"
                onclick="enlargePhoto(this)"
                onload="console.log('Photo loaded: ${photoUrl.substring(0, 50)}...')"
                onerror="console.error('Failed to load photo: ${photoUrl}'); this.parentElement.style.display='none';"
                loading="lazy"
              />
            </div>
          `;
        }).join('')}
        
        ${hasMorePhotos ? `
          <div class="more-photos">
            +${photos.length - 20} more photos
          </div>
        ` : ''}
      </div>
      
      ${photos.length > 0 ? `
        <div class="photo-count-info">
          Total photos: ${photos.length}
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Gets the CSS class for a condition badge
 */
const getConditionClass = (condition: string): string => {
  const normalizedCondition = condition?.toLowerCase() || 'unknown';
  
  switch (normalizedCondition) {
    case 'excellent':
    case 'good':
      return 'condition-good';
    case 'fair':
      return 'condition-fair';
    case 'poor':
    case 'critical':
      return 'condition-poor';
    default:
      return 'condition-unknown';
  }
};
