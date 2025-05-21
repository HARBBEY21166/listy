import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';

interface SavedForLaterItemProps {
  item: CartItem;
}

export function SavedForLaterItem({ item }: SavedForLaterItemProps) {
  const { moveToCart } = useCart();
  
  const handleMoveToCart = () => {
    moveToCart(item.id);
  };
  
  return (
    <Card className="overflow-hidden h-full">
      <div className="h-32 flex items-center justify-center bg-gray-100 p-2">
        <Link href={`/product-detail?id=${item.productId}`}>
          <img 
            src={item.product.imageUrl} 
            alt={item.product.name} 
            className="h-full object-contain" 
          />
        </Link>
      </div>
      <CardContent className="p-3">
        <div className="font-medium text-sm mb-1">{formatPrice(item.product.price)}</div>
        <div className="text-xs text-gray-500 mb-2">{item.product.name}</div>
        <Button 
          variant="outline" 
          className="w-full border border-primary text-primary rounded py-1 text-xs"
          onClick={handleMoveToCart}
        >
          Move to cart
        </Button>
      </CardContent>
    </Card>
  );
}
