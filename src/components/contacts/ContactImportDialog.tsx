
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactImportDialogProps {
  onImportSuccess: () => void;
}

interface ContactRow {
  surname?: string;
  name?: string;
  erf_no?: string;
  street_name?: string;
  street_number?: string;
  mobile?: string;
  email?: string;
}

interface ImportResult {
  success: boolean;
  contact: ContactRow;
  error?: string;
}

export const ContactImportDialog: React.FC<ContactImportDialogProps> = ({
  onImportSuccess
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ContactRow[]>([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      parseCSVPreview(selectedFile);
    }
  };

  const parseCSVPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dataLines = lines.slice(1, 6); // Preview first 5 rows
      
      const contacts: ContactRow[] = dataLines.map(line => {
        const values = line.split(',').map(v => v.trim());
        const contact: ContactRow = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          // Map CSV headers to our contact fields
          if (header.includes('surname')) contact.surname = value;
          else if (header.includes('name') && !header.includes('surname')) contact.name = value;
          else if (header.includes('erf')) contact.erf_no = value;
          else if (header.includes('street') && header.includes('name')) contact.street_name = value;
          else if (header.includes('street') && header.includes('number')) contact.street_number = value;
          else if (header.includes('mobile') || header.includes('phone')) contact.mobile = value;
          else if (header.includes('email')) contact.email = value;
        });
        
        return contact;
      });

      setPreviewData(contacts);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setImportResults([]);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const dataLines = lines.slice(1);

        const results: ImportResult[] = [];
        
        for (const line of dataLines) {
          const values = line.split(',').map(v => v.trim());
          const contact: ContactRow = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            if (header.includes('surname')) contact.surname = value;
            else if (header.includes('name') && !header.includes('surname')) contact.name = value;
            else if (header.includes('erf')) contact.erf_no = value;
            else if (header.includes('street') && header.includes('name')) contact.street_name = value;
            else if (header.includes('street') && header.includes('number')) contact.street_number = value;
            else if (header.includes('mobile') || header.includes('phone')) contact.mobile = value;
            else if (header.includes('email')) contact.email = value;
          });

          try {
            const { error } = await supabase
              .from('contacts')
              .insert({
                surname: contact.surname || null,
                name: contact.name || null,
                erf_no: contact.erf_no || null,
                street_name: contact.street_name || null,
                street_number: contact.street_number || null,
                mobile: contact.mobile || null,
                email: contact.email || null,
              });

            if (error) {
              results.push({
                success: false,
                contact,
                error: error.message
              });
            } else {
              results.push({
                success: true,
                contact
              });
            }
          } catch (error) {
            results.push({
              success: false,
              contact,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        setImportResults(results);
        
        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;
        
        if (successCount > 0) {
          toast.success(`Successfully imported ${successCount} contacts`);
          onImportSuccess();
        }
        
        if (errorCount > 0) {
          toast.error(`Failed to import ${errorCount} contacts`);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setPreviewData([]);
    setImportResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select CSV File</label>
              <p className="text-xs text-muted-foreground mb-2">
                Expected columns: SURNAME, NAME, Erf No, STREET name, street number, MOBILE, EMAIL
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            
            {file && (
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Preview Data */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preview (First 5 rows)</h3>
                <Button 
                  onClick={handleImport}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Importing...' : 'Import All Contacts'}
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Surname</th>
                      <th className="border border-gray-300 p-2 text-left">Name</th>
                      <th className="border border-gray-300 p-2 text-left">Erf No</th>
                      <th className="border border-gray-300 p-2 text-left">Street Name</th>
                      <th className="border border-gray-300 p-2 text-left">Street Number</th>
                      <th className="border border-gray-300 p-2 text-left">Mobile</th>
                      <th className="border border-gray-300 p-2 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((contact, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{contact.surname || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.name || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.erf_no || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.street_name || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.street_number || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.mobile || '-'}</td>
                        <td className="border border-gray-300 p-2">{contact.email || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Import Results</h3>
              
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {importResults.map((result, index) => (
                  <Card key={index} className={`p-3 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {result.contact.surname} {result.contact.name}
                          {result.contact.erf_no && ` (Erf ${result.contact.erf_no})`}
                        </span>
                      </div>
                      {!result.success && result.error && (
                        <span className="text-xs text-red-600">{result.error}</span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>✅ Successfully imported: {importResults.filter(r => r.success).length}</span>
                  <span>❌ Failed imports: {importResults.filter(r => !r.success).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
