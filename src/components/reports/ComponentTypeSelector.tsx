
import React from 'react';
import { categories } from '@/components/property/categoryData';

interface ComponentTypeSelectorProps {
  selectedComponent: string;
  setSelectedComponent: (component: string) => void;
}

export const ComponentTypeSelector: React.FC<ComponentTypeSelectorProps> = ({
  selectedComponent,
  setSelectedComponent
}) => {
  return (
    <select 
      className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-base"
      value={selectedComponent}
      onChange={(e) => setSelectedComponent(e.target.value)}
    >
      <option value="all">All Components</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
      <option value="other">Other Components</option>
    </select>
  );
};
