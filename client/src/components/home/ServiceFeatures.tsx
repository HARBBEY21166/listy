import React from 'react';
import { Card } from '@/components/ui/card';

interface ServiceFeature {
  title: string;
  imageUrl: string;
}

interface ServiceFeaturesProps {
  title: string;
  features: ServiceFeature[];
}

export function ServiceFeatures({ title, features }: ServiceFeaturesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden">
            <img 
              src={feature.imageUrl} 
              alt={feature.title} 
              className="w-full h-40 object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-3 text-white">
              <div className="font-medium text-sm">{feature.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
