
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { categories } from './categoryData';

const PropertyBreadcrumbs = () => {
  // Get current path to determine breadcrumbs
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  console.log('PropertyBreadcrumbs: Path segments:', segments);
  
  // Extract category and item from URL if they exist
  const category = segments[1] || null;
  const item = segments[2] || null;
  
  // Find the category data to get the proper display name
  const categoryData = categories.find(cat => cat.id === category);
  const categoryDisplayName = categoryData ? categoryData.name : (category ? category.charAt(0).toUpperCase() + category.slice(1) : '');
  
  console.log('PropertyBreadcrumbs: Category data:', { category, item, categoryData, categoryDisplayName });
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/property-components">
                Property Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          </>
        )}
        
        {category && !item && (
          <BreadcrumbItem>
            <BreadcrumbLink className="font-medium">
              {categoryDisplayName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        
        {category && item && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/property-components/${category}`}>
                {categoryDisplayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium">
                {item.replace(/-/g, ' ')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PropertyBreadcrumbs;
