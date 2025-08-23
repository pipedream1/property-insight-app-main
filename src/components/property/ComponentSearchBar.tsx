
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { ComponentStatus } from '@/types';
import { statusColors } from './utils/statusHelpers';

interface ComponentSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: ComponentStatus | null;
  setStatusFilter: (status: ComponentStatus | null) => void;
}

const ComponentSearchBar: React.FC<ComponentSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  // Status filter options with display names and colors
  const statusOptions: {value: ComponentStatus, label: string, color: string}[] = [
    { value: 'good', label: 'Good', color: '#F2FCE2' },
    { value: 'fair', label: 'Fair', color: '#FEF7CD' },
    { value: 'poor', label: 'Poor', color: '#FEC6A1' },
    { value: 'unknown', label: 'Unknown', color: '#F1F0FB' }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components..."
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">Filter by status:</div>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value as ComponentStatus || null)}>
            {statusOptions.map(option => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value}
                className="px-3 py-1 text-xs rounded-full border"
                style={{ 
                  backgroundColor: statusFilter === option.value ? '#9b87f5' : option.color,
                  color: statusFilter === option.value ? 'white' : '#8E9196',
                  borderColor: 'transparent'
                }}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          {statusFilter && (
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-transparent border-dashed hover:bg-muted"
              onClick={() => setStatusFilter(null)}
            >
              Clear
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSearchBar;
