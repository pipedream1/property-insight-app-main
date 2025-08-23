
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopNavigation from '@/components/TopNavigation';
import { ReportForm } from '@/components/reports/ReportForm';
import { ReportTable } from '@/components/reports/ReportTable';
import { useOptimizedReports } from '@/hooks/useOptimizedReports';
import { FileBarChart, Download, ExternalLink, Eye } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ComponentStatusFilter, { ComponentStatusFilter as ComponentStatusFilterType } from '@/components/reports/ComponentStatusFilter';
import { BackButton } from '@/components/ui/back-button';

const Reports = () => {
  const { reports, isLoading, error, fetchReports } = useOptimizedReports();
  const [componentStatusFilter, setComponentStatusFilter] = useState<ComponentStatusFilterType>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
        <p className="text-muted-foreground text-center mb-6">
          Generate, view, and download reports for your water usage and property components.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
          <FileBarChart className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">How to use reports</h3>
            <p className="text-sm text-blue-700">
              1. Select the type of report you want to generate<br />
              2. Fill in the required information and click "Generate Report"<br />
              3. Once generated, find your report in the table below<br />
              4. Click <span className="inline-flex items-center"><Eye className="h-3 w-3 mr-1" /> View</span> to open the report in a new tab<br />
              5. Click <span className="inline-flex items-center"><Download className="h-3 w-3 mr-1" /> Download</span> to save the report as a file to share with others
            </p>
          </div>
        </div>

        <Tabs defaultValue="water">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="water" className="justify-center">Water Reports</TabsTrigger>
            <TabsTrigger value="component" className="justify-center">Component Reports</TabsTrigger>
          </TabsList>

          <ErrorBoundary>
            <TabsContent value="water" className="mt-6">
              <ReportForm type="water" onReportGenerated={fetchReports} />
              <div className="h-6" />
              <ReportTable 
                title="Available Water Reports" 
                reports={reports} 
                isLoading={isLoading} 
                type="water" 
              />
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-md">
                <h3 className="font-medium text-amber-800 mb-1">About Water Reports</h3>
                <p className="text-sm text-amber-700">
                  Water reports show usage data from Borehole Water and Knysna Municipality sources.
                  Total consumption is calculated from all sources combined.
                </p>
              </div>
            </TabsContent>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <TabsContent value="component" className="mt-6">
              <ReportForm type="component" onReportGenerated={fetchReports} />
              <div className="h-6" />
              
              {/* Add the component status filter */}
              <div className="mb-4 p-4 bg-white border border-gray-200 rounded-md">
                <ComponentStatusFilter 
                  statusFilter={componentStatusFilter}
                  setStatusFilter={setComponentStatusFilter}
                />
              </div>
              
              <ReportTable 
                title="Available Component Reports" 
                reports={reports} 
                isLoading={isLoading} 
                type="component" 
                statusFilter={componentStatusFilter}
              />
            </TabsContent>
          </ErrorBoundary>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
