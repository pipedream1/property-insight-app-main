
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlanTemplate } from './data/plansData';

interface PlanCardProps {
  plan: PlanTemplate;
  onSubscribe: (tier: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSubscribe }) => {
  return (
    <Card className={`${plan.popular ? 'border-primary ring-1 ring-primary' : ''} overflow-hidden`}>
      {plan.popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          RECOMMENDED FOR MANAGEMENT
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl mb-5 text-center">{plan.price}</div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.tier === "basic" ? "outline" : "default"}
          onClick={() => onSubscribe(plan.tier)}
        >
          {plan.tier === "basic" ? "Current Plan" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
