
import React from 'react';

interface QuickNavigationProps {
  recentlyViewed: {id: string, name: string}[];
  onNavigate: (category: string, item?: string) => void;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ 
  recentlyViewed, 
  onNavigate 
}) => {
  if (!recentlyViewed.length) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Access</h3>
      <div className="flex flex-wrap gap-2">
        {recentlyViewed.map(component => {
          const [category, ...itemParts] = component.id.split('-');
          const item = itemParts.join('-');
          
          return (
            <button 
              key={component.id}
              onClick={() => {
                if (item) {
                  onNavigate(category, item);
                } else {
                  onNavigate(category);
                }
              }}
              className="px-3 py-1.5 bg-muted text-sm rounded-full hover:bg-muted/80 transition-colors"
            >
              {component.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickNavigation;
