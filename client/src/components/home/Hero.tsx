import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryPath } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
}

interface HeroProps {
  categories: Category[];
}

export function Hero({ categories }: HeroProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Categories Sidebar */}
      <Card className="hidden md:block w-64 shadow-sm">
        <CardContent className="p-4">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  href={getCategoryPath(category.id)}
                  className="flex items-center text-sm py-1.5 hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Main Banner */}
        <div className="bg-green-100 rounded-lg p-6 md:flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Latest trending</h2>
            <h1 className="text-2xl font-bold mb-4">Electronic items</h1>
            <Button variant="secondary" className="bg-white text-text-primary">
              Learn more
            </Button>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200" 
            alt="Headphones and electronic accessories" 
            className="mt-4 md:mt-0 rounded-md max-w-[200px]" 
          />
        </div>
        
        {/* Offer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">Smart watches</div>
              <div className="text-xs text-success">-25%</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">Laptops</div>
              <div className="text-xs text-success">-15%</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">GoPro cameras</div>
              <div className="text-xs text-success">-40%</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">Headphones</div>
              <div className="text-xs text-success">-25%</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Promo Cards */}
      <div className="hidden md:flex flex-col gap-4 w-64">
        <Card className="bg-orange-100 shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm font-medium">Get US $10 off with a new supplier</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm font-medium">Send quotes with supplier preferences</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
