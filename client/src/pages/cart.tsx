import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/components/ui/CartItem';
import { SavedForLaterItem } from '@/components/ui/SavedForLaterItem';
import { DiscountBanner } from '@/components/ui/discount-banner';
import { ArrowLeft, Lock, Headphones, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { 
    cartItems, 
    savedItems, 
    isLoading, 
    removeFromCart, 
    clearCart,
    getSubtotal,
    calculateDiscount,
    calculateTax,
    getTotal
  } = useCart();
  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = "My Cart | Brand";
  }, []);

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout page
    alert('Checkout functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-xl font-semibold mb-4">
        My cart ({cartItems.length})
      </h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <Card className="shadow-sm overflow-hidden mb-4">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-4">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm overflow-hidden mb-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </Card>
          )}
          
          <div className="flex mb-8">
            <Link href="/products" className="flex items-center text-primary text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to shop
            </Link>
            {cartItems.length > 0 && (
              <Button 
                variant="link" 
                className="ml-auto text-blue-700 text-sm"
                onClick={() => clearCart()}
              >
                Remove all
              </Button>
            )}
          </div>
          
          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Secure payment</div>
                  <div className="text-xs text-gray-500">Have you ever finally just</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Customer support</div>
                  <div className="text-xs text-gray-500">Have you ever finally just</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Free delivery</div>
                  <div className="text-xs text-gray-500">Have you ever finally just</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Saved For Later */}
          {savedItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Saved for later</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {savedItems.map((item) => (
                  <SavedForLaterItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
          
          {/* Super Discount Banner */}
          <DiscountBanner
            title="Super discount on more than 100 USD"
            subtitle="Have you ever finally just write dummy info"
            buttonText="Shop now"
          />
        </div>
        
        {/* Checkout Summary */}
        <div className="w-full md:w-80">
          <Card className="shadow-sm mb-4">
            <CardContent className="p-4">
              <h2 className="font-medium mb-4">Have a coupon?</h2>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Add coupon"
                  className="flex-1 border border-gray-300 rounded-l-md"
                />
                <Button 
                  variant="outline" 
                  className="rounded-l-none border-l-0 text-primary border-primary"
                >
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Discount:</span>
                  <span className="text-sm font-medium text-red-500">
                    - {formatPrice(calculateDiscount())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax:</span>
                  <span className="text-sm font-medium text-green-500">
                    + {formatPrice(calculateTax())}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatPrice(getTotal())}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white" 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Checkout
              </Button>
              
              <div className="flex justify-center space-x-2 mt-4">
                <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="h-6" />
                <img src="https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" alt="Mastercard" className="h-6" />
                <img src="https://cdn.worldvectorlogo.com/logos/paypal-2.svg" alt="PayPal" className="h-6" />
                <img src="https://cdn.worldvectorlogo.com/logos/apple-pay.svg" alt="Apple Pay" className="h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
