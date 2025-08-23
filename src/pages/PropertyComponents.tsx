
import React, { useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import ComponentList from '@/components/property/ComponentList';
import ComponentDetail from '@/components/property/ComponentDetail';
import { categories } from '@/components/property/categoryData';
import PropertyBreadcrumbs from '@/components/property/PropertyBreadcrumbs';
import { usePropertyComponents } from '@/hooks/usePropertyComponents';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '@/components/ui/back-button';

const PropertyComponentsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    selectedComponent,
    recentInspections,
    isLoadingInspections,
    handleComponentSelect,
    fetchRecentInspections
  } = usePropertyComponents();

  // Debug logging to help troubleshoot routing issues
  useEffect(() => {
    console.log('PropertyComponents: Current params:', params);
    console.log('PropertyComponents: Selected component:', selectedComponent);
    console.log('PropertyComponents: Available categories:', categories.map(c => c.id));
    console.log('PropertyComponents: Current path:', window.location.pathname);
  }, [params, selectedComponent]);

  // Handle navigation when no params are present (back to main list)
  useEffect(() => {
    if (!params.category && !params.item && selectedComponent) {
      console.log('PropertyComponents: Clearing selected component');
      // Clear the selected component when navigating back to main list without reloading
      // This is handled by the usePropertyComponents hook
    }
  }, [params.category, params.item, selectedComponent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <BackButton />
        </div>
        
        <PropertyBreadcrumbs />
        
        {!selectedComponent && (
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-2xl font-bold">Property Components</h1>
          </div>
        )}
        
        {selectedComponent ? (
          <ComponentDetail
            selectedComponent={selectedComponent}
            recentInspections={recentInspections}
            isLoadingInspections={isLoadingInspections}
            onInspectionSaved={() => {
              console.log('PropertyComponents: Inspection saved, refreshing data');
              const pathSegments = window.location.pathname.split('/').filter(Boolean);
              const category = pathSegments[1];
              const item = pathSegments[2];
              if (category) {
                fetchRecentInspections(category, item);
              }
            }}
          />
        ) : (
          <ComponentList 
            categories={categories} 
            handleComponentSelect={handleComponentSelect}
            recentInspections={recentInspections}
          />
        )}
      </main>
    </div>
  );
};

export default PropertyComponentsPage;
