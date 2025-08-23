
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface ComponentHeaderProps {
  selectedComponent: string | null;
  onAddInspection: () => void;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({ selectedComponent, onAddInspection }) => {
  const navigate = useNavigate();

  const handleBackToComponents = () => {
    navigate('/property-components');
  };

  return (
    <div className="mb-4">
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-2xl font-semibold">
          {selectedComponent?.split('-')[1] || selectedComponent}
        </h2>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBackToComponents}
          className="inline-flex items-center gap-1 text-primary hover:text-primary-700 transition-colors hover:underline cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all components
        </button>
        <Button onClick={onAddInspection}>Record Inspection</Button>
      </div>
    </div>
  );
};

export default ComponentHeader;
