
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InspectionType } from '@/types/inspection';
import { ComponentCondition } from '@/types';
import { format } from 'date-fns';
import { createMaintenanceTask } from '@/services/maintenanceService';

export const useInspectionManagement = (
  onInspectionSaved: () => void
) => {
  const [isAddingInspection, setIsAddingInspection] = useState(false);
  const [isEditingInspection, setIsEditingInspection] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<InspectionType | null>(null);
  const [inspectionToDelete, setInspectionToDelete] = useState<InspectionType | null>(null);
  
  const handleSubmitInspection = async (
    componentType: string,
    componentName: string,
    inspectionDate: Date,
    inspectionCondition: ComponentCondition,
    inspectionNotes: string,
    capturedImages: string[]
  ) => {
    try {
      // Store a proper DATE value (YYYY-MM-DD) to match the column type
      const dateOnly = format(inspectionDate, 'yyyy-MM-dd');

      // Store all image URLs as a JSON array - these are now Supabase Storage URLs
      const photoUrls = capturedImages.length > 0 ? JSON.stringify(capturedImages) : null;

      const componentData = {
        component_type: componentType,
        component_name: componentName,
        date: dateOnly,
        condition: inspectionCondition,
        comment: inspectionNotes,
        photo_url: photoUrls,
        photo_taken: capturedImages.length > 0
      };
      
      let result;
      
      if (isEditingInspection && currentInspection) {
        const { error } = await supabase
          .from('property_components')
          .update(componentData)
          .eq('id', Number(currentInspection.id)); // Convert string id to number
          
        result = { error };
      } else {
        result = await supabase
          .from('property_components')
          .insert(componentData);
      }
        
      if (result.error) {
        console.error('Error saving inspection:', result.error);
        toast.error('Failed to save inspection record');
        return;
      }
      
      // If condition is "Maintenance Required", create a maintenance task
      if (inspectionCondition === ComponentCondition.MAINTENANCE_REQUIRED) {
        const taskDescription = inspectionNotes || `Maintenance required for ${componentType} ${componentName}`;
        
        await createMaintenanceTask({
          componentType: componentData.component_type,
          componentName: componentData.component_name,
          description: taskDescription,
          inspectionId: currentInspection?.id ? Number(currentInspection.id) : undefined, // Convert string id to number or undefined
          priority: 'Medium'
        });
        
        toast.success('Maintenance task created');
      }
      
      toast.success(isEditingInspection ? 'Inspection record updated' : 'Inspection record saved');
      setIsAddingInspection(false);
      setIsEditingInspection(false);
      setCurrentInspection(null);
      
      // Call the callback to refresh inspections
      onInspectionSaved();
    } catch (error) {
      console.error('Error saving inspection:', error);
      toast.error('Failed to save inspection record');
    }
  };
  
  const handleEditInspection = (inspection: InspectionType) => {
    setCurrentInspection(inspection);
    setIsEditingInspection(true);
    setIsAddingInspection(true);
  };
  
  const handleDeleteInspection = async () => {
    if (!inspectionToDelete) return;
    
    try {
      const { error } = await supabase
        .from('property_components')
        .delete()
        .eq('id', Number(inspectionToDelete.id)); // Convert string id to number
        
      if (error) {
        console.error('Error deleting inspection:', error);
        toast.error('Failed to delete inspection record');
        return;
      }
      
      toast.success('Inspection record deleted');
      setInspectionToDelete(null);
      
      // Call the callback to refresh inspections
      onInspectionSaved();
    } catch (error) {
      console.error('Error deleting inspection:', error);
      toast.error('Failed to delete inspection record');
    }
  };
  
  const handleImageClick = (imageUrl: string, setSelectedImage: (url: string | null) => void) => {
    setSelectedImage(imageUrl);
  };

  return {
    // State
    isAddingInspection,
    isEditingInspection,
    currentInspection,
    inspectionToDelete,
    
    // Setters
    setIsAddingInspection,
    setIsEditingInspection,
    setCurrentInspection,
    setInspectionToDelete,
    
    // Handlers
    handleSubmitInspection,
    handleEditInspection,
    handleDeleteInspection,
    handleImageClick
  };
};
