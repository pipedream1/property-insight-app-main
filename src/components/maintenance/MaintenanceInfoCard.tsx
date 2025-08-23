
import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const MaintenanceInfoCard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <CardTitle className="text-amber-800">How Maintenance Tasks Work</CardTitle>
            <CardDescription className="text-amber-700 mt-1">
              Maintenance tasks are automatically created when a component inspection is marked as "Maintenance Required".
              They can be tracked here until completion.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
