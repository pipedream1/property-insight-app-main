
import React from 'react';
import PlanCard from './PlanCard';
import { reportTemplates } from './data/plansData';

interface PlansTabContentProps {
  onSubscribe: (tier: string) => void;
}

const PlansTabContent: React.FC<PlansTabContentProps> = ({ onSubscribe }) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reportTemplates.map((template) => (
        <PlanCard 
          key={template.id} 
          plan={template} 
          onSubscribe={onSubscribe} 
        />
      ))}
    </div>
  );
};

export default PlansTabContent;
