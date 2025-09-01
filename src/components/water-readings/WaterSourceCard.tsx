
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Eye } from 'lucide-react';
import { WaterReading } from '@/types';

interface WaterSourceCardProps {
  sourceName: string;
  sourceLabel: string;
  latestReading: WaterReading | null;
  isLoading: boolean;
  onViewAllReadings?: () => void;
  onEditLatest?: () => void;
}

const WaterSourceCard: React.FC<WaterSourceCardProps> = ({ 
  sourceName, 
  sourceLabel, 
  latestReading, 
  isLoading,
  onViewAllReadings,
  onEditLatest
}) => {
  const toKL = (v: number) => v / 1000;
  const formatKL = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1000) return Math.round(v).toLocaleString();
    if (abs >= 10) return v.toFixed(1);
    return v.toFixed(3);
  };
  return (
    <Card key={sourceName} className="overflow-hidden">
      <CardHeader className="bg-primary-50 pb-3">
        <CardTitle className="text-lg">{sourceLabel}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
          </div>
        ) : latestReading ? (
          <div className="space-y-3">
            <div className="text-2xl font-bold">
              {formatKL(toKL(latestReading.reading))} kL
            </div>
            <div className="text-sm text-muted-foreground">
              Latest: {latestReading.readingDate.toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEditLatest}
                className="gap-1 flex-1"
              >
                <Edit className="h-3 w-3" />
                Edit Latest
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewAllReadings}
                className="gap-1 flex-1"
              >
                <Eye className="h-3 w-3" />
                View All
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No readings recorded</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterSourceCard;
