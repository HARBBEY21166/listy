import React from 'react';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/Rating';
import { formatPrice, truncateText, getProductPath } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Product } from './GridView';

interface ListViewProps {
  products: Product[];
}

export function ListView({ products }: ListViewProps) {
  const { addToCart } = useCart();

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <div className="flex">
            <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 mr-4">
              <Link href={getProductPath(product.id)}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between">
                <Link href={getProductPath(product.id)} className="hover:text-primary">
                  <h3 className="font-medium text-sm sm:text-base">{product.name}</h3>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                  <Heart size={18} />
                </Button>
              </div>
              
              <div className="mt-1">
                <Rating value={product.rating} />
              </div>
              
              <div className="mt-1 text-xs text-gray-500">
                <span className="text-green-600 font-medium">Free Shipping</span>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 hidden sm:block">
                {truncateText(product.name, 100)}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="font-medium">
                  {formatPrice(product.price)}
                  {product.discountPrice && (
                    <span className="ml-2 line-through text-xs text-gray-400">
                      {formatPrice(product.discountPrice)}
                    </span>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-primary border-primary"
                  onClick={() => addToCart(product.id, 1)}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
