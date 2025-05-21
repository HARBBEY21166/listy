import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/ui/container';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { DealSection } from '@/components/home/DealSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ServiceFeatures } from '@/components/home/ServiceFeatures';
import { SupplierRegions } from '@/components/home/SupplierRegions';
import { Newsletter } from '@/components/home/Newsletter';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { DiscountBanner } from '@/components/ui/discount-banner';
import { FeaturedProvider, useFeatured } from '@/context/FeaturedContext';

function HomePageContent() {
  // Fetch categories for the sidebar
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  const { featuredProducts, homeCategories } = useFeatured();

  // Example suppliers data
  const suppliers = [
    { country: 'Arabic Emirates', code: 'AE', domain: 'shopname.ae' },
    { country: 'Australia', code: 'AU', domain: 'shopname.au' },
    { country: 'United States', code: 'US', domain: 'shopname.us' },
    { country: 'Russia', code: 'RU', domain: 'shopname.ru' },
    { country: 'Italy', code: 'IT', domain: 'shopname.it' },
    { country: 'Denmark', code: 'DK', domain: 'denmark.com' }
  ];

  // Example service features
  const serviceFeatures = [
    { 
      title: 'Source from Industry Hubs', 
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200' 
    },
    { 
      title: 'Customize Your Products', 
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200' 
    },
    { 
      title: 'Fast, reliable shipping by ocean and air', 
      imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200' 
    },
    { 
      title: 'Product monitoring and inspection', 
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200' 
    }
  ];

  return (
    <Container>
      <MobileNavigation className="mb-4" />
      
      <Hero categories={categories} />
      
      {homeCategories.map((category, index) => (
        <Categories
          key={index}
          title={category.name}
          mainCategory={category}
          products={category.products}
        />
      ))}
      
      <DealSection 
        title="An easy way to send requests to all suppliers"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
      />
      
      <FeaturedProducts 
        title="Recommended items"
        products={featuredProducts}
      />
      
      <ServiceFeatures 
        title="Our extra services"
        features={serviceFeatures}
      />
      
      <SupplierRegions suppliers={suppliers} />
      
      <Newsletter />
    </Container>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = "Brand | Home";
  }, []);

  return (
    <FeaturedProvider>
      <HomePageContent />
    </FeaturedProvider>
  );
}
