
import React from 'react';
import FeatureCard from './FeatureCard';
import { premiumFeatures } from './data/plansData';

const FeaturesTabContent: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {premiumFeatures.map((feature, index) => (
        <FeatureCard 
          key={index} 
          icon={feature.icon} 
          title={feature.title} 
          description={feature.description} 
        />
      ))}
    </div>
  );
};

export default FeaturesTabContent;
