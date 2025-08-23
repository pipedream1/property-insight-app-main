
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ReportType } from '@/integrations/supabase/client';
import { ComponentStatusFilter as ComponentStatusFilterType } from '@/components/reports/ComponentStatusFilter';
import { ReportActions } from './ReportActions';

interface ReportTableRowsProps {
  reports: ReportType[];
  type: 'water' | 'component';
  statusFilter?: ComponentStatusFilterType;
}

export const ReportTableRows: React.FC<ReportTableRowsProps> = ({ 
  reports, 
  type, 
  statusFilter 
}) => {
  return (
    <TableBody>
      {reports.map((report) => (
        <TableRow key={report.id}>
          <TableCell className="font-medium">{report.name}</TableCell>
          <TableCell>{report.month}</TableCell>
          <TableCell>{report.year}</TableCell>
          <TableCell>
            <span className={
              report.status === 'completed' 
                ? 'text-green-600 font-medium' 
                : report.status === 'failed' 
                  ? 'text-red-600 font-medium' 
                  : 'text-amber-600 font-medium'
            }>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <ReportActions report={report} type={type} />
          </TableCell>
        </TableRow>
      ))}
      {reports.length === 0 && (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
            {statusFilter ? `No reports found with ${statusFilter} status components` : 'No reports available'}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
