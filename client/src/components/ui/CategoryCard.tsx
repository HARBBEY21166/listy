import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  variant?: 'small' | 'large';
}

export function CategoryCard({
  id,
  name,
  description,
  imageUrl,
  variant = 'small'
}: CategoryCardProps) {
  const isLarge = variant === 'large';
  
  return (
    <Card className={`${isLarge ? 'row-span-2' : ''} bg-neutral-50`}>
      <CardContent className={`${isLarge ? 'p-4 flex flex-col justify-between h-full' : 'p-3 flex flex-col items-center justify-center'}`}>
        {isLarge ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              {description && (
                <p className="text-sm text-gray-600 mb-2">{description}</p>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="mt-2 bg-white text-text-primary"
                asChild
              >
                <Link href={`/products?categoryId=${id}`}>
                  Source now
                </Link>
              </Button>
            </div>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={name} 
                className="mt-2 rounded-md max-w-[150px] self-end" 
              />
            )}
          </>
        ) : (
          <>
            <div className="text-sm font-medium mb-2">{name}</div>
            {description && (
              <div className="text-xs text-gray-500">{description}</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
