import React from 'react';
import { ProductCard, ProductCardProps } from '@/components/ui/ProductCard';

interface FeaturedProductsProps {
  title: string;
  products: ProductCardProps[];
}

export function FeaturedProducts({ title, products }: FeaturedProductsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            discountPrice={product.discountPrice}
            rating={product.rating}
            imageUrl={product.imageUrl}
            variant="featured"
            inStock={product.inStock}
          />
        ))}
      </div>
    </div>
  );
}
