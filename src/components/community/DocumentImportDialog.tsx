
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Globe, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DocumentScrapingService } from '@/services/documentScrapingService';
import { DocumentDownloadService } from '@/services/documentDownloadService';
import { toast } from 'sonner';

interface ScrapedDocument {
  title: string;
  url: string;
  type: string;
  description?: string;
}

interface DownloadResult {
  success: boolean;
  document: ScrapedDocument;
  error?: string;
  storageUrl?: string;
}

export const DocumentImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('https://www.knysna.gov.za/government/important-documents/bylaws/');
  const [isScrapingDocuments, setIsScrapingDocuments] = useState(false);
  const [scrapedDocuments, setScrapedDocuments] = useState<ScrapedDocument[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentDownload, setCurrentDownload] = useState('');
  const [downloadResults, setDownloadResults] = useState<DownloadResult[]>([]);

  const handleScrapeDocuments = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a valid website URL');
      return;
    }

    setIsScrapingDocuments(true);
    setScrapedDocuments([]);

    try {
      const documents = await DocumentScrapingService.scrapeDocuments(websiteUrl);
      setScrapedDocuments(documents);
      
      if (documents.length === 0) {
        toast.warning('No documents found on this website');
      } else {
        toast.success(`Found ${documents.length} documents ready for download`);
      }
    } catch (error) {
      console.error('Error scraping documents:', error);
      toast.error(`Failed to scrape documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScrapingDocuments(false);
    }
  };

  const handleDownloadDocuments = async () => {
    if (scrapedDocuments.length === 0) {
      toast.error('No documents to download');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadResults([]);

    try {
      const results = await DocumentDownloadService.downloadAndStoreDocuments(
        scrapedDocuments,
        (progress) => {
          setDownloadProgress((progress.documentIndex / progress.totalDocuments) * 100);
          setCurrentDownload(progress.currentDocument);
        }
      );

      setDownloadResults(results);
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Successfully downloaded ${successCount} documents`);
      }
      if (failureCount > 0) {
        toast.error(`Failed to download ${failureCount} documents`);
      }
      
    } catch (error) {
      console.error('Error downloading documents:', error);
      toast.error(`Failed to download documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
      setCurrentDownload('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Globe className="h-4 w-4 mr-2" />
          Import from Website
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Documents from Website</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Website URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <div className="flex gap-2">
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com/documents"
                className="flex-1"
              />
              <Button 
                onClick={handleScrapeDocuments}
                disabled={isScrapingDocuments || isDownloading}
              >
                {isScrapingDocuments ? 'Scanning...' : 'Scan for Documents'}
              </Button>
            </div>
          </div>

          {/* Scraped Documents List */}
          {scrapedDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Found Documents ({scrapedDocuments.length})</h3>
                <Button 
                  onClick={handleDownloadDocuments}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All Documents
                </Button>
              </div>
              
              {/* Download Progress */}
              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Downloading: {currentDownload}</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <Progress value={downloadProgress} />
                </div>
              )}
              
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {scrapedDocuments.map((doc, index) => {
                  const result = downloadResults.find(r => r.document.title === doc.title);
                  
                  return (
                    <Card key={index} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-sm">{doc.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {doc.type.toUpperCase()}
                              </Badge>
                            </div>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground">{doc.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {result && (
                              <>
                                {result.success ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </>
                            )}
                            {isDownloading && !result && (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Download Results Summary */}
          {downloadResults.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Download Summary</h4>
              <div className="text-sm space-y-1">
                <p>✅ Successfully downloaded: {downloadResults.filter(r => r.success).length} documents</p>
                <p>❌ Failed downloads: {downloadResults.filter(r => !r.success).length} documents</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
