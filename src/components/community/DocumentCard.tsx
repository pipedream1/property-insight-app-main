
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Download } from 'lucide-react';

interface OfficialDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  upload_date: string;
  tags: string[];
  file_size: number;
}

interface DocumentCardProps {
  document: OfficialDocument;
  onView: (url: string) => void;
  onDownload: (url: string, title: string) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onDownload 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">{document.title}</h3>
              <Badge variant="outline" className="text-xs">
                {document.file_type.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {document.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Uploaded: {new Date(document.upload_date).toLocaleDateString()}</span>
              <span>Size: {formatFileSize(document.file_size)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(document.file_url)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDownload(document.file_url, document.title)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
