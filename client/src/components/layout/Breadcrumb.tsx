import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center text-sm mb-4 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-gray-800">{item.label}</span>
            ) : (
              <>
                <Link 
                  href={item.href || '#'} 
                  className="text-gray-500 hover:text-primary"
                >
                  {item.label}
                </Link>
                <span className="mx-2 text-gray-400">
                  <ChevronRight size={14} />
                </span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
