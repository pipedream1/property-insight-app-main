
import { supabase } from '@/integrations/supabase/client';
import { ensureRequiredBuckets } from '@/utils/storage/ensureBuckets';

interface DownloadProgress {
  documentIndex: number;
  totalDocuments: number;
  currentDocument: string;
  status: 'downloading' | 'uploading' | 'complete' | 'error';
}

export class DocumentDownloadService {
  static async downloadAndStoreDocuments(
    documents: Array<{ title: string; url: string; type: string; description?: string }>,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Array<{ success: boolean; document: any; error?: string; storageUrl?: string }>> {
    const results = [];
    
    // Ensure storage bucket exists
    await ensureRequiredBuckets();
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      
      try {
        onProgress?.({
          documentIndex: i + 1,
          totalDocuments: documents.length,
          currentDocument: doc.title,
          status: 'downloading'
        });
        
        // Download the document
        console.log(`Downloading document ${i + 1}/${documents.length}: ${doc.title}`);
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(doc.url)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        onProgress?.({
          documentIndex: i + 1,
          totalDocuments: documents.length,
          currentDocument: doc.title,
          status: 'uploading'
        });
        
        // Generate a safe filename
        const safeFilename = this.generateSafeFilename(doc.title, doc.type);
        const filePath = `documents/${safeFilename}`;
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        results.push({
          success: true,
          document: doc,
          storageUrl: publicUrl
        });
        
        onProgress?.({
          documentIndex: i + 1,
          totalDocuments: documents.length,
          currentDocument: doc.title,
          status: 'complete'
        });
        
      } catch (error) {
        console.error(`Failed to download ${doc.title}:`, error);
        results.push({
          success: false,
          document: doc,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        onProgress?.({
          documentIndex: i + 1,
          totalDocuments: documents.length,
          currentDocument: doc.title,
          status: 'error'
        });
      }
    }
    
    return results;
  }
  
  private static generateSafeFilename(title: string, type: string): string {
    // Remove special characters and spaces, replace with underscores
    const safeName = title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    // Ensure it has the correct extension
    const extension = type.startsWith('.') ? type : `.${type}`;
    
    if (safeName.endsWith(extension)) {
      return safeName;
    }
    
    return `${safeName}${extension}`;
  }
}
