import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  return (
    <div className={`md:hidden overflow-x-auto whitespace-nowrap pb-4 ${className}`}>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        All category
      </Button>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        Hot offers
      </Button>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        Gift boxes
      </Button>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        Projects
      </Button>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        Menu item
      </Button>
      <Button variant="ghost" size="sm" className="px-3 py-2 text-sm inline-block">
        Help
      </Button>
    </div>
  );
}
