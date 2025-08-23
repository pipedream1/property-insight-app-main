
import React, { useState } from 'react';
import ComponentHeader from './component-detail/ComponentHeader';
import InspectionsCard from './component-detail/InspectionsCard';
import InspectionDialog from './component-detail/InspectionDialog';
import DeleteInspectionDialog from './component-detail/DeleteInspectionDialog';
import { useInspectionManagement } from '@/hooks/useInspectionManagement';
import { ImageDialog } from './inspection/ImageDialog';
import { InspectionType } from '@/types/inspection';

interface ComponentDetailProps {
  selectedComponent: string | null;
  recentInspections: InspectionType[];
  isLoadingInspections: boolean;
  onInspectionSaved: () => void;
}

const ComponentDetail: React.FC<ComponentDetailProps> = ({ 
  selectedComponent, 
  recentInspections, 
  isLoadingInspections,
  onInspectionSaved
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    isAddingInspection,
    setIsAddingInspection,
    isEditingInspection,
    setIsEditingInspection,
    currentInspection,
    setCurrentInspection,
    inspectionToDelete,
    setInspectionToDelete,
    handleSubmitInspection,
    handleEditInspection,
    handleDeleteInspection,
  } = useInspectionManagement(onInspectionSaved);

  // Extract component type and name from the selected component
  const componentParts = selectedComponent?.split('-');
  const componentType = componentParts?.[0] || '';
  const componentName = componentParts?.[1] || '';

  const handleInspectionSubmit = async (
    inspectionDate: Date,
    inspectionCondition: any,
    inspectionNotes: string,
    capturedImages: string[]
  ) => {
    await handleSubmitInspection(
      componentType,
      componentName,
      inspectionDate,
      inspectionCondition,
      inspectionNotes,
      capturedImages
    );
  };

  return (
    <div className="space-y-6">
      <ComponentHeader 
        selectedComponent={selectedComponent} 
        onAddInspection={() => setIsAddingInspection(true)}
      />

      <InspectionsCard 
        recentInspections={recentInspections}
        isLoadingInspections={isLoadingInspections}
        onEditInspection={handleEditInspection}
        onDeleteInspection={(inspection) => setInspectionToDelete(inspection)}
      />
      
      <InspectionDialog 
        isOpen={isAddingInspection} 
        onOpenChange={(open) => {
          setIsAddingInspection(open);
          if (!open) {
            setIsEditingInspection(false);
            setCurrentInspection(null);
          }
        }}
        onSubmit={handleInspectionSubmit}
        currentInspection={currentInspection}
        isEditing={isEditingInspection}
      />
      
      <DeleteInspectionDialog 
        inspectionToDelete={inspectionToDelete}
        onOpenChange={(open) => !open && setInspectionToDelete(null)}
        onDelete={handleDeleteInspection}
      />

      <ImageDialog 
        selectedImage={selectedImage} 
        onOpenChange={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default ComponentDetail;
