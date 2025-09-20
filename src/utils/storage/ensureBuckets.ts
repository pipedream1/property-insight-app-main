
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Makes sure all required storage buckets exist
 * This should be called early in the application lifecycle
 */
export const ensureRequiredBuckets = async (): Promise<void> => {
  try {
    console.log("Ensuring all required storage buckets exist...");
    
  // List of buckets we need (created via SQL migration, not client-side)
  const requiredBuckets = ['inspection-photos'];
    
    // Get existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      toast.error("Failed to check storage buckets");
      throw error;
    }
    
    const existingBucketNames = buckets?.map(bucket => bucket.name) || [];
    console.log("Existing buckets:", existingBucketNames);
    
    // Do NOT attempt to create buckets from the client for security reasons.
    // Simply warn if the expected bucket isn't present.
    for (const bucketName of requiredBuckets) {
      if (!existingBucketNames.includes(bucketName)) {
        console.warn(`Required bucket '${bucketName}' not found. Ensure the migration created it and policies allow access.`);
        toast.warning(`Storage bucket '${bucketName}' is missing. Please run the SQL migration in Supabase.`);
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
