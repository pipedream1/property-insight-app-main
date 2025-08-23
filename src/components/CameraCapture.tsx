
import React, { useEffect } from 'react';
import { useCamera } from '@/hooks/camera/useCamera';
import { CameraView } from '@/components/camera/CameraView';
import { CameraControls } from '@/components/camera/CameraControls';
import { ImageGallery } from '@/components/camera/ImageGallery';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ensureRequiredBuckets } from '@/utils/storage/ensureBuckets';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
  capturedImages: string[];
  onRemoveImage: (index: number) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onImageCaptured, 
  capturedImages, 
  onRemoveImage 
}) => {
  const isMobile = useIsMobile();

  const {
    videoRef,
    showCamera,
    isUploading,
    uploadProgress,
    handleCameraCapture,
    takePicture,
    stopCamera,
    handleFileUpload,
    fileInputRef,
  } = useCamera(onImageCaptured);

  // Ensure storage buckets exist when component loads
  useEffect(() => {
    // Initialize storage buckets
    const initStorage = async () => {
      try {
        await ensureRequiredBuckets();
        console.log("Storage buckets initialized");
      } catch (error) {
        console.error("Failed to initialize storage buckets:", error);
        toast.error("Failed to initialize storage. Some features may not work properly.");
      }
    };
    
    initStorage();
  }, []);

  // Check for camera permissions
  const showCameraPermissionsInfo = typeof navigator !== 'undefined' && navigator.mediaDevices === undefined;

  return (
    <div className={`mt-4 relative ${showCamera ? 'pb-24' : ''}`}>
      {showCameraPermissionsInfo && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Camera access is not available. Please ensure you're using HTTPS and have granted camera permissions.
          </AlertDescription>
        </Alert>
      )}
      
      {showCamera ? (
        <CameraView
          videoRef={videoRef}
          takePicture={takePicture}
          stopCamera={stopCamera}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          isMobile={isMobile}
        />
      ) : (
        <>
          <CameraControls
            onCameraCapture={handleCameraCapture}
            onSelectFile={() => fileInputRef.current?.click()}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            isMobile={isMobile}
          />
          
          {capturedImages.length > 0 && (
            <ImageGallery
              images={capturedImages}
              onRemoveImage={onRemoveImage}
              isUploading={isUploading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CameraCapture;
