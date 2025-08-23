
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ComponentStatus } from '@/types';
import { categories } from '@/components/property/categoryData';

export const usePropertyComponents = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [isLoadingInspections, setIsLoadingInspections] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<{id: string, name: string}[]>([]);
  const [componentStatuses, setComponentStatuses] = useState<Record<string, ComponentStatus>>({});

  // Use params to set the selected component when the component mounts or updates
  useEffect(() => {
    console.log('usePropertyComponents: Processing params:', params);
    
    if (params.category) {
      let componentKey = params.category;
      if (params.item) {
        componentKey = `${params.category}-${params.item.replace(/-/g, ' ')}`;
      }
      
      console.log('usePropertyComponents: Setting selected component to:', componentKey);
      setSelectedComponent(componentKey);
      
      // Fetch recent inspections for this component
      fetchRecentInspections(params.category, params.item);
      
      // Update recently viewed components
      const componentName = params.item ? 
        params.item.replace(/-/g, ' ') : 
        getComponentName(params.category);
        
      updateRecentlyViewed({
        id: `${params.category}${params.item ? `-${params.item}` : ''}`,
        name: componentName
      });
    } else {
      // Clear selected component when no params
      console.log('usePropertyComponents: No params, clearing selected component');
      setSelectedComponent(null);
      setRecentInspections([]);
    }
  }, [params.category, params.item]);

  // Load recently viewed components from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentlyViewedComponents');
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recently viewed components', e);
    }
  }, []);

  // Load component statuses on initial load
  useEffect(() => {
    fetchAllComponentStatuses();
  }, []);

  const getComponentName = (categoryId: string): string => {
    // Find the category data to get the proper display name
    const categoryData = categories.find(cat => cat.id === categoryId);
    return categoryData ? categoryData.name : categoryId;
  };

  const updateRecentlyViewed = (component: {id: string, name: string}) => {
    setRecentlyViewed(prev => {
      // Remove if exists and add to front
      const filtered = prev.filter(c => c.id !== component.id);
      const updated = [component, ...filtered].slice(0, 5);
      
      // Save to localStorage
      try {
        localStorage.setItem('recentlyViewedComponents', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recently viewed components', e);
      }
      
      return updated;
    });
  };

  // Fetch status for all components
  const fetchAllComponentStatuses = async () => {
    try {
      // Group inspections by component type and get their latest inspection
      const { data, error } = await supabase
        .from('property_components')
        .select('component_type, condition')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching component statuses:', error);
        return;
      }
      
      // Process the data to get the latest status for each component
      const statuses: Record<string, ComponentStatus> = {};
      
      data?.forEach(item => {
        if (item.component_type && item.condition && !statuses[item.component_type]) {
          // Map the condition string to our ComponentStatus type
          let status: ComponentStatus = 'unknown';
          
          if (item.condition.toLowerCase().includes('good')) status = 'good';
          else if (item.condition.toLowerCase().includes('fair')) status = 'fair';
          else if (item.condition.toLowerCase().includes('poor')) status = 'poor';
          
          statuses[item.component_type] = status;
        }
      });
      
      setComponentStatuses(statuses);
    } catch (error) {
      console.error('Error processing component statuses:', error);
    }
  };

  const fetchRecentInspections = async (category: string | undefined, item: string | undefined) => {
    if (!category) return;
    
    console.log('usePropertyComponents: Fetching inspections for:', { category, item });
    setIsLoadingInspections(true);
    try {
      const query = supabase
        .from('property_components')
        .select('*')
        .eq('component_type', category);
        
      if (item) {
        query.eq('component_name', item.replace(/-/g, ' '));
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(5);
      
      if (error) {
        console.error('Error fetching inspections:', error);
      } else {
        console.log('usePropertyComponents: Fetched inspections:', data);
        setRecentInspections(data || []);
      }
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setIsLoadingInspections(false);
    }
  };

  const handleComponentSelect = (category: string, item?: string) => {
    console.log('usePropertyComponents: Navigation triggered', { category, item });
    
    try {
      if (item) {
        const itemSlug = item.replace(/\s+/g, '-').toLowerCase();
        console.log('Navigating to:', `/property-components/${category}/${itemSlug}`);
        navigate(`/property-components/${category}/${itemSlug}`);
      } else {
        console.log('Navigating to:', `/property-components/${category}`);
        navigate(`/property-components/${category}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return {
    selectedComponent,
    recentInspections,
    isLoadingInspections,
    recentlyViewed,
    componentStatuses,
    handleComponentSelect,
    fetchRecentInspections
  };
};
