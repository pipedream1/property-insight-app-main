import { supabase } from '@/integrations/supabase/client';
import { validateImageFile } from './fileValidator';
import { v4 as uuidv4 } from 'uuid';
import { extractImageMetadata, storeImageMetadata } from './extractMetadata';
import { ensureRequiredBuckets } from './ensureBuckets';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  bucketName?: string;
  folderPath?: string;
}

/**
 * Uploads an image to storage and returns the public URL
 */
export const uploadImageToStorage = async (
  file: File | Blob,
  options: UploadOptions = {}
): Promise<string> => {
  try {
    // Validate the file
    validateImageFile(file);
    
    const { 
      onProgress = () => {},
      bucketName = 'images',
      folderPath = 'uploads'
    } = options;
    
    // Ensure the bucket exists before uploading
    console.log(`Checking bucket ${bucketName} before upload...`);
    
    // Try to ensure buckets first - this will create if missing
    try {
      console.log("Attempting to ensure buckets exist...");
      await ensureRequiredBuckets();
      console.log("Buckets initialization completed");
    } catch (bucketSetupError) {
      console.error("Error ensuring buckets:", bucketSetupError);
      // Continue anyway - the bucket might already exist
    }
    
    // Now try to access the bucket to verify
    try {
      const { data: bucketCheck, error: bucketError } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1 });
        
      if (bucketError) {
        console.error(`Error accessing bucket ${bucketName}:`, bucketError);
        throw new Error(`Cannot access storage bucket: ${bucketError.message}`);
      } else {
        console.log(`Bucket ${bucketName} is accessible, contains ${bucketCheck?.length || 0} files at root`);
      }
    } catch (bucketCheckError) {
      console.error("Error checking bucket:", bucketCheckError);
    }

    // Generate a unique filename
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;
    
    // Extract metadata from image if available
    const metadata = await extractImageMetadata(file);
    console.log("Extracted metadata:", metadata);
    
    // Track upload progress
    let uploadProgress = 0;
    const updateProgress = (progress: number) => {
      if (progress !== uploadProgress) {
        uploadProgress = progress;
        onProgress(progress);
      }
    };
    
    // Start with 10% progress for metadata extraction
    updateProgress(10);
    
    console.log(`Uploading file to ${bucketName}/${filePath}...`);
    
    // Convert file to smaller size if it's too large
    let uploadFile = file;
    if (file.size > 5 * 1024 * 1024) {
      try {
        console.log("File is large, attempting to compress before upload");
        // We'll keep the original file for now, but in a real app
        // you might want to compress large images
      } catch (compressionError) {
        console.warn("Could not compress image:", compressionError);
      }
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, uploadFile, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      // Log the full error object for debugging
      console.error('Error uploading file (full error object):', JSON.stringify(error, null, 2));
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Check if it's a permission error without using statusCode or details properties
      if (error.message.includes("permission") || error.message.includes("403")) {
        throw new Error(`Permission denied to upload to ${bucketName}. Check bucket permissions.`);
      } else if (error.message.includes("not found") || error.message.includes("404")) {
        throw new Error(`Bucket '${bucketName}' not found. Please create it first.`);
      } else if (error.message.includes("size")) {
        throw new Error(`File too large. Maximum size allowed is ${error.message.match(/\d+/)?.[0] || '10'} MB.`);
      }
      
      // If we don't have a specific message, throw with the original error
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Show 90% progress after upload
    updateProgress(90);
    console.log("Upload successful, getting public URL...");

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log("File uploaded, public URL:", publicUrl);
    
    // Verify the URL is valid
    if (!publicUrl || !publicUrl.includes('http')) {
      throw new Error('Failed to get a valid public URL for the uploaded file');
    }
    
    // Store metadata with the image URL
    storeImageMetadata(publicUrl, metadata);
    
    // Complete progress
    updateProgress(100);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    
    // Make sure we always throw an Error object with a message
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === 'string') {
      throw new Error(error);
    } else {
      throw new Error('Unknown error during upload');
    }
  }
};
