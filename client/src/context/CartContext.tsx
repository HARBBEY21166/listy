import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  description?: string;
  categoryId?: number;
  inStock?: boolean;
  seller?: string;
  material?: string;
  size?: string;
  color?: string;
};

export type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  savedForLater: boolean;
  product: CartProduct;
};

interface CartContextValue {
  cartItems: CartItem[];
  savedItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  saveForLater: (itemId: number) => Promise<void>;
  moveToCart: (itemId: number) => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
  calculateDiscount: () => number;
  calculateTax: () => number;
  getTotal: () => number;
}

// Create a default empty cart context value
const defaultCartContext: CartContextValue = {
  cartItems: [],
  savedItems: [],
  isLoading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  saveForLater: async () => {},
  moveToCart: async () => {},
  getTotalItems: () => 0,
  getSubtotal: () => 0,
  calculateDiscount: () => 0,
  calculateTax: () => 0,
  getTotal: () => 0
};

const CartContext = createContext<CartContextValue>(defaultCartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch cart items on mount
  useEffect(() => {
    fetchCartItems();
    fetchSavedItems();
  }, []);
  
  async function fetchCartItems() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function fetchSavedItems() {
    try {
      const response = await fetch('/api/saved-items', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved items');
      }
      
      const data = await response.json();
      setSavedItems(data);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      toast({
        title: "Error",
        description: "Failed to load saved items",
        variant: "destructive",
      });
    }
  }
  
  async function addToCart(productId: number, quantity: number = 1) {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        quantity,
        savedForLater: false
      });
      
      const newItem = await response.json();
      
      // Check if the item is already in the cart
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = newItem;
        setCartItems(updatedItems);
      } else {
        // Add new item
        setCartItems(prev => [...prev, newItem]);
      }
      
      toast({
        title: "Success",
        description: "Item added to cart",
      });
      
      // Invalidate the cart query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function updateQuantity(itemId: number, quantity: number) {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
      const updatedItem = await response.json();
      
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function removeFromCart(itemId: number) {
    try {
      setIsLoading(true);
      
      await apiRequest('DELETE', `/api/cart/${itemId}`);
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function clearCart() {
    try {
      setIsLoading(true);
      
      await apiRequest('DELETE', '/api/cart');
      
      setCartItems([]);
      
      toast({
        title: "Success",
        description: "Cart cleared successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function saveForLater(itemId: number) {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', `/api/cart/${itemId}/save-for-later`);
      const savedItem = await response.json();
      
      // Remove from cart items
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Add to saved items
      setSavedItems(prev => [...prev, savedItem]);
      
      toast({
        title: "Success",
        description: "Item saved for later",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-items'] });
    } catch (error) {
      console.error('Error saving item for later:', error);
      toast({
        title: "Error",
        description: "Failed to save item for later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function moveToCart(itemId: number) {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', `/api/saved-items/${itemId}/move-to-cart`);
      const movedItem = await response.json();
      
      // Remove from saved items
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
      
      // Add to cart items
      setCartItems(prev => [...prev, movedItem]);
      
      toast({
        title: "Success",
        description: "Item moved to cart",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-items'] });
    } catch (error) {
      console.error('Error moving item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to move item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Helper functions for cart calculations
  function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  function getSubtotal() {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
  
  function calculateDiscount() {
    // Example discount calculation - 5% of the subtotal
    return Math.round(getSubtotal() * 0.05 * 100) / 100;
  }
  
  function calculateTax() {
    // Example tax calculation - 10% of the subtotal after discount
    return Math.round((getSubtotal() - calculateDiscount()) * 0.1 * 100) / 100;
  }
  
  function getTotal() {
    return getSubtotal() - calculateDiscount() + calculateTax();
  }
  
  return (
    <CartContext.Provider value={{
      cartItems,
      savedItems,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      saveForLater,
      moveToCart,
      getTotalItems,
      getSubtotal,
      calculateDiscount,
      calculateTax,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
