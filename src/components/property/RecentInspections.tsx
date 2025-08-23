
import React, { useState } from 'react';
import { InspectionGroup } from './inspection/InspectionGroup';
import { InspectionType } from '@/types/inspection';
import { ImageDialog } from './inspection/ImageDialog';

interface RecentInspectionsProps {
  inspections: InspectionType[];
  isLoading: boolean;
  onEdit?: (inspection: InspectionType) => void;
  onDelete?: (inspection: InspectionType) => void;
  onImageClick?: (url: string) => void;
}

const RecentInspections: React.FC<RecentInspectionsProps> = ({ 
  inspections, 
  isLoading,
  onEdit,
  onDelete,
  onImageClick
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Helper function to parse JSON photo URLs or return single photo URL as array
  const tryParseJsonPhotos = (photoUrl: string | null): string[] => {
    if (!photoUrl) return [];
    try {
      const parsed = JSON.parse(photoUrl);
      return Array.isArray(parsed) ? parsed : [photoUrl];
    } catch (e) {
      return [photoUrl]; // If not valid JSON, return as single item array
    }
  };

  // Handle image click - either use provided handler or internal state
  const handleImageClick = (url: string) => {
    if (onImageClick) {
      onImageClick(url);
    } else {
      setSelectedImage(url);
    }
  };

  // Sort inspections by created_at date (oldest to newest) before grouping
  const sortedInspections = [...inspections].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Group inspections by component type
  const groupedInspections = sortedInspections.reduce((groups, inspection) => {
    // Extract component type (first word of component name or "Other")
    const componentType = inspection.component_type || 'Other';
    
    // Capitalize the first letter of each word in the component type
    const formattedType = componentType
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    if (!groups[formattedType]) {
      groups[formattedType] = [];
    }
    groups[formattedType].push(inspection);
    return groups;
  }, {} as Record<string, InspectionType[]>);

  if (isLoading) {
    return <div className="text-center py-8">Loading inspections...</div>;
  }

  if (inspections.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No recent inspections recorded.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedInspections).map(([componentType, typeInspections]) => (
          <InspectionGroup
            key={componentType}
            componentType={componentType}
            inspections={typeInspections}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={handleImageClick}
            tryParseJsonPhotos={tryParseJsonPhotos}
          />
        ))}
      </div>
      
      {/* Image dialog for displaying enlarged images */}
      <ImageDialog 
        selectedImage={selectedImage} 
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }} 
      />
    </>
  );
};

export default RecentInspections;
