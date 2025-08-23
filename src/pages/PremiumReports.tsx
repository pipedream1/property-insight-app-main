
import React, { useState } from 'react';
import TopNavigation from '@/components/TopNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import PlansTabContent from '@/components/premium-reports/PlansTabContent';
import FeaturesTabContent from '@/components/premium-reports/FeaturesTabContent';
import ExamplesTabContent from '@/components/premium-reports/ExamplesTabContent';
import { BackButton } from '@/components/ui/back-button';

export default function PremiumReports() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // In a real implementation, this would redirect to a payment processor
    alert(`You selected the ${planId} plan. In a real implementation, this would redirect to payment processing.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Access Levels & Reporting</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the appropriate access level for your role in the property management ecosystem.
          </p>
        </div>

        <Tabs defaultValue="plans" className="mb-12">
          <TabsList className="mb-8 justify-center">
            <TabsTrigger value="plans">Access Plans</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="examples">Example Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <PlansTabContent onSubscribe={handleSubscribe} />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTabContent />
          </TabsContent>

          <TabsContent value="examples">
            <ExamplesTabContent onSubscribe={handleSubscribe} />
          </TabsContent>
        </Tabs>

        <Separator className="my-12" />

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Access Solution?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We can create tailored access plans for property management companies and homeowners associations with unique requirements.
          </p>
          <Button variant="outline">Contact Us for Custom Solutions</Button>
        </div>
      </main>
    </div>
  );
}
