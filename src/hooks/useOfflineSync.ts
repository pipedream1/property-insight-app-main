
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { offlineStorage } from '@/utils/storage/offlineStorage';
import { uploadImageToStorage } from '@/utils/storage/uploadService';

export const useOfflineSync = (options: { auto?: boolean } = {}) => {
  const { auto = true } = options;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [paused, setPaused] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('offlineSyncPaused');
      return stored === 'true';
    } catch (e) {
      // ignore read error (private mode etc.)
      return false;
    }
  });
  const syncInProgressRef = useRef(false); // prevents re-entrant looping due to dependency changes

  const syncOfflinePhotos = useCallback(async () => {
    if (paused) {
      console.log('Offline photo sync is paused; skipping.');
      return;
    }
    if (syncInProgressRef.current) return; // guard
    syncInProgressRef.current = true;
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
            bucketName: 'inspection-photos',
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
      syncInProgressRef.current = false;
      setSyncInProgress(false);
    }
  }, [paused]);

  const updateOnlineStatus = useCallback(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    if (!auto || paused) return;
    if (online && !syncInProgressRef.current) {
      void syncOfflinePhotos();
    }
  }, [auto, paused, syncOfflinePhotos]);

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
    // Initialize offline storage once
    offlineStorage.init().then(() => {
      console.log('Offline storage initialized');
      getPendingPhotosCount().then(setPendingUploads);
      if (auto && !paused && navigator.onLine) {
        void syncOfflinePhotos();
      }
    });

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [auto, paused, updateOnlineStatus, getPendingPhotosCount, syncOfflinePhotos]);

  const pauseSync = () => {
    setPaused(true);
    try { localStorage.setItem('offlineSyncPaused', 'true'); } catch (e) { /* ignore */ }
  };
  const resumeSync = async () => {
    setPaused(false);
    try { localStorage.setItem('offlineSyncPaused', 'false'); } catch (e) { /* ignore */ }
    const photos = await offlineStorage.getAllPhotos();
    const count = photos.length;
    toast.info(`Resuming sync. ${count} photo${count===1?'':'s'} queued.`);
    if (isOnline && count > 0) {
      void syncOfflinePhotos();
    }
  };

  return {
    isOnline,
    syncInProgress,
    paused,
    pendingUploads,
    storePhotoOffline,
    syncOfflinePhotos,
    getPendingPhotosCount,
    pauseSync,
    resumeSync
  };
};
