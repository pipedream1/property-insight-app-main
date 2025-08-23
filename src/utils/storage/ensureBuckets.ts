
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Makes sure all required storage buckets exist
 * This should be called early in the application lifecycle
 */
export const ensureRequiredBuckets = async (): Promise<void> => {
  try {
    console.log("Ensuring all required storage buckets exist...");
    
    // List of buckets we need
    const requiredBuckets = ['images'];
    
    // Get existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      toast.error("Failed to check storage buckets");
      throw error;
    }
    
    const existingBucketNames = buckets?.map(bucket => bucket.name) || [];
    console.log("Existing buckets:", existingBucketNames);
    
    // Create any missing buckets
    for (const bucketName of requiredBuckets) {
      if (!existingBucketNames.includes(bucketName)) {
        console.log(`Creating missing bucket: ${bucketName}`);
        
        try {
          // Check if the bucket already exists (double-check)
          const { data: checkData } = await supabase.storage.getBucket(bucketName);
          
          if (checkData) {
            console.log(`Bucket ${bucketName} already exists`);
            continue;
          }
          
          // Try to create the bucket with public access
          const { error: createError } = await supabase.storage.createBucket(
            bucketName, 
            { 
              public: true,
              fileSizeLimit: 10485760 // 10MB
            }
          );
          
          if (createError) {
            // If we can't create the bucket, log the specific error
            console.error(`Error creating bucket ${bucketName}:`, createError);
            console.log("Error message:", createError.message);
            console.log("Error name:", createError.name);
            
            // Try to use the bucket anyway - with our updated policies this should work
            console.log(`Attempting to use existing bucket: ${bucketName}`);
          } else {
            console.log(`Successfully created bucket: ${bucketName}`);
          }
        } catch (bucketError) {
          console.error(`Error processing bucket ${bucketName}:`, bucketError);
          toast.warning(`Storage bucket '${bucketName}' may not be configured correctly.`);
        }
      } else {
        console.log(`Bucket '${bucketName}' exists, proceeding with upload`);
      }
    }
    
    // Try to verify we can access the buckets we need
    for (const bucketName of requiredBuckets) {
      try {
        const { data: verifyData, error: verifyError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 });
          
        if (verifyError) {
          console.warn(`Warning: Cannot access bucket ${bucketName}:`, verifyError);
          console.log("Error details:", verifyError);
        } else {
          console.log(`Verified access to bucket ${bucketName}`);
        }
      } catch (verifyError) {
        console.warn(`Warning: Error verifying bucket ${bucketName}:`, verifyError);
      }
    }
  } catch (error) {
    console.error("Failed to ensure required buckets:", error);
    toast.error("Failed to set up storage. Please try again later.");
  }
};
