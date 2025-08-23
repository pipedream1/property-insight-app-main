
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImageToStorage } from '@/utils/storage/uploadService';
import { extractImageMetadata, storeImageMetadata } from '@/utils/storage/extractMetadata';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface UseImageCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  stopCamera: () => void;
  onImageCaptured: (imageUrl: string) => void;
}

interface UseImageCaptureReturn {
  isUploading: boolean;
  uploadProgress: number;
  takePicture: () => Promise<void>;
}

export const useImageCapture = ({
  videoRef, 
  streamRef, 
  stopCamera,
  onImageCaptured
}: UseImageCaptureProps): UseImageCaptureReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOnline, storePhotoOffline } = useOfflineSync();

  const takePicture = async (): Promise<void> => {
    if (!videoRef.current || !streamRef.current) {
      toast.error('Camera not initialized properly');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Make sure video is playing and has dimensions
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        console.log('Video not ready yet, waiting...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const canvas = document.createElement('canvas');
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
      
      // Check if dimensions are available
      if (!videoWidth || !videoHeight) {
        throw new Error('Could not get video dimensions');
      }
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not create canvas context');
      }
      
      // Draw the current video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Get image as blob with higher quality
      const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob(resolve, 'image/jpeg', 0.92)
      );
      
      if (!blob) {
        throw new Error('Failed to capture image from canvas');
      }
      
      // Log blob details for debugging
      console.log(`Captured image: ${Math.round(blob.size / 1024)}KB`);
      
      // Get device location for metadata
      let metadata: any = {
        timestamp: new Date()
      };
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        console.log("Got device location:", position.coords);
        
        // Add location to metadata
        metadata.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (geoError) {
        console.warn('Could not get location:', geoError);
        // Continue without location data
      }

      // Check if online
      if (!isOnline) {
        console.log('Device is offline, storing photo locally');
        setUploadProgress(50);
        
        // Store photo offline
        const offlineId = await storePhotoOffline(blob, {
          componentType: 'camera-capture',
          componentName: 'inspection-photo'
        });
        
        setUploadProgress(100);
        
        // Create a temporary URL for immediate display
        const tempUrl = URL.createObjectURL(blob);
        onImageCaptured(tempUrl);
        
        toast.success('Photo saved offline. Will upload when WiFi is available.');
        stopCamera();
        return;
      }
      
      // Online upload with retries
      const maxRetries = 3;
      let retries = 0;
      let uploadError = null;
      
      while (retries <= maxRetries) {
        try {
          console.log(`Upload attempt ${retries + 1}/${maxRetries + 1} starting...`);
          
          // Upload the image with progress tracking and metadata
          const publicUrl = await uploadImageToStorage(blob, {
            onProgress: (progress) => {
              setUploadProgress(progress);
              console.log(`Upload progress: ${progress}%`);
            },
            bucketName: 'images',
            folderPath: 'captures'
          });
          
          // Also store metadata in our cache
          if (publicUrl) {
            storeImageMetadata(publicUrl, metadata);
            
            // Notify success and pass image URL to parent component
            onImageCaptured(publicUrl);
            toast.success('Photo captured and uploaded successfully');
            
            // Stop camera after successful upload
            stopCamera();
            
            // Upload succeeded, exit the retry loop
            return;
          } else {
            throw new Error('Failed to get URL from upload');
          }
        } catch (error) {
          uploadError = error;
          console.error(`Upload attempt ${retries + 1}/${maxRetries + 1} failed:`, error);
          retries++;
          
          if (retries <= maxRetries) {
            // Wait before retrying (exponential backoff)
            const delay = 1000 * Math.pow(2, retries - 1);
            console.log(`Retrying upload in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // If we get here, all retries failed - store offline as fallback
      console.log('All upload attempts failed, storing offline as fallback');
      
      try {
        const offlineId = await storePhotoOffline(blob, {
          componentType: 'camera-capture',
          componentName: 'inspection-photo'
        });
        
        // Create a temporary URL for immediate display
        const tempUrl = URL.createObjectURL(blob);
        onImageCaptured(tempUrl);
        
        toast.warning('Upload failed but photo saved offline. Will retry when connection improves.');
        stopCamera();
      } catch (offlineError) {
        console.error('Failed to store offline as fallback:', offlineError);
        
        const errorMessage = uploadError instanceof Error ? 
          uploadError.message : 
          'Unknown error during upload';
        
        toast.error(`Upload failed: ${errorMessage}`);
      }
      
      // Don't stop camera on failed upload so user can try again if offline storage also fails
    } catch (error) {
      console.error('Error capturing/uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to capture image: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    takePicture
  };
};
