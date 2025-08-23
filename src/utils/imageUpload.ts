
import { toast } from 'sonner';
import { uploadImageToStorage } from './storage/uploadService';
import { getImagesFromStorage, deleteImageFromStorage } from './storage/bucketOperations';

// Export all functions for backward compatibility
export { uploadImageToStorage, getImagesFromStorage, deleteImageFromStorage };

// Adding toast for backward compatibility
export const getImagesFromStorageWithToast = async (
  bucketName: string = 'photos',
  folderPath: string = 'inspections'
): Promise<string[]> => {
  try {
    return await getImagesFromStorage(bucketName, folderPath);
  } catch (error) {
    toast.error('Failed to load images');
    return [];
  }
};

export const deleteImageFromStorageWithToast = async (imageUrl: string): Promise<boolean> => {
  try {
    return await deleteImageFromStorage(imageUrl);
  } catch (error) {
    toast.error('Failed to delete image');
    return false;
  }
};
