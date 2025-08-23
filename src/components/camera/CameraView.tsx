
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  takePicture: () => Promise<void>;
  stopCamera: () => void;
  isUploading: boolean;
  uploadProgress: number;
  isMobile?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  takePicture, 
  stopCamera, 
  isUploading,
  uploadProgress,
  isMobile: propIsMobile
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hookIsMobile = useIsMobile();
  const isMobile = propIsMobile !== undefined ? propIsMobile : hookIsMobile;

  // Scroll into view when camera is activated
  useEffect(() => {
    if (containerRef.current) {
      // Scroll the container into view with a small delay to ensure camera is initialized
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative bg-black rounded-lg overflow-hidden"
      style={{ marginBottom: '100px' }} // Add fixed bottom margin to ensure controls visibility
    >
      <div className={`w-full relative ${isMobile ? 'aspect-[3/4]' : 'aspect-video'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Loading indicator with progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-4 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
            <div className="text-white font-medium text-lg mb-2">
              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
            </div>
            <div className="w-64 px-4">
              <Progress value={uploadProgress} className="h-2" />
              <div className="text-center text-white text-sm mt-1">
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera controls - now with fixed positioning for better visibility */}
      <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={takePicture} 
            disabled={isUploading} 
            className="bg-success hover:bg-success/80 text-lg py-6 px-10 shadow-lg flex-1"
            size="lg"
          >
            {isUploading ? `Uploading ${uploadProgress}%` : 'Capture Photo'}
          </Button>
          <Button 
            onClick={stopCamera} 
            variant="outline" 
            className="bg-white text-black border-white hover:bg-gray-100 text-lg py-6 shadow-lg"
            disabled={isUploading}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
