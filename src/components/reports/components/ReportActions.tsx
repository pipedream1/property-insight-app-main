
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, ArrowRight } from 'lucide-react';
import { ReportType } from '@/integrations/supabase/client';
import { useReportDownload } from '@/hooks/useReportDownload';
import { useNavigate } from 'react-router-dom';

interface ReportActionsProps {
  report: ReportType;
  type: 'water' | 'component';
}

export const ReportActions: React.FC<ReportActionsProps> = ({ report, type }) => {
  const { handleDownload, handleViewReport } = useReportDownload();
  const navigate = useNavigate();

  // Extract component type from report data
  const getComponentType = (report: ReportType): string | null => {
    if (type !== 'component' || !report.data) return null;
    
    try {
      const data = typeof report.data === 'string' 
        ? JSON.parse(report.data) 
        : report.data;
        
      return data.componentType !== 'all' ? data.componentType : null;
    } catch (e) {
      console.error('Error parsing component type:', e);
      return null;
    }
  };

  const handleNavigateToComponent = (report: ReportType) => {
    const componentType = getComponentType(report);
    if (componentType) {
      navigate(`/property-components/${componentType}`);
    } else {
      navigate('/property-components');
    }
  };

  if (report.status !== 'completed') {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 flex-wrap">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => handleViewReport(report)}
        className="inline-flex items-center whitespace-nowrap"
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">View</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => handleDownload(report)}
        className="inline-flex items-center whitespace-nowrap"
      >
        <Download className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Download</span>
      </Button>
      {type === 'component' && getComponentType(report) && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleNavigateToComponent(report)}
          className="inline-flex items-center whitespace-nowrap"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Go to Component</span>
          <span className="md:hidden">Go</span>
        </Button>
      )}
    </div>
  );
};
