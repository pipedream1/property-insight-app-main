
import { supabase } from '@/integrations/supabase/client';
import { ensureRequiredBuckets } from './ensureBuckets';

/**
 * Verifies that a Supabase storage bucket exists, creates it if it doesn't
 * @param bucketName The name of the bucket to check/create
 * @returns A promise that resolves when the bucket is confirmed to exist
 */
export const ensureBucketExists = async (bucketName: string): Promise<void> => {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    // Check if bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket(bucketName);
    
    // If bucket doesn't exist, create it
    if (bucketError) {
      console.log(`Bucket error: ${bucketError.message}`);
      if (bucketError.message.includes('The resource was not found') || 
          bucketError.message.includes('does not exist')) {
        console.log(`Creating ${bucketName} bucket...`);
        const { error: createError } = await supabase.storage
          .createBucket(bucketName, { 
            public: true,
            fileSizeLimit: 10485760 // 10MB limit for uploads
          });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw new Error(`Failed to create storage bucket: ${createError.message}`);
        }
        console.log(`Bucket ${bucketName} created successfully`);
      } else {
        throw bucketError;
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

/**
 * Retrieves a list of images from a specific folder in storage
 * @param bucketName The name of the bucket
 * @param folderPath Path to the folder
 * @returns Array of public URLs for the images
 */
export const getImagesFromStorage = async (
  bucketName: string = 'images',
  folderPath: string = 'uploads'
): Promise<string[]> => {
  try {
    // First ensure the bucket exists
    await ensureRequiredBuckets();
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath);
    
    if (error) {
      throw error;
    }
    
    return data
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(item => {
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(`${folderPath}/${item.name}`);
        return publicUrl;
      });
  } catch (error) {
    console.error('Error retrieving images:', error);
    throw new Error(`Failed to retrieve images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Deletes an image from storage
 * @param imageUrl The public URL of the image to delete
 * @returns True if deletion was successful, false otherwise
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketName = pathParts[1]; // Second part after the first slash
    const filePath = pathParts.slice(2).join('/'); // Everything after the bucket name
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
    
    console.log(`Deleted image: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
