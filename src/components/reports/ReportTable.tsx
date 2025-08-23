
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { ReportType } from '@/integrations/supabase/client';
import { ComponentStatusFilter as ComponentStatusFilterType } from '@/components/reports/ComponentStatusFilter';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReportTablePagination } from './components/ReportTablePagination';
import { ReportTableRows } from './components/ReportTableRows';
import { filterReports } from './utils/reportFilters';

interface ReportTableProps {
  title: string;
  reports: ReportType[];
  isLoading: boolean;
  type: 'water' | 'component';
  statusFilter?: ComponentStatusFilterType;
}

const ITEMS_PER_PAGE = 10;

export const ReportTable: React.FC<ReportTableProps> = ({ 
  title, 
  reports, 
  isLoading, 
  type, 
  statusFilter 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredReports = useMemo(() => {
    return filterReports(reports, type, statusFilter);
  }, [reports, type, statusFilter]);

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when reports change or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredReports.length, type, statusFilter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {title}
            {statusFilter && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Filtered by {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)})
              </span>
            )}
          </span>
          {!isLoading && filteredReports.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[100px]">Month</TableHead>
                    <TableHead className="min-w-[80px]">Year</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <ReportTableRows 
                  reports={currentReports} 
                  type={type} 
                  statusFilter={statusFilter}
                />
              </Table>
            </div>

            <ReportTablePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
        
        {!isLoading && filteredReports.length > 0 && (
          <div className="p-4 bg-muted rounded-md">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Report Options</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>View:</strong> Opens the report in a new browser tab with visual formatting.<br />
                  <strong>Download:</strong> Saves the report as an HTML file that can be shared with others.
                  {type === 'component' && <><br /><strong>Go to Component:</strong> Navigate to the component section to record new inspections.</>}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
