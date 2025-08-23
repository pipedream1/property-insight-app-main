
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentInspections from '../RecentInspections';
import { InspectionType } from '@/types/inspection';

interface InspectionsCardProps {
  recentInspections: InspectionType[];
  isLoadingInspections: boolean;
  onEditInspection: (inspection: InspectionType) => void;
  onDeleteInspection: (inspection: InspectionType) => void;
}

const InspectionsCard: React.FC<InspectionsCardProps> = ({
  recentInspections,
  isLoadingInspections,
  onEditInspection,
  onDeleteInspection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Inspections</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentInspections 
          inspections={recentInspections}
          isLoading={isLoadingInspections}
          onEdit={onEditInspection}
          onDelete={onDeleteInspection}
        />
      </CardContent>
    </Card>
  );
};

export default InspectionsCard;
