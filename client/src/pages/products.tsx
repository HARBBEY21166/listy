import React, { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductFilter } from '@/components/ui/ProductFilter';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GridView } from '@/components/product/GridView';
import { ListView } from '@/components/product/ListView';
import { Pagination } from '@/components/product/Pagination';
import { Newsletter } from '@/components/home/Newsletter';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid, List } from 'lucide-react';
import { getQueryParams, updateSearchParams } from '@/lib/utils';

export default function ProductsPage() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const params = getQueryParams(searchParams);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Get the category from params
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined;
  const searchQuery = params.search;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  useEffect(() => {
    let title = "Products";
    if (searchQuery) {
      title = `Search: ${searchQuery} | Products`;
    } else if (categoryData) {
      title = `${categoryData.name} | Products`;
    }
    document.title = title;
  }, [searchQuery, categoryId]);

  // Fetch the category data if categoryId is provided
  const { data: categoryData } = useQuery({
    queryKey: ['/api/categories', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const response = await fetch(`/api/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return response.json();
    },
    enabled: !!categoryId
  });

  // Fetch all categories for breadcrumb and filters
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

  // Fetch products with filters
  const {
    data: productsResponse = { products: [], total: 0 },
    isLoading
  } = useQuery({
    queryKey: ['/api/products', categoryId, searchQuery, minPrice, maxPrice, currentPage, pageSize, verifiedOnly],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (searchQuery) queryParams.append('search', searchQuery);
      if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
      if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
      if (verifiedOnly) queryParams.append('verified', 'true');
      
      // Pagination
      queryParams.append('limit', pageSize.toString());
      queryParams.append('offset', ((currentPage - 1) * pageSize).toString());
      
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const products = await response.json();
      return { products, total: products.length };
    }
  });

  const products = productsResponse.products;
  const totalItems = productsResponse.total;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
  ];

  if (categoryData) {
    // If we have a parent category, add it to the breadcrumb
    if (categoryData.parentId) {
      const parentCategory = categories.find(c => c.id === categoryData.parentId);
      if (parentCategory) {
        breadcrumbItems.push({
          label: parentCategory.name,
          href: `/products?categoryId=${parentCategory.id}`
        });
      }
    }
    
    breadcrumbItems.push({
      label: categoryData.name
    });
  } else if (searchQuery) {
    breadcrumbItems.push({
      label: `Search results for "${searchQuery}"`
    });
  } else {
    breadcrumbItems.push({
      label: 'All Products'
    });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleVerifiedOnlyChange = (checked: boolean) => {
    setVerifiedOnly(checked);
    setCurrentPage(1);
  };

  // Mock data for filters
  const brands = ['Samsung', 'Apple', 'Huawei', 'Poco', 'Lenovo'];
  const features = ['Metalic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];

  return (
    <Container>
      <MobileNavigation className="mb-4" />
      
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64">
          <ProductFilter
            categories={categories}
            brands={brands}
            features={features}
            searchParams={searchParams}
          />
        </div>
        
        {/* Products Listing */}
        <div className="flex-1">
          {/* Controls bar */}
          <Card className="shadow-sm mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <span className="text-sm text-gray-500">
                    {isLoading 
                      ? 'Loading products...' 
                      : `${totalItems} items${categoryData ? ` in ${categoryData.name}` : ''}`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Checkbox 
                      id="verified-only" 
                      checked={verifiedOnly}
                      onCheckedChange={handleVerifiedOnlyChange}
                      className="mr-2"
                    />
                    <label htmlFor="verified-only" className="text-sm">Verified only</label>
                  </div>
                  <div className="flex items-center">
                    <select className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                    </select>
                  </div>
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <Button 
                      variant={viewType === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className={viewType === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-500'}
                      onClick={() => setViewType('grid')}
                    >
                      <Grid size={16} />
                    </Button>
                    <Button 
                      variant={viewType === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className={viewType === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-500'}
                      onClick={() => setViewType('list')}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Product list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            </div>
          ) : (
            viewType === 'grid' ? (
              <GridView products={products} />
            ) : (
              <ListView products={products} />
            )
          )}
          
          {/* Pagination */}
          {products.length > 0 && (
            <Pagination
              totalItems={totalItems}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
          
          {/* Newsletter */}
          <Newsletter />
        </div>
      </div>
    </Container>
  );
}
