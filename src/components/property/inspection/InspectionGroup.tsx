
import React from 'react';
import { InspectionItem } from './InspectionItem';
import { InspectionType } from '@/types/inspection';

interface InspectionGroupProps {
  componentType: string;
  inspections: InspectionType[];
  onEdit?: (inspection: InspectionType) => void;
  onDelete?: (inspection: InspectionType) => void;
  onImageClick: (imageUrl: string) => void;
  tryParseJsonPhotos: (photoUrl: string | null) => string[];
}

export const InspectionGroup: React.FC<InspectionGroupProps> = ({
  componentType,
  inspections,
  onEdit,
  onDelete,
  onImageClick,
  tryParseJsonPhotos
}) => {
  // Sort inspections by creation date (oldest to newest)
  const sortedInspections = [...inspections].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-md border-b pb-1">{componentType}</h3>
      
      <div className="space-y-4">
        {sortedInspections.map((inspection) => (
          <InspectionItem 
            key={inspection.id}
            inspection={inspection}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={onImageClick}
            tryParseJsonPhotos={tryParseJsonPhotos}
          />
        ))}
      </div>
    </div>
  );
};
