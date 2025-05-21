import React from 'react';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/Rating';
import { formatPrice, truncateText, getProductPath } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  rating?: number;
  imageUrl?: string;
  variant?: 'grid' | 'featured';
  inStock?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  discountPrice,
  rating = 0,
  imageUrl,
  variant = 'grid',
  inStock = true
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, 1);
  };

  const productUrl = getProductPath(id);
  const isFeatured = variant === 'featured';
  
  return (
    <Card className="h-full overflow-hidden">
      <Link href={productUrl}>
        <div className="relative">
          <div className="flex justify-end p-2 absolute top-0 right-0 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
              <Heart size={18} />
            </Button>
          </div>
          <div className={`${isFeatured ? 'h-60' : 'h-40'} relative flex items-center justify-center bg-gray-100`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <div className="font-medium text-sm">{formatPrice(price)}</div>
            {discountPrice && (
              <div className="line-through text-xs text-gray-400">{formatPrice(discountPrice)}</div>
            )}
          </div>
          
          {rating > 0 && (
            <div className="mb-1">
              <Rating value={rating} />
            </div>
          )}
          
          <div className={`text-sm ${isFeatured ? 'mb-2' : 'mb-0'}`}>
            {truncateText(name, isFeatured ? 60 : 40)}
          </div>
          
          {isFeatured && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
