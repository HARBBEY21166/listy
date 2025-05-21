import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { Button } from '@/components/ui/button';

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface ProductCategory {
  id: number;
  name: string;
  price?: string;
}

interface CategoriesProps {
  title: string;
  mainCategory: Category;
  products: ProductCategory[];
}

export function Categories({ title, mainCategory, products }: CategoriesProps) {
  return (
    <div className="mt-8">
      <Card className="bg-neutral-light shadow-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Link href={`/products?categoryId=${mainCategory.id}`} className="text-sm text-primary">
              Source now
            </Link>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Categories Preview */}
            <CategoryCard
              id={mainCategory.id}
              name={mainCategory.name}
              description={mainCategory.description}
              imageUrl={mainCategory.imageUrl}
              variant="large"
            />
            
            {/* Product Cards */}
            {products.map((product, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="text-sm font-medium mb-2">{product.name}</div>
                  {product.price && (
                    <div className="text-xs text-gray-500">From {product.price}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
