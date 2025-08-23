
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReportExampleCardProps {
  name: string;
  description: string;
  date: string;
  preview: string;
}

const ReportExampleCard: React.FC<ReportExampleCardProps> = ({ name, description, date, preview }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        <img 
          src={preview} 
          alt={name} 
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2">
          {date}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Preview Sample
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportExampleCard;
