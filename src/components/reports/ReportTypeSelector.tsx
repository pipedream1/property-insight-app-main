
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportTypeSelectorProps {
  useCustomDates: boolean;
  setUseCustomDates: (useCustomDates: boolean) => void;
}

export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  useCustomDates,
  setUseCustomDates
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className={cn(
          "mb-2",
          !useCustomDates ? "bg-primary/10" : "bg-transparent"
        )}
        onClick={() => setUseCustomDates(false)}
      >
        Month/Year
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className={cn(
          "mb-2",
          useCustomDates ? "bg-primary/10" : "bg-transparent"
        )}
        onClick={() => setUseCustomDates(true)}
      >
        Custom Date Range
      </Button>
    </div>
  );
};
