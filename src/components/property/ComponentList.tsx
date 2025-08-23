
import React, { useState, useEffect } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { ComponentStatus } from '@/types';
import ComponentSearchBar from './ComponentSearchBar';
import ComponentGroup from './ComponentGroup';
import { categoryIcons, getDefaultIcon } from './utils/categoryIcons';
import { categoryGroups, getCategoryGroup } from './utils/categoryGroups';
import { getComponentStatus } from './utils/statusHelpers';
import { ComponentCategory } from './categoryData';

interface ComponentListProps {
  categories: ComponentCategory[];
  handleComponentSelect: (category: string, item?: string) => void;
  recentInspections?: any[];
}

const ComponentList: React.FC<ComponentListProps> = ({ 
  categories, 
  handleComponentSelect,
  recentInspections
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComponentStatus | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  
  // Group categories
  const groupedCategories: Record<string, any[]> = {};
  
  // Initialize groups
  Object.keys(categoryGroups).forEach(group => {
    groupedCategories[group] = [];
  });
  
  // Place categories in their groups with icons and statuses
  categories.forEach(category => {
    // Find which group this category belongs to
    const group = getCategoryGroup(category.id);
    
    // Initialize the group if it doesn't exist
    if (!groupedCategories[group]) {
      groupedCategories[group] = [];
    }
    
    // Get component status
    const status = getComponentStatus(category.id, recentInspections);
    
    // Add icon to category
    const enrichedCategory = {
      ...category,
      icon: categoryIcons[category.id] || getDefaultIcon(),
      group,
      status
    };
    
    groupedCategories[group].push(enrichedCategory);
  });

  // Check if there are any results after filtering by search term and status
  const hasResults = Object.values(groupedCategories).some(group => 
    group.some(category => {
      // Filter by status first if a status filter is applied
      if (statusFilter && category.status !== statusFilter) {
        return false;
      }
      
      // Then filter by search term if one exists
      return (
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        category.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
  );

  // Load saved accordion state on component mount
  useEffect(() => {
    try {
      const savedGroups = localStorage.getItem('component-open-groups');
      if (savedGroups) {
        setOpenGroups(JSON.parse(savedGroups));
      } else {
        // Default state: open all groups except Infrastructure
        const defaultOpenGroups = Object.keys(categoryGroups).filter(group => group !== 'Infrastructure');
        setOpenGroups(defaultOpenGroups);
      }
    } catch (e) {
      console.error('Error loading accordion state:', e);
      // Fallback: open all groups except Infrastructure
      const defaultOpenGroups = Object.keys(categoryGroups).filter(group => group !== 'Infrastructure');
      setOpenGroups(defaultOpenGroups);
    }
  }, []);

  // Save accordion state when it changes
  const handleValueChange = (value: string[]) => {
    setOpenGroups(value);
    try {
      localStorage.setItem('component-open-groups', JSON.stringify(value));
    } catch (e) {
      console.error('Error saving accordion state:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar with status filters */}
      <ComponentSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {/* Display component groups as accordions */}
      <Accordion 
        type="multiple" 
        value={openGroups} 
        onValueChange={handleValueChange}
      >
        {Object.entries(groupedCategories).map(([group, groupCategories]) => (
          <ComponentGroup
            key={group}
            group={group}
            categories={groupCategories}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            handleComponentSelect={handleComponentSelect}
          />
        ))}
      </Accordion>
      
      {/* Show message when no results found */}
      {(searchTerm || statusFilter) && !hasResults && (
        <div className="text-center py-8 text-muted-foreground">
          No components match your filters
        </div>
      )}
    </div>
  );
};

export default ComponentList;
