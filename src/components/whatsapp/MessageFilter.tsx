
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

type MessageFilterProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  direction: string;
  onDirectionChange: (direction: string) => void;
};

export default function MessageFilter({
  searchTerm,
  onSearchChange,
  direction,
  onDirectionChange
}: MessageFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search messages..."
          className="pl-9"
        />
      </div>
      <Select value={direction} onValueChange={onDirectionChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Messages</SelectItem>
          <SelectItem value="inbound">Inbound Only</SelectItem>
          <SelectItem value="outbound">Outbound Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
