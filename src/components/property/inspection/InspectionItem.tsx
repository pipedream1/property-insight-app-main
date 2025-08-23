
import React from 'react';
import { Pencil, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ConditionBadge } from './ConditionBadge';
import { InspectionPhotos } from './InspectionPhotos';
import { InspectionType } from '@/types/inspection';
import ImageCarousel from '../ImageCarousel';

interface InspectionItemProps {
  inspection: InspectionType;
  onEdit?: (inspection: InspectionType) => void;
  onDelete?: (inspection: InspectionType) => void;
  onImageClick: (imageUrl: string) => void;
  tryParseJsonPhotos: (photoUrl: string | null) => string[];
}

export const InspectionItem: React.FC<InspectionItemProps> = ({ 
  inspection, 
  onEdit, 
  onDelete, 
  onImageClick,
  tryParseJsonPhotos
}) => {
  // Get photos array
  const photos = tryParseJsonPhotos(inspection.photo_url);
  
  // Capitalize first letter of component name
  const componentName = inspection.component_name || '';
  const formattedComponentName = componentName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="mb-2 font-medium">{formattedComponentName}</div>
          <ConditionBadge condition={inspection.condition} />
          <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(inspection.created_at)}
            <span className="mx-1">•</span>
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(inspection.created_at)}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto" 
                onClick={() => onEdit(inspection)}
              >
                <Pencil className="h-3 w-3" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto text-destructive hover:text-destructive" 
                onClick={() => onDelete(inspection)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {inspection.comment && (
        <p className="text-sm text-muted-foreground mt-2">{inspection.comment}</p>
      )}
      
      {/* Updated to ensure photos can be enlarged on click */}
      <InspectionPhotos 
        photos={photos} 
        onImageClick={onImageClick} 
        maxDisplay={8}  // Show fewer thumbnails to encourage clicking for full view
      />
    </div>
  );
};
