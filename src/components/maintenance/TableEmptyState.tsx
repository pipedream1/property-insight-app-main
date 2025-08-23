
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableEmptyStateProps {
  showCompleted: boolean;
  refreshTasks?: () => void;
  isError?: boolean;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({ 
  showCompleted, 
  refreshTasks, 
  isError = false 
}) => {
  if (isError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="py-6">
          <div className="flex flex-col items-center text-center">
            <svg 
              className="h-8 w-8 text-red-500 mb-2" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <p className="text-red-700">Failed to load maintenance tasks</p>
            {refreshTasks && (
              <Button 
                variant="outline" 
                className="mt-4 border-red-300 text-red-700" 
                onClick={refreshTasks}
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            {showCompleted ? "No completed tasks yet" : "No maintenance tasks"}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {showCompleted 
              ? "Tasks that are marked as completed will appear here"
              : "When components are inspected and marked as 'Maintenance Required', tasks will appear here"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
