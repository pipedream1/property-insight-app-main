
import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  onCameraCapture: () => Promise<void>;
  onSelectFile: () => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isMobile?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCameraCapture,
  onSelectFile,
  isUploading,
  fileInputRef,
  handleFileUpload,
  isMobile
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button 
        type="button" 
        className={`flex-1 flex items-center justify-center gap-2 bg-primary py-6 text-lg ${isMobile ? 'text-xl' : ''}`}
        onClick={onCameraCapture}
        disabled={isUploading}
        size={isMobile ? "lg" : "default"}
      >
        <Camera className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`} />
        {isMobile ? 'Open Camera' : 'Take Photo'}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className={`flex-1 flex items-center justify-center gap-2 py-6 text-lg ${isMobile ? 'text-xl' : ''}`}
        onClick={onSelectFile}
        disabled={isUploading}
        size={isMobile ? "lg" : "default"}
      >
        <Upload className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`} />
        Upload Photo
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
