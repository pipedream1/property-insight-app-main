
import React, { useState, useEffect } from 'react';
import { AIDocumentAnalysis } from './AIDocumentAnalysis';
import { DocumentsList } from './DocumentsList';
import { mockDocuments } from './mockDocuments';

interface OfficialDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  upload_date: string;
  tags: string[];
  file_size: number;
  category: 'estate' | 'municipality';
}

export const OfficialDocumentsTab = () => {
  const [documents, setDocuments] = useState<OfficialDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use mock data for now - empty array
    setTimeout(() => {
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <AIDocumentAnalysis />
      <DocumentsList
        documents={documents}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onViewDocument={handleViewDocument}
        onDownloadDocument={handleDownloadDocument}
      />
    </div>
  );
};
