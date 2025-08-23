
import React from 'react';
import ReportExampleCard from './ReportExampleCard';
import { Button } from '@/components/ui/button';
import { exampleReports } from './data/plansData';

interface ExamplesTabContentProps {
  onSubscribe: (tier: string) => void;
}

const ExamplesTabContent: React.FC<ExamplesTabContentProps> = ({ onSubscribe }) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {exampleReports.map((report, index) => (
          <ReportExampleCard 
            key={index}
            name={report.name}
            description={report.description}
            date={report.date}
            preview={report.preview}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Ready to upgrade your property access level?
        </p>
        <Button size="lg" onClick={() => onSubscribe('premium')}>
          Get Management Access
        </Button>
      </div>
    </>
  );
};

export default ExamplesTabContent;
