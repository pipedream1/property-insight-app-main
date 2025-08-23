
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentImportDialog } from './DocumentImportDialog';
import { DocumentCard } from './DocumentCard';

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

interface DocumentsListProps {
  documents: OfficialDocument[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDocument: (url: string) => void;
  onDownloadDocument: (url: string, title: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  searchTerm,
  onSearchChange,
  onViewDocument,
  onDownloadDocument
}) => {
  const [isEstateOpen, setIsEstateOpen] = useState(true);
  const [isMunicipalityOpen, setIsMunicipalityOpen] = useState(false);

  // Mock user role - in real app this would come from auth context
  const userRole = 'owner'; // This should come from auth context

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const estateDocuments = filteredDocuments.filter(doc => doc.category === 'estate');
  const municipalityDocuments = filteredDocuments.filter(doc => doc.category === 'municipality');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Official Documents
          </CardTitle>
          <div className="flex gap-2">
            {/* Only show import button to owners */}
            {userRole === 'owner' && <DocumentImportDialog />}
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents found</p>
            <p className="text-sm">Upload the first official document!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Belvidere Estate Documents Section */}
            <Collapsible open={isEstateOpen} onOpenChange={setIsEstateOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {isEstateOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800">Belvidere Estate Documents</h3>
                  <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded">
                    {estateDocuments.length} documents
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3 pl-6 border-l-2 border-blue-200">
                {estateDocuments.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No estate documents available</p>
                ) : (
                  estateDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onView={onViewDocument}
                      onDownload={onDownloadDocument}
                    />
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Municipality Bylaws Section */}
            <Collapsible open={isMunicipalityOpen} onOpenChange={setIsMunicipalityOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {isMunicipalityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Municipality Bylaws</h3>
                  <span className="text-sm text-green-600 bg-green-200 px-2 py-1 rounded">
                    {municipalityDocuments.length} documents
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3 pl-6 border-l-2 border-green-200">
                {municipalityDocuments.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No municipality documents available</p>
                ) : (
                  municipalityDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onView={onViewDocument}
                      onDownload={onDownloadDocument}
                    />
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
