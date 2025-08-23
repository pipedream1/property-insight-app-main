
import React, { Suspense, lazy } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load ImageCarousel for better performance
const ImageCarousel = lazy(() => import('../ImageCarousel'));

interface ImageDialogProps {
  selectedImage: string | null;
  onOpenChange: (open: boolean) => void;
}

// Fallback component for when ImageCarousel is loading
const ImageCarouselFallback = () => (
  <div className="w-full h-96 flex items-center justify-center">
    <Skeleton className="w-full h-full rounded-md" />
  </div>
);

// Error fallback component to handle errors in image loading
const ImageErrorFallback = () => (
  <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded-md p-4">
    <div className="text-center">
      <p className="text-red-500 font-medium">Failed to load image</p>
      <p className="text-sm text-muted-foreground mt-2">
        The image could not be displayed. It may be unavailable or in an unsupported format.
      </p>
    </div>
  </div>
);

export const ImageDialog: React.FC<ImageDialogProps> = ({ 
  selectedImage, 
  onOpenChange 
}) => {
  if (!selectedImage) return null;
  
  // Handle image load errors
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load image:", event.currentTarget.src);
    event.currentTarget.src = "/placeholder.svg";
  };
  
  return (
    <Dialog open={!!selectedImage} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-md p-1 sm:p-2 md:p-6">
        {/* Custom close button with enhanced styling */}
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-[#333333] hover:bg-[#666666] text-white p-2 shadow-md transition-colors">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <Suspense fallback={<ImageCarouselFallback />}>
          <ErrorBoundary fallback={<ImageErrorFallback />}>
            <ImageCarousel 
              images={[selectedImage]} 
              className="w-4/5 max-w-none mx-auto"
              showMetadata={true}
              onImageError={handleImageError}
            />
          </ErrorBoundary>
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};
