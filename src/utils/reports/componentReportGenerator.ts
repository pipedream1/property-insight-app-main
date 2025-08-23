
import { supabase } from "@/integrations/supabase/client";
import { ComponentCondition } from "@/types";
import { getImageMetadata } from '@/utils/storage/extractMetadata';

/**
 * Generates data for a component report using real data from the database
 */
export const generateComponentReportData = async (selectedMonth: string, selectedYear: string, selectedComponent?: string) => {
  try {
    // Build the query to fetch component data
    let query = supabase
      .from('property_components')
      .select('*')
      .order('created_at', { ascending: true });
    
    // Filter by component type if specified
    if (selectedComponent && selectedComponent !== 'all') {
      query = query.eq('component_type', selectedComponent);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching component data:', error);
      throw new Error('Failed to fetch component data');
    }
    
    console.log(`Fetched ${data?.length || 0} total components from database`);
    
    // Ensure data is not null and is an array
    const components = Array.isArray(data) ? data : [];
    
    // Be more lenient with component filtering - only filter out truly empty/null names
    const validComponents = components.filter(component => {
      const hasValidName = component.component_name && 
                          typeof component.component_name === 'string' &&
                          component.component_name.trim().length > 0;
      
      if (!hasValidName) {
        console.warn(`Filtering out component with invalid name: "${component.component_name}" (ID: ${component.id})`);
      }
      
      return hasValidName;
    });
    
    console.log(`After filtering invalid names: ${validComponents.length} valid components`);
    
    // Process the valid data for the report
    const processedComponents = validComponents.map(component => {
      // Parse photo URLs from JSON string if available
      let photoUrls: string[] = [];
      if (component.photo_url) {
        try {
          if (typeof component.photo_url === 'string') {
            try {
              const parsed = JSON.parse(component.photo_url);
              if (Array.isArray(parsed)) {
                photoUrls = parsed.filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
              } else if (typeof parsed === 'string' && parsed.trim() !== '') {
                photoUrls = [parsed];
              }
            } catch (parseError) {
              // If JSON parsing fails, treat as single URL string
              if (component.photo_url.trim() !== '') {
                photoUrls = [component.photo_url];
              }
            }
          } else if (Array.isArray(component.photo_url)) {
            photoUrls = (component.photo_url as string[]).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          }
        } catch (e) {
          console.warn(`Error parsing photos for component ${component.component_name}:`, e);
          photoUrls = [];
        }
      }
      
      console.log(`Component "${component.component_name}" has ${photoUrls.length} photos:`, photoUrls);
      
      // Get metadata for each photo
      const photosWithMetadata = photoUrls.map(url => {
        const metadata = getImageMetadata(url);
        return {
          url,
          hasLocation: !!(metadata?.location?.latitude && metadata?.location?.longitude),
          location: metadata?.location,
          timestamp: metadata?.timestamp
        };
      });
      
      // Preserve full timestamp for inspection date
      const inspectionDateTime = new Date(component.created_at).toISOString();
      
      return {
        name: component.component_name,
        condition: component.condition || 'Unknown',
        lastInspection: inspectionDateTime,
        photos: photoUrls,
        photosWithMetadata: photosWithMetadata,
        comment: component.comment || '',
        component_type: component.component_type
      };
    });
    
    console.log(`Processed ${processedComponents.length} components for report`);
    
    // Calculate status counts from valid components only
    const statusCounts = {
      good: validComponents.filter((c: any) => 
        c.condition === ComponentCondition.EXCELLENT || 
        c.condition === ComponentCondition.GOOD
      ).length,
      fair: validComponents.filter((c: any) => c.condition === ComponentCondition.FAIR).length,
      needsAttention: validComponents.filter((c: any) => 
        c.condition === ComponentCondition.POOR || 
        c.condition === ComponentCondition.CRITICAL
      ).length
    };
    
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: `Component status report for ${selectedMonth} ${selectedYear}`,
      componentType: selectedComponent || 'all',
      status: {
        good: statusCounts.good || 0,
        fair: statusCounts.fair || 0,
        needsAttention: statusCounts.needsAttention || 0
      },
      components: processedComponents
    };
    
    console.log('Final report data:', {
      totalComponents: reportData.components.length,
      statusCounts: reportData.status,
      componentTypes: [...new Set(reportData.components.map(c => c.component_type))],
      totalPhotos: reportData.components.reduce((total, comp) => total + comp.photos.length, 0)
    });
    
    return reportData;
  } catch (error) {
    console.error('Error generating component report data:', error);
    // Return a more informative empty data structure
    return {
      generatedAt: new Date().toISOString(),
      summary: `Component status report for ${selectedMonth} ${selectedYear} (Error: ${error instanceof Error ? error.message : 'Unknown error'})`,
      componentType: selectedComponent || 'all',
      status: {
        good: 0,
        fair: 0,
        needsAttention: 0
      },
      components: []
    };
  }
};
