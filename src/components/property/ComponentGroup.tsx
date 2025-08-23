
import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import ComponentCard from './ComponentCard';
import { ComponentStatus } from '@/types';

interface ComponentGroupProps {
  group: string;
  categories: {
    id: string;
    name: string;
    items?: string[];
    icon: React.ReactNode;
    status: ComponentStatus;
  }[];
  searchTerm: string;
  statusFilter: ComponentStatus | null;
  handleComponentSelect: (category: string, item?: string) => void;
}

const ComponentGroup: React.FC<ComponentGroupProps> = ({
  group,
  categories,
  searchTerm,
  statusFilter,
  handleComponentSelect
}) => {
  // Filter categories that match both search term and status filter
  const filteredCategories = categories.filter(category => {
    // Filter by status first if a status filter is applied
    if (statusFilter && category.status !== statusFilter) {
      return false;
    }
    
    // Then filter by search term if one exists
    if (!searchTerm) return true;
    
    // Check if category name matches search
    const nameMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if any items match search
    const itemsMatch = category.items?.some(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ) || false;
    
    return nameMatch || itemsMatch;
  });

  // Don't render the group if nothing matches the filters
  if (filteredCategories.length === 0) {
    return null;
  }

  return (
    <AccordionItem value={group}>
      <AccordionTrigger className="text-lg font-medium">
        {group}
      </AccordionTrigger>
      <AccordionContent>
        {group === 'Infrastructure' ? (
          <div className="space-y-4">
            {/* Top row: BHOA Offices, BHOA Cottage, Jetty Parking Lot */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories
                .filter(cat => ['bhoaOffices', 'bhoaCottage', 'jettyParkingLot'].includes(cat.id))
                .map((category) => (
                  <ComponentCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    items={category.items}
                    icon={category.icon}
                    status={category.status}
                    searchTerm={searchTerm}
                    handleComponentSelect={handleComponentSelect}
                  />
                ))}
            </div>
            {/* Bottom row: Roads and Circles */}
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {filteredCategories
                .filter(cat => ['roads', 'circles'].includes(cat.id))
                .map((category) => (
                  <ComponentCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    items={category.items}
                    icon={category.icon}
                    status={category.status}
                    searchTerm={searchTerm}
                    handleComponentSelect={handleComponentSelect}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <ComponentCard
                key={category.id}
                id={category.id}
                name={category.name}
                items={category.items}
                icon={category.icon}
                status={category.status}
                searchTerm={searchTerm}
                handleComponentSelect={handleComponentSelect}
              />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default ComponentGroup;
