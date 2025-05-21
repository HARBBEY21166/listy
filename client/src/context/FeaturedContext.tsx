import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  rating: number;
  inStock: boolean;
}

interface FeaturedCategoryProduct {
  id: number;
  name: string;
  price: string;
}

export interface FeaturedCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  products: FeaturedCategoryProduct[];
}

interface FeaturedContextType {
  featuredProducts: FeaturedProduct[];
  homeCategories: FeaturedCategory[];
  isLoading: boolean;
  error: Error | null;
}

const FeaturedContext = createContext<FeaturedContextType | undefined>(undefined);

export function FeaturedProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [homeCategories, setHomeCategories] = useState<FeaturedCategory[]>([
    {
      id: 3,
      name: "Home and outdoor items",
      description: "Furniture, kitchen items, and other home accessories",
      imageUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      products: [
        { id: 101, name: "Soft chairs", price: "From USD 19" },
        { id: 102, name: "Sofa & chair", price: "From USD 19" },
        { id: 103, name: "Kitchen dishes", price: "From USD 19" },
        { id: 104, name: "Smart watches", price: "From USD 19" },
        { id: 105, name: "Kitchen mixer", price: "From USD 100" },
        { id: 106, name: "Blenders", price: "From USD 39" },
        { id: 107, name: "Home appliance", price: "From USD 19" },
        { id: 108, name: "Coffee maker", price: "From USD 50" }
      ]
    },
    {
      id: 1,
      name: "Consumer electronics and gadgets",
      description: "Latest electronic items and gadgets for daily use",
      imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      products: [
        { id: 201, name: "Smart watches", price: "From USD 19" },
        { id: 202, name: "Cameras", price: "From USD 89" },
        { id: 203, name: "Headphones", price: "From USD 10" },
        { id: 204, name: "Smart watches", price: "From USD 19" },
        { id: 205, name: "Gaming set", price: "From USD 35" },
        { id: 206, name: "Laptops & PC", price: "From USD 340" },
        { id: 207, name: "Smartphones", price: "From USD 19" },
        { id: 208, name: "Electric kettle", price: "From USD 240" }
      ]
    }
  ]);

  const { 
    data: featuredProducts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/featured-products'],
    queryFn: async () => {
      const response = await fetch('/api/featured-products?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch featured products",
        variant: "destructive",
      });
    }
  });

  return (
    <FeaturedContext.Provider value={{
      featuredProducts,
      homeCategories,
      isLoading,
      error: error as Error | null
    }}>
      {children}
    </FeaturedContext.Provider>
  );
}

export function useFeatured() {
  const context = useContext(FeaturedContext);
  if (context === undefined) {
    throw new Error('useFeatured must be used within a FeaturedProvider');
  }
  return context;
}
