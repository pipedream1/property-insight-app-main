
import { categories } from '@/components/property/categoryData';

/**
 * Helper function to get component type from name
 */
export function getComponentTypeFromName(name: string): string {
  // Return early if name is invalid
  if (!name || name.trim() === '' || name.toLowerCase() === 'unnamed') {
    console.warn(`Invalid component name provided: "${name}"`);
    return 'Unknown';
  }
  
  const lowerName = name.toLowerCase().trim();
  
  // First check for exact matches in category items
  for (const category of categories) {
    if (category.items && category.items.some(item => item.toLowerCase() === lowerName)) {
      return category.name;
    }
  }
  
  // Special case handling for components that don't match exactly by name
  
  // PRIORITY: Check for Sewage Works items first (expanded to catch more variations)
  if (lowerName.includes('sewage') || 
      lowerName.includes('sewageworks') ||
      lowerName.includes('sewage works') ||
      lowerName.includes('sewage plant') ||
      lowerName.includes('sewageplant') ||
      lowerName.includes('waste water') ||
      lowerName.includes('wastewater') ||
      lowerName.includes('treatment plant') ||
      lowerName.includes('treatment works') ||
      lowerName.includes('effluent') ||
      lowerName.includes('septic') ||
      lowerName.includes('sewer') ||
      lowerName.includes('oxidation') ||
      lowerName.includes('pond') ||
      lowerName.includes('algae') ||
      lowerName.includes('water treatment') ||
      lowerName.includes('bio') ||
      lowerName.includes('bioreactor') ||
      lowerName.includes('clarifier') ||
      lowerName.includes('settling') ||
      lowerName.includes('filtration') ||
      lowerName.includes('disinfection')) {
    return 'Sewage Works';
  }
  
  // Check for Pump Stations (also sewage-related)
  if (lowerName.includes('pump') && lowerName.includes('station')) {
    return 'Sewage Pump Stations';
  }
  
  // Check for Tennis Courts
  if (lowerName.includes('court') || lowerName.includes('tennis')) {
    return 'Tennis Courts';
  }
  
  // Check for Jetty Parking
  if (lowerName.includes('jetty') || lowerName.includes('parking lot') || lowerName.includes('parking')) {
    return 'Jetty Parking Lot';
  }
  
  // Check for Circles - must come before Roads check since circles often have road-like names
  if (lowerName.includes('circle')) {
    return 'Circles';
  }
  
  // Check for Mini Sub items
  if (lowerName.includes('sub') || lowerName.includes('substation') || lowerName.includes('electrical')) {
    return 'Mini Subs';
  }
  
  // Check for Bird Park items
  if (lowerName.includes('bird') && lowerName.includes('park')) {
    return 'Bird Park';
  }
  
  // Check for Railway Fire Break items
  if (lowerName.includes('railway') || lowerName.includes('fire break') || lowerName.includes('firebreak')) {
    return 'Railway Fire Break';
  }
  
  // Check for common road patterns (more specific checks)
  const roadPatterns = ['close', 'avenue', 'lane', 'road', 'walk', 'street', 'drive', 'way'];
  for (const pattern of roadPatterns) {
    if (lowerName.includes(pattern)) {
      return 'Roads';
    }
  }
  
  // Check for Green Belts items (only after checking sewage-related terms)
  if (lowerName.includes('greenbelt') || 
      lowerName.includes('green belt') || 
      lowerName.includes('verge') ||
      lowerName.includes('parkland') ||
      lowerName.includes('park land') ||
      lowerName.includes('vegetation') ||
      lowerName.includes('garden') ||
      lowerName.includes('lawn') ||
      lowerName.includes('grass') ||
      lowerName.includes('landscap') ||
      lowerName.includes('planting') ||
      lowerName.includes('shrub') ||
      lowerName.includes('tree') ||
      lowerName.includes('flower bed') ||
      lowerName.includes('flowerbed')) {
    return 'Green Belts & Verges';
  }
  
  // If we still can't categorize it, check if it might be a green belt/vegetation component
  // by looking for nature-related keywords (but exclude water-related terms that might be sewage)
  const greenKeywords = ['natural', 'native', 'indigenous', 'fynbos', 'bush', 'scrub', 'wetland', 'dune', 'coastal'];
  if (greenKeywords.some(keyword => lowerName.includes(keyword)) && 
      !lowerName.includes('water') && 
      !lowerName.includes('pond') && 
      !lowerName.includes('treatment')) {
    return 'Green Belts & Verges';
  }
  
  // If we truly can't categorize it, return "Unknown" instead of defaulting to Green Belts
  console.warn(`Could not categorize component: ${name}, marking as Unknown`);
  return 'Unknown';
}

/**
 * Helper function to capitalize all words in a string
 */
export function capitalizeWords(str: string): string {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Groups components by their parent category
 */
export function categorizeComponents(components: any[]): Record<string, any[]> {
  const categorizedComponents: Record<string, any[]> = {};
  
  // First, initialize all categories from our predefined list to ensure order is preserved
  categories.forEach(category => {
    categorizedComponents[category.name] = [];
  });
  
  // Add an "Unknown" category for components that can't be categorized
  categorizedComponents['Unknown'] = [];
  
  console.log('Categorizing components:', components.length, 'total components');
  
  // Process components and determine their categories
  components.forEach((component, index) => {
    console.log(`Processing component ${index + 1}:`, {
      name: component.name,
      component_type: component.component_type,
      condition: component.condition,
      lastInspection: component.lastInspection
    });
    
    // Skip components with invalid names (should already be filtered out, but double-check)
    if (!component.name || component.name.trim() === '' || component.name.toLowerCase() === 'unnamed') {
      console.warn(`Skipping component with invalid name: "${component.name}"`);
      return;
    }
    
    // Determine the component type - first try explicit type, then fall back to name-based detection
    let componentType: string;
    
    if (component.component_type && typeof component.component_type === 'string' && component.component_type.trim() !== '') {
      // Use the explicit component_type if available, but still validate it
      const explicitType = capitalizeWords(component.component_type);
      // For greenBelts specifically, map to the proper category name
      if (component.component_type.toLowerCase() === 'greenbelts') {
        componentType = 'Green Belts & Verges';
      } else {
        // Check if this explicit type needs remapping
        componentType = getComponentTypeFromName(component.name) || explicitType;
      }
    } else {
      // Fall back to detecting type from name
      componentType = getComponentTypeFromName(component.name);
    }
    
    console.log(`Component "${component.name}" categorized as: "${componentType}"`);
    
    // Ensure the category exists in our map
    if (!categorizedComponents[componentType]) {
      console.log(`Creating new category: "${componentType}"`);
      categorizedComponents[componentType] = [];
    }
    
    // Add this component to its category with a unique identifier to avoid duplicates
    const componentWithId = {
      ...component,
      // Store the determined component_type back in the component
      component_type: componentType,
      // Add a unique identifier combining name and inspection date
      uniqueId: `${component.name}_${component.lastInspection}`
    };
    
    categorizedComponents[componentType].push(componentWithId);
  });
  
  // Log the final categorization results
  Object.entries(categorizedComponents).forEach(([category, items]) => {
    if (items.length > 0) {
      console.log(`Category "${category}": ${items.length} components`);
    }
  });
  
  // Filter out empty categories
  return Object.fromEntries(
    Object.entries(categorizedComponents).filter(([_, items]) => items.length > 0)
  );
}
