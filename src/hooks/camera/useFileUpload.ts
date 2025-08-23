
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadImageToStorage } from '@/utils/storage/uploadService';
import { extractImageMetadata, storeImageMetadata } from '@/utils/storage/extractMetadata';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface UseFileUploadProps {
  onImageCaptured: (imageUrl: string) => void;
}

interface UseFileUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useFileUpload = ({
  onImageCaptured
}: UseFileUploadProps): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOnline, storePhotoOffline } = useOfflineSync();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        console.log(`Uploading file: ${file.name}, ${Math.round(file.size / 1024)}KB, ${file.type}`);
        
        // Extract metadata from the file
        const metadata = await extractImageMetadata(file);
        console.log("Extracted file metadata:", metadata);
        
        // Try to get current location if not in the metadata
        if (!metadata.location) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              });
            });
            
            metadata.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            console.log("Added current location to metadata:", metadata.location);
          } catch (geoError) {
            console.warn("Could not get location:", geoError);
          }
        }

        // Check if online
        if (!isOnline) {
          console.log('Device is offline, storing file locally');
          setUploadProgress(50);
          
          // Store file offline
          const offlineId = await storePhotoOffline(file, {
            componentType: 'file-upload',
            componentName: 'inspection-photo'
          });
          
          setUploadProgress(100);
          
          // Create a temporary URL for immediate display
          const tempUrl = URL.createObjectURL(file);
          onImageCaptured(tempUrl);
          
          toast.success('Photo saved offline. Will upload when WiFi is available.');
          
          // Reset the input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          return;
        }
        
        // Online upload with retries
        const maxRetries = 3;
        let retries = 0;
        let uploadError = null;
        
        while (retries <= maxRetries) {
          try {
            console.log(`File upload attempt ${retries + 1}/${maxRetries + 1} starting...`);
            
            const publicUrl = await uploadImageToStorage(file, {
              onProgress: (progress) => {
                setUploadProgress(progress);
                console.log(`Upload progress: ${progress}%`);
              },
              bucketName: 'images',
              folderPath: 'uploads'
            });
            
            if (publicUrl) {
              // Store metadata in our cache
              storeImageMetadata(publicUrl, metadata);
              
              onImageCaptured(publicUrl);
              toast.success('Image uploaded successfully');
              
              // Reset the input so the same file can be selected again
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              
              return; // Success, exit the retry loop
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
        console.log('All file upload attempts failed, storing offline as fallback');
        
        try {
          const offlineId = await storePhotoOffline(file, {
            componentType: 'file-upload',
            componentName: 'inspection-photo'
          });
          
          // Create a temporary URL for immediate display
          const tempUrl = URL.createObjectURL(file);
          onImageCaptured(tempUrl);
          
          toast.warning('Upload failed but photo saved offline. Will retry when connection improves.');
        } catch (offlineError) {
          console.error('Failed to store offline as fallback:', offlineError);
          
          const errorMessage = uploadError instanceof Error ? 
            uploadError.message : 
            'Unknown error during upload';
          
          toast.error(`Upload failed: ${errorMessage}`);
        }
        
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Upload failed: ${errorMessage}`);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return {
    isUploading,
    uploadProgress,
    fileInputRef,
    handleFileUpload
  };
};
