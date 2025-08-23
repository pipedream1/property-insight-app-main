
import { ComponentReportData } from './types';
import { fetchMaintenanceTasks } from './component/maintenanceTasksHelper';
import { categorizeComponents } from './component/componentCategorization';
import { renderMaintenanceTasksSection } from './component/maintenanceTasksRenderer';
import { renderComponentsSection } from './component/componentsRenderer';
import { renderStatsSection } from './component/statsRenderer';

/**
 * Generates HTML content for a component report
 */
export const renderComponentReport = async (
  month: string, 
  year: string, 
  data: ComponentReportData
): Promise<string> => {
  console.log('Rendering component report with data:', data);
  
  // Extract all component names AND types for maintenance task lookup
  const componentNames = data.components.map(comp => comp.name).filter(Boolean);
  const componentTypes = [...new Set(data.components.map(comp => comp.component_type).filter(Boolean))];
  
  // Combine both component names and types for comprehensive search
  const searchTerms = [...componentNames, ...componentTypes];
  console.log('Component search terms for maintenance lookup:', searchTerms);
  
  // Fetch maintenance tasks for the components
  const maintenanceTasks = await fetchMaintenanceTasks(searchTerms);
  console.log('Retrieved maintenance tasks:', maintenanceTasks);
  
  // Group components by their parent category
  const categorizedComponents = categorizeComponents(data.components);

  // Generate each section of the report
  const statsSection = renderStatsSection(data);
  const maintenanceTasksSection = renderMaintenanceTasksSection(maintenanceTasks);
  const componentsSection = renderComponentsSection(categorizedComponents);

  return `
    <div class="report-section">
      <h2>Component Status Report</h2>
      <p>Reporting period: ${month} ${year}</p>
      <p>Component type: ${data.componentType === 'all' ? 'All Components' : data.componentType}</p>
      
      ${statsSection}
      
      ${maintenanceTasksSection}
      
      <h3>Component Details</h3>
      
      <div class="components-list">
        ${componentsSection}
      </div>
      
      <script>
        // Function to toggle collapsible sections
        function toggleCollapsible(element) {
          // Toggle active class on the trigger
          element.classList.toggle('active');
          
          // Find the content element (next sibling)
          const content = element.nextElementSibling;
          
          // Toggle display of content
          if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        }
        
        // Function to enlarge photo
        function enlargePhoto(element) {
          // Remove any existing enlarged photos first
          closeEnlargedPhoto();
          
          // Create overlay
          const overlay = document.createElement('div');
          overlay.className = 'photo-overlay';
          overlay.setAttribute('data-photo-overlay', 'true');
          
          // Create close button
          const closeButton = document.createElement('button');
          closeButton.className = 'photo-close-button';
          closeButton.innerHTML = '×';
          closeButton.setAttribute('data-photo-close', 'true');
          
          // Clone the image and make it enlarged
          const enlargedImage = element.cloneNode(true);
          enlargedImage.classList.add('enlarged');
          enlargedImage.setAttribute('data-enlarged-photo', 'true');
          
          // Add elements to document
          document.body.appendChild(overlay);
          document.body.appendChild(closeButton);
          document.body.appendChild(enlargedImage);
          
          // Add event listeners
          overlay.addEventListener('click', closeEnlargedPhoto);
          closeButton.addEventListener('click', closeEnlargedPhoto);
          enlargedImage.addEventListener('click', function(e) {
            e.stopPropagation();
          });
        }
        
        // Function to close enlarged photo
        function closeEnlargedPhoto() {
          // Remove overlay
          const overlay = document.querySelector('[data-photo-overlay]');
          if (overlay) {
            overlay.remove();
          }
          
          // Remove close button
          const closeButton = document.querySelector('[data-photo-close]');
          if (closeButton) {
            closeButton.remove();
          }
          
          // Remove enlarged photo
          const enlargedPhoto = document.querySelector('[data-enlarged-photo]');
          if (enlargedPhoto) {
            enlargedPhoto.remove();
          }
        }
        
        // Add event listener for Escape key
        document.addEventListener('keydown', function(event) {
          if (event.key === 'Escape') {
            closeEnlargedPhoto();
          }
        });
        
        // Prevent body scrolling when photo is enlarged
        document.addEventListener('DOMNodeInserted', function(event) {
          if (event.target.classList && event.target.classList.contains('photo-overlay')) {
            document.body.style.overflow = 'hidden';
          }
        });
        
        document.addEventListener('DOMNodeRemoved', function(event) {
          if (event.target.classList && event.target.classList.contains('photo-overlay')) {
            document.body.style.overflow = 'auto';
          }
        });
      </script>
    </div>
  `;
};
