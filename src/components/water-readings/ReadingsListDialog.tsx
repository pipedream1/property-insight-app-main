
import React from 'react';
import { format } from 'date-fns';
import { Edit, Calendar, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WaterReading } from '@/types';

interface ReadingsListDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  readings: WaterReading[];
  sourceName: string;
  sourceLabel: string;
  onEditReading: (reading: WaterReading) => void;
  isLoading: boolean;
}

const ReadingsListDialog: React.FC<ReadingsListDialogProps> = ({
  isOpen,
  onOpenChange,
  readings,
  sourceName,
  sourceLabel,
  onEditReading,
  isLoading
}) => {
  const sourceReadings = readings
    .filter(r => r.source === sourceName)
    .sort((a, b) => b.readingDate.getTime() - a.readingDate.getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            {sourceLabel} - All Readings
          </DialogTitle>
          <DialogDescription>
            View and edit all readings for this water source
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading readings...</p>
            </div>
          ) : sourceReadings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No readings found for this source</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reading (L)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(reading.readingDate, 'PPP')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {typeof reading.reading === 'number' ? reading.reading.toLocaleString() + ' L' : '-'}
                    </TableCell>
                    <TableCell>
                      {reading.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditReading(reading)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingsListDialog;
