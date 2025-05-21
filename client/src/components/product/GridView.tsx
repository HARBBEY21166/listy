import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';

export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  rating: number;
  inStock: boolean;
}

interface GridViewProps {
  products: Product[];
}

export function GridView({ products }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          discountPrice={product.discountPrice}
          rating={product.rating}
          imageUrl={product.imageUrl}
          inStock={product.inStock}
        />
      ))}
    </div>
  );
}
