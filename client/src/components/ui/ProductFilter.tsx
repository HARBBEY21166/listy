import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { updateSearchParams, getQueryParams } from '@/lib/utils';

interface ProductFilterProps {
  categories: Array<{ id: number; name: string }>;
  brands: Array<string>;
  features: Array<string>;
  searchParams: URLSearchParams;
}

export function ProductFilter({
  categories,
  brands,
  features,
  searchParams
}: ProductFilterProps) {
  const [_, navigate] = useLocation();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  const params = getQueryParams(searchParams);
  
  const handleCategoryClick = (categoryId: number) => {
    const newParams = updateSearchParams(searchParams, { categoryId });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handleBrandToggle = (brand: string) => {
    // This is a simplified implementation
    const newParams = updateSearchParams(searchParams, { brand });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handleFeatureToggle = (feature: string) => {
    // This is a simplified implementation
    const newParams = updateSearchParams(searchParams, { feature });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handlePriceFilter = () => {
    const newParams = updateSearchParams(searchParams, {
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handleConditionChange = (condition: string) => {
    const newParams = updateSearchParams(searchParams, { condition });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handleRatingFilter = (rating: number) => {
    const newParams = updateSearchParams(searchParams, { rating });
    navigate(`/products?${newParams.toString()}`);
  };
  
  const handleClearFilters = () => {
    navigate('/products');
  };
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Category</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            {categories.slice(0, 4).map((category) => (
              <div 
                key={category.id} 
                className={`text-sm mb-1 cursor-pointer hover:text-primary ${params.categoryId === category.id.toString() ? 'font-medium' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </div>
            ))}
            <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto mt-1">
              See all
            </Button>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        {/* Brands Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Brands</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            {brands.slice(0, 5).map((brand, index) => (
              <div key={index} className="flex items-center mb-1">
                <input 
                  type="checkbox" 
                  id={`brand-${index}`} 
                  className="mr-2"
                  checked={params.brand === brand}
                  onChange={() => handleBrandToggle(brand)}
                />
                <label htmlFor={`brand-${index}`} className="text-sm">{brand}</label>
              </div>
            ))}
            <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto mt-1">
              See all
            </Button>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        {/* Features Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Features</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            {features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-center mb-1">
                <input 
                  type="checkbox" 
                  id={`feature-${index}`} 
                  className="mr-2"
                  checked={params.feature === feature}
                  onChange={() => handleFeatureToggle(feature)}
                />
                <label htmlFor={`feature-${index}`} className="text-sm">{feature}</label>
              </div>
            ))}
            <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto mt-1">
              See all
            </Button>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        {/* Price Range Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Price range</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Min</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Max</label>
                <Input
                  type="number"
                  placeholder="9999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                />
              </div>
            </div>
            <Button 
              onClick={handlePriceFilter} 
              size="sm" 
              className="mt-2 bg-primary text-white"
            >
              Apply
            </Button>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        {/* Condition Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Condition</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            {['Any', 'Refurbished', 'Brand new', 'Old items'].map((condition, index) => (
              <div key={index} className="flex items-center mb-1">
                <input 
                  type="radio" 
                  name="condition" 
                  id={`condition-${index}`} 
                  checked={params.condition === condition.toLowerCase().replace(' ', '-')}
                  onChange={() => handleConditionChange(condition.toLowerCase().replace(' ', '-'))}
                  className="mr-2" 
                />
                <label htmlFor={`condition-${index}`} className="text-sm">{condition}</label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-3" />
        
        {/* Ratings Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ratings</h3>
            <ChevronUp className="h-4 w-4" />
          </div>
          <div className="mt-2">
            {[5, 4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center mb-1">
                <input 
                  type="checkbox" 
                  id={`rating-${rating}`} 
                  className="mr-2"
                  checked={params.rating === rating.toString()}
                  onChange={() => handleRatingFilter(rating)}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                  <div className="flex text-amber-400">
                    {Array(rating).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                    {Array(5 - rating).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  {rating < 5 && <span className="ml-1">& above</span>}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {Object.keys(params).length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={handleClearFilters}
          >
            Clear all filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
