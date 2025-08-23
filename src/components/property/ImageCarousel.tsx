
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { getImageMetadata } from '@/utils/storage/extractMetadata';
import { Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  onClick?: (image: string) => void;
  className?: string;
  showMetadata?: boolean;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  onClick,
  className,
  showMetadata = false,
  onImageError
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showingMetadata, setShowingMetadata] = useState(false);
  
  if (!images || images.length === 0) return null;
  
  const currentImage = images[selectedIndex];
  const metadata = getImageMetadata(currentImage);
  
  const handleShowMetadata = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowingMetadata(!showingMetadata);
  };
  
  const hasLocationData = metadata?.location?.latitude && metadata?.location?.longitude;
  
  const renderMetadataButton = () => {
    if (!showMetadata) return null;
    
    return (
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
        onClick={handleShowMetadata}
      >
        <Map className="h-4 w-4 mr-1" />
        {showingMetadata ? 'Hide Info' : 'Show Info'}
      </Button>
    );
  };
  
  const renderMetadataOverlay = () => {
    if (!showMetadata || !showingMetadata || !metadata) return null;
    
    return (
      <div className="absolute inset-0 bg-black/70 text-white p-4 flex flex-col z-10 overflow-auto">
        <h4 className="font-medium text-lg mb-2">Image Information</h4>
        
        {metadata.timestamp && (
          <p className="text-sm mb-2">
            <span className="font-medium">Date:</span> {metadata.timestamp.toLocaleString()}
          </p>
        )}
        
        {(metadata.make || metadata.model) && (
          <p className="text-sm mb-2">
            <span className="font-medium">Device:</span> {metadata.make} {metadata.model}
          </p>
        )}
        
        {hasLocationData && (
          <>
            <p className="text-sm mb-2">
              <span className="font-medium">Location:</span> {metadata.location?.latitude.toFixed(6)}, {metadata.location?.longitude.toFixed(6)}
            </p>
            
            <div className="mt-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <a 
                href={`https://maps.google.com/?q=${metadata.location?.latitude},${metadata.location?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View on Google Maps
              </a>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // If there's only one image, no need for carousel
  if (images.length === 1) {
    return (
      <div className={cn("relative rounded-md overflow-hidden", className)}>
        <AspectRatio ratio={1/1}>
          <img 
            src={images[0]} 
            alt="Inspection photo" 
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onClick && onClick(images[0])}
            onError={onImageError}
          />
          {renderMetadataButton()}
          {renderMetadataOverlay()}
        </AspectRatio>
      </div>
    );
  }
  
  // For multiple images, use carousel
  return (
    <Carousel 
      className={cn("w-full max-w-md", className)}
      onSelect={(index) => {
        if (typeof index === 'number') {
          setSelectedIndex(index);
        }
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative">
              <AspectRatio ratio={1/1}>
                <img 
                  src={image} 
                  alt={`Inspection photo ${index + 1}`} 
                  className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onClick && onClick(image)}
                  onError={onImageError}
                />
                {index === selectedIndex && renderMetadataButton()}
                {index === selectedIndex && renderMetadataOverlay()}
              </AspectRatio>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default ImageCarousel;
