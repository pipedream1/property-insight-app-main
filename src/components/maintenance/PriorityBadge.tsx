
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let badgeClass = '';
  
  switch(priority) {
    case 'High':
      badgeClass = 'bg-red-100 text-red-800';
      break;
    case 'Medium':
      badgeClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Low':
      badgeClass = 'bg-blue-100 text-blue-800';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return <Badge className={badgeClass}>{priority}</Badge>;
};
