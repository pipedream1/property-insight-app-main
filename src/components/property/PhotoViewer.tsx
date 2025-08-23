
import React, { useState, useEffect } from 'react';
import { getImageMetadata } from '@/utils/storage/extractMetadata';
import { Map } from 'lucide-react';

interface PhotoViewerProps {
  photos: string[];
  thumbnailSize?: string;
  maxEnlargedWidth?: string;
  maxEnlargedHeight?: string;
  showLocationMap?: boolean;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  thumbnailSize = '15mm',
  maxEnlargedWidth = '80%',
  maxEnlargedHeight = '80vh',
  showLocationMap = true
}) => {
  const [enlargedPhotoIndex, setEnlargedPhotoIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Handler to close photo when pressing Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && enlargedPhotoIndex !== null) {
        setEnlargedPhotoIndex(null);
      }
    };
    
    // Handler to close photo when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      if (enlargedPhotoIndex !== null && 
          !(event.target as HTMLElement).closest('.photo-container')) {
        setEnlargedPhotoIndex(null);
      }
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleOutsideClick);
    
    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [enlargedPhotoIndex]);
  
  // If no photos, don't render anything
  if (!photos || photos.length === 0) return null;
  
  return (
    <div className="component-photo-gallery">
      {photos.map((photo, index) => {
        const isEnlarged = index === enlargedPhotoIndex;
        const metadata = showLocationMap ? getImageMetadata(photo) : null;
        
        return (
          <div 
            key={`${photo}-${index}`} 
            className={`photo-container ${isEnlarged ? 'has-enlarged-photo' : ''}`}
          >
            <img 
              src={photo} 
              alt={`Photo ${index + 1}`} 
              className={`inspection-photo ${isEnlarged ? 'enlarged' : ''}`}
              style={{ 
                width: thumbnailSize, 
                height: thumbnailSize, 
                objectFit: 'cover',
                ...(isEnlarged ? { maxWidth: maxEnlargedWidth, maxHeight: maxEnlargedHeight } : {})
              }}
              onClick={() => setEnlargedPhotoIndex(index)}
            />
            
            {isEnlarged && (
              <button 
                className="close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedPhotoIndex(null);
                }}
              >
                ×
              </button>
            )}
            
            {showLocationMap && metadata?.location?.latitude && metadata?.location?.longitude && (
              <div className="location-info">
                <div className="location-map">
                  <a 
                    href={`https://maps.google.com/?q=${metadata.location.latitude},${metadata.location.longitude}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Map size={12} className="inline mr-1" />
                    <span>View Location</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhotoViewer;
