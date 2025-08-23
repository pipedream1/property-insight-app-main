
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import { DateRangeSelector } from './DateRangeSelector';
import { MonthYearSelector } from './MonthYearSelector';
import { ComponentTypeSelector } from './ComponentTypeSelector';
import { ReportTypeSelector } from './ReportTypeSelector';

interface ReportFormProps {
  type: 'water' | 'component';
  onReportGenerated: () => Promise<void>;
}

export const ReportForm: React.FC<ReportFormProps> = ({ type, onReportGenerated }) => {
  const { isGenerating, generateReport } = useReportGeneration(onReportGenerated);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedComponent, setSelectedComponent] = useState('all');
  
  // State for date range selection
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [useCustomDates, setUseCustomDates] = useState(false);
  
  const handleGenerateReport = () => {
    if (type === 'water' && useCustomDates && startDate && endDate) {
      // For water reports with custom date range
      generateReport(
        type, 
        selectedMonth, 
        selectedYear, 
        selectedComponent,
        {
          startDate,
          endDate
        }
      );
    } else {
      // Default behavior for non-custom dates or component reports
      generateReport(type, selectedMonth, selectedYear, selectedComponent);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          Generate {type === 'water' ? 'Water Usage' : 'Component'} Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          {type === 'water' 
            ? 'Generate a new report showing water usage from all sources for the selected period.'
            : 'Generate a new report showing the condition of all property components.'}
        </p>
        
        {type === 'water' && (
          <div className="mb-4">
            <ReportTypeSelector 
              useCustomDates={useCustomDates} 
              setUseCustomDates={setUseCustomDates} 
            />
          </div>
        )}
        
        {type === 'water' && useCustomDates ? (
          <DateRangeSelector 
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <MonthYearSelector
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />

            {type === 'component' && (
              <ComponentTypeSelector
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
              />
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
