
import React from 'react';
import { Loader2 } from 'lucide-react';

export const TableLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading maintenance tasks...</p>
      </div>
    </div>
  );
};
