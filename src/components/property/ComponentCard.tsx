
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { ComponentStatus } from '@/types';
import { statusColors, capitalizeFirstLetter } from './utils/statusHelpers';

interface ComponentCardProps {
  id: string;
  name: string;
  items?: string[];
  icon: React.ReactNode;
  status: ComponentStatus;
  searchTerm: string;
  handleComponentSelect: (category: string, item?: string) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  id,
  name,
  items,
  icon,
  status,
  searchTerm,
  handleComponentSelect
}) => {
  // State for collapsible behavior for Roads and Circles
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if this component should use collapsible behavior
  const shouldUseCollapsible = (id === 'roads' || id === 'circles') && items && items.length > 0;
  
  // Filter items based on search term if there are any
  const filteredItems = items?.filter(item => 
    !searchTerm || item.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Don't render if there are items but none match the search term
  if (items && items.length > 0 && filteredItems?.length === 0) {
    return null;
  }

  const handleItemClick = (item?: string) => {
    console.log('ComponentCard: Handling click for', { category: id, item });
    handleComponentSelect(id, item);
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: statusColors[status || 'unknown'] }}>
      <CardHeader className="bg-primary-50 pb-3 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-primary">
                  {icon}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Category: {name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        
        {/* Status indicator */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: statusColors[status || 'unknown'] }}></div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Status: {capitalizeFirstLetter(status || 'Unknown')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-4">
        {shouldUseCollapsible ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline"
                className="w-full justify-between text-left hover:bg-primary-50 active:bg-primary-100 transition-colors mb-2"
              >
                <span>View {name} ({filteredItems?.length || 0})</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {filteredItems?.map((item, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left hover:bg-primary-50 active:bg-primary-100 transition-colors ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                >
                  {item}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : items && items.length > 0 ? (
          <div className="space-y-2">
            {filteredItems?.map((item, index) => (
              <Button 
                key={index}
                variant="outline"
                className="w-full justify-start text-left hover:bg-primary-50 active:bg-primary-100 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleItemClick(item);
                }}
              >
                {item}
              </Button>
            ))}
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full justify-start text-left hover:bg-primary-50 active:bg-primary-100 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleItemClick();
            }}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentCard;
