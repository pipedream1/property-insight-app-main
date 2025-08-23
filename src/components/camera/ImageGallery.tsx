
import React from 'react';

interface ImageGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onRemoveImage, 
  isUploading 
}) => {
  if (images.length === 0) return null;
  
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img 
            src={image} 
            alt={`Captured ${index + 1}`} 
            className="w-full h-auto rounded-md object-cover aspect-square"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
            onClick={() => onRemoveImage(index)}
            disabled={isUploading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
