import React from 'react';
import { Link } from 'wouter';
import { CartItem as CartItemType } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();
  
  const handleQuantityChange = (value: string) => {
    updateQuantity(item.id, parseInt(value));
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  const handleSaveForLater = () => {
    saveForLater(item.id);
  };
  
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex">
        <Link href={`/product-detail?id=${item.productId}`}>
          <img 
            src={item.product.imageUrl} 
            alt={item.product.name} 
            className="w-20 h-20 object-cover rounded-md"
          />
        </Link>
        
        <div className="ml-4 flex-1">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">{item.product.name}</h3>
              <div className="text-xs text-gray-500 mb-2">
                {item.product.size && `Size: ${item.product.size}, `}
                {item.product.color && `Color: ${item.product.color}, `}
                {item.product.material && `Material: ${item.product.material}`}
              </div>
              <div className="text-xs text-gray-500">
                {item.product.seller && `Seller: ${item.product.seller}`}
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <div className="font-medium text-sm">{formatPrice(item.product.price)}</div>
              <div className="mt-3 flex md:justify-end">
                <Select
                  value={item.quantity.toString()}
                  onValueChange={handleQuantityChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                      <SelectItem key={qty} value={qty.toString()}>
                        Qty: {qty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex mt-3">
            <Button 
              variant="link" 
              className="text-red-500 p-0 h-auto text-xs mr-4"
              onClick={handleRemove}
            >
              Remove
            </Button>
            <Button 
              variant="link" 
              className="text-primary p-0 h-auto text-xs"
              onClick={handleSaveForLater}
            >
              Save for later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
