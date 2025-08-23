
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

type PlaceholderTabProps = {
  title: string;
  description: string;
  message: string;
};

export default function PlaceholderTab({ title, description, message }: PlaceholderTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 text-muted-foreground">
          {message}
        </div>
      </CardContent>
    </Card>
  );
}
