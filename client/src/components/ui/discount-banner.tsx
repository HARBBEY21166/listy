import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiscountBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
}

export function DiscountBanner({ 
  title, 
  subtitle, 
  buttonText, 
  onButtonClick,
  className = ""
}: DiscountBannerProps) {
  return (
    <Card className={`bg-primary rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm">{subtitle}</p>
        </div>
        <Button 
          onClick={onButtonClick} 
          className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}
