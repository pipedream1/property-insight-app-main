
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

export type ComponentStatusFilter = 'good' | 'fair' | 'poor' | 'unknown' | null;

interface ComponentStatusFilterProps {
  statusFilter: ComponentStatusFilter;
  setStatusFilter: (status: ComponentStatusFilter) => void;
}

const ComponentStatusFilter: React.FC<ComponentStatusFilterProps> = ({
  statusFilter,
  setStatusFilter
}) => {
  // Status filter options with display names and colors
  const statusOptions: {value: ComponentStatusFilter, label: string, color: string}[] = [
    { value: 'good', label: 'Good', color: '#F2FCE2' },
    { value: 'fair', label: 'Fair', color: '#FEF7CD' },
    { value: 'poor', label: 'Poor', color: '#FEC6A1' },
    { value: 'unknown', label: 'Unknown', color: '#F1F0FB' }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-muted-foreground">Filter by status:</div>
      <div className="flex gap-2">
        <ToggleGroup 
          type="single" 
          value={statusFilter || undefined} 
          onValueChange={(value) => setStatusFilter(value as ComponentStatusFilter || null)}
        >
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
  );
};

export default ComponentStatusFilter;
