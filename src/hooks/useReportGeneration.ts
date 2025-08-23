
import { useState } from 'react';
import { toast } from 'sonner';
import { createReport } from '@/services/reportService';
import { generateWaterReportData, generateComponentReportData } from '@/utils/reportGenerators';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useReportGeneration(refreshReports: () => Promise<void>) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (
    type: string,
    selectedMonth: string,
    selectedYear: string,
    selectedComponent?: string,
    dateRange?: DateRange
  ) => {
    setIsGenerating(true);
    console.log(`Starting ${type} report generation...`);
    
    try {
      // Create the report with data appropriate for the report type
      let reportData;
      
      if (type === 'water') {
        console.log('Generating water report data...');
        reportData = await generateWaterReportData(selectedMonth, selectedYear, dateRange);
        console.log('Water report data generated:', reportData);
      } else {
        console.log('Generating component report data...');
        reportData = await generateComponentReportData(selectedMonth, selectedYear, selectedComponent);
        console.log('Component report data generated:', reportData);
      }
      
      if (!reportData) {
        throw new Error('Failed to generate report data');
      }
      
      // Create appropriate report name based on date range or month/year
      let reportName = '';
      if (type === 'water' && dateRange) {
        const startDateStr = dateRange.startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        const endDateStr = dateRange.endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        reportName = `Water Report - ${startDateStr} to ${endDateStr}`;
      } else {
        reportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${selectedMonth} ${selectedYear}`;
      }
      
      const newReport = {
        type: type as 'water' | 'component',
        name: reportName,
        month: selectedMonth,
        year: selectedYear,
        status: 'completed' as const,
        data: reportData
      };
      
      console.log('Creating report in database:', newReport);
      
      const result = await createReport(newReport);
      
      if (result) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`);
        console.log('Report created successfully, refreshing reports list...');
        await refreshReports();
      } else {
        throw new Error('Failed to create report in database');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to generate report: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport
  };
}
