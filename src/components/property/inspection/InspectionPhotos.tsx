
import React, { memo } from 'react';

interface InspectionPhotosProps {
  photos: string[];
  onImageClick: (url: string) => void;
  maxDisplay?: number;
}

// Memoize the component to prevent unnecessary re-renders when parent components change
export const InspectionPhotos: React.FC<InspectionPhotosProps> = memo(({ 
  photos,
  onImageClick,
  maxDisplay = 12
}) => {
  if (photos.length === 0) return null;
  
  const displayPhotos = photos.slice(0, maxDisplay);
  const hasMorePhotos = photos.length > maxDisplay;
  
  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {displayPhotos.map((photo, index) => (
          <img 
            key={`photo-${index}-${photo.substring(photo.length - 8)}`} // Better key for performance
            src={photo} 
            alt={`Inspection photo ${index + 1}`}
            className="w-16 h-16 object-cover rounded border border-muted cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onImageClick(photo)}
            loading="lazy" // Performance improvement for many images
          />
        ))}
        
        {hasMorePhotos && (
          <div 
            className="w-16 h-16 bg-muted flex items-center justify-center rounded border border-muted cursor-pointer hover:bg-muted/80"
            onClick={() => onImageClick(photos[maxDisplay])}
          >
            <span className="text-xs font-medium text-muted-foreground">
              +{photos.length - maxDisplay} more
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

// Display name for debugging
InspectionPhotos.displayName = 'InspectionPhotos';
