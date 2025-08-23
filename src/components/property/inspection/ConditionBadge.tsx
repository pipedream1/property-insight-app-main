
import React from 'react';
import { cn } from "@/lib/utils";

interface ConditionBadgeProps {
  condition: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition }) => {
  const getConditionClass = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('excellent') || lowerCondition.includes('good')) {
      return 'text-green-600 bg-green-50 border-green-100';
    } else if (lowerCondition.includes('fair')) {
      return 'text-amber-600 bg-amber-50 border-amber-100';
    } else {
      return 'text-red-600 bg-red-50 border-red-100';
    }
  };

  return (
    <span className={cn(
      "inline-flex px-2 py-1 text-xs font-medium rounded-full",
      getConditionClass(condition)
    )}>
      {condition}
    </span>
  );
};
