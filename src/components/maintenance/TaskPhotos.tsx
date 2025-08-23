
import React from 'react';
import { ImageIcon, Images } from 'lucide-react';

interface TaskPhotosProps {
  photos: string[];
  onImageClick: (url: string) => void;
}

const TaskPhotos: React.FC<TaskPhotosProps> = ({ photos, onImageClick }) => {
  if (!photos || photos.length === 0) return null;
  
  return (
    <div className="flex gap-1 mt-1">
      {photos.slice(0, 3).map((photo, index) => (
        <img 
          key={`photo-${index}`}
          src={photo} 
          alt={`Task photo ${index + 1}`}
          className="w-8 h-8 object-cover rounded border border-muted cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick(photo);
          }}
          loading="lazy" 
        />
      ))}
      
      {photos.length > 3 && (
        <div 
          className="w-8 h-8 bg-muted flex items-center justify-center rounded border border-muted cursor-pointer hover:bg-muted/80"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick(photos[3]);
          }}
        >
          <span className="text-xs font-medium text-muted-foreground">
            +{photos.length - 3}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskPhotos;
