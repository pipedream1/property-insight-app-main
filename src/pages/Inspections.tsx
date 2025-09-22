import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useInspections } from '@/hooks/useInspections';
import { InspectionForm } from '@/components/inspections/InspectionForm';

export const Inspections: React.FC = () => {
  const { inspections, isLoading } = useInspections();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <div className="p-6">Loading inspections...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Inspections</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Inspection
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inspections.map((inspection) => (
          <Card key={inspection.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Property {inspection.property_id}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(inspection.inspection_date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">
                <strong>Inspector:</strong> {inspection.inspector_name}
              </p>
              {inspection.notes && (
                <p className="text-sm mb-2">
                  <strong>Notes:</strong> {inspection.notes}
                </p>
              )}
              <p className="text-sm mb-2">
                <strong>Status:</strong> {inspection.status}
              </p>
              {inspection.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Photos ({inspection.photos.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {inspection.photos.slice(0, 4).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                  {inspection.photos.length > 4 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{inspection.photos.length - 4} more photos
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {inspections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No inspections found. Add your first inspection!</p>
        </div>
      )}

      <InspectionForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        onInspectionSaved={() => {
          // Refetch will happen automatically via React Query
        }}
      />
    </div>
  );
};

export default Inspections;
