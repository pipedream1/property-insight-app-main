
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { offlineStorage } from '@/utils/storage/offlineStorage';
import { uploadImageToStorage } from '@/utils/storage/uploadService';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);

  const updateOnlineStatus = useCallback(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    
    if (online && !syncInProgress) {
      syncOfflinePhotos();
    }
  }, [syncInProgress]);

  const syncOfflinePhotos = useCallback(async () => {
    if (syncInProgress) return;
    
    setSyncInProgress(true);
    console.log('Starting offline photo sync...');
    
    try {
      const photos = await offlineStorage.getAllPhotos();
      setPendingUploads(photos.length);
      
      if (photos.length === 0) {
        setSyncInProgress(false);
        return;
      }

      console.log(`Found ${photos.length} offline photos to sync`);
      let successCount = 0;
      let failCount = 0;

      for (const photo of photos) {
        try {
          console.log(`Uploading photo ${photo.id}...`);
          
          const publicUrl = await uploadImageToStorage(photo.blob, {
            bucketName: 'images',
            folderPath: 'offline-sync',
            onProgress: (progress) => {
              console.log(`Upload progress for ${photo.id}: ${progress}%`);
            }
          });

          if (publicUrl) {
            await offlineStorage.removePhoto(photo.id);
            successCount++;
            console.log(`Successfully uploaded and removed photo ${photo.id}`);
          } else {
            throw new Error('Failed to get public URL');
          }
        } catch (error) {
          console.error(`Failed to upload photo ${photo.id}:`, error);
          
          // Increment retry count
          const newRetryCount = photo.retryCount + 1;
          if (newRetryCount >= 3) {
            // Remove after 3 failed attempts
            await offlineStorage.removePhoto(photo.id);
            console.log(`Removed photo ${photo.id} after 3 failed attempts`);
          } else {
            await offlineStorage.updateRetryCount(photo.id, newRetryCount);
          }
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully synced ${successCount} photos from offline storage`);
      }
      
      if (failCount > 0) {
        toast.error(`Failed to sync ${failCount} photos`);
      }

      // Update pending count
      const remainingPhotos = await offlineStorage.getAllPhotos();
      setPendingUploads(remainingPhotos.length);
      
    } catch (error) {
      console.error('Error during offline sync:', error);
      toast.error('Failed to sync offline photos');
    } finally {
      setSyncInProgress(false);
    }
  }, [syncInProgress]);

  const storePhotoOffline = useCallback(async (
    blob: Blob, 
    metadata: { componentType?: string; componentName?: string; inspectionId?: string } = {}
  ): Promise<string> => {
    try {
      const photoId = await offlineStorage.storePhoto({
        blob,
        metadata: {
          ...metadata,
          timestamp: new Date()
        }
      });
      
      // Update pending count
      const photos = await offlineStorage.getAllPhotos();
      setPendingUploads(photos.length);
      
      toast.info('Photo stored offline. Will upload when WiFi is available.');
      return photoId;
    } catch (error) {
      console.error('Failed to store photo offline:', error);
      throw error;
    }
  }, []);

  const getPendingPhotosCount = useCallback(async (): Promise<number> => {
    try {
      const photos = await offlineStorage.getAllPhotos();
      return photos.length;
    } catch (error) {
      console.error('Failed to get pending photos count:', error);
      return 0;
    }
  }, []);

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init().then(() => {
      console.log('Offline storage initialized');
      getPendingPhotosCount().then(setPendingUploads);
    });

    // Set up online/offline event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check for pending uploads on mount
    if (navigator.onLine) {
      syncOfflinePhotos();
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [updateOnlineStatus, syncOfflinePhotos, getPendingPhotosCount]);

  return {
    isOnline,
    syncInProgress,
    pendingUploads,
    storePhotoOffline,
    syncOfflinePhotos,
    getPendingPhotosCount
  };
};
