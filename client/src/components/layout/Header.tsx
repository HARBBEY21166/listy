import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Search, 
  User, 
  MessageSquare, 
  Heart, 
  ShoppingCart, 
  ChevronDown,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, navigate] = useLocation();
  const { cartItems, getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Header Row */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-lg">
                  <span>B</span>
                </div>
                <span className="ml-2 text-primary font-medium text-lg">Brand</span>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 mx-10 max-w-2xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-32 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="absolute right-16 top-0 h-full flex items-center">
                  <select className="h-full bg-transparent border-l border-gray-200 py-2 px-2 focus:outline-none text-sm">
                    <option>All categories</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full bg-primary text-white px-4 rounded-r-md"
                >
                  Search
                </Button>
              </form>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center">
                <select className="bg-transparent border-none focus:outline-none text-sm">
                  <option>English, USD</option>
                </select>
              </div>
              
              <Link href="/profile" className="text-center text-xs hidden md:block">
                <div className="h-5 w-5 mx-auto mb-1">
                  <User className="mx-auto" size={20} />
                </div>
                <span>Profile</span>
              </Link>
              
              <Link href="/messages" className="text-center text-xs hidden md:block">
                <div className="h-5 w-5 mx-auto mb-1">
                  <MessageSquare className="mx-auto" size={20} />
                </div>
                <span>Message</span>
              </Link>
              
              <Link href="/orders" className="text-center text-xs hidden md:block">
                <div className="h-5 w-5 mx-auto mb-1">
                  <Heart className="mx-auto" size={20} />
                </div>
                <span>Orders</span>
              </Link>
              
              <Link href="/cart" className="text-center text-xs hidden md:block relative">
                <div className="h-5 w-5 mx-auto mb-1">
                  <ShoppingCart className="mx-auto" size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>My cart</span>
              </Link>
              
              {/* Mobile Icons */}
              <div className="flex md:hidden items-center space-x-4">
                <User size={24} />
                <div className="relative">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Header Row - Navigation */}
      <div className="container mx-auto px-4">
        <div className="py-2">
          {/* Desktop Category Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-1 font-medium text-sm">
              <Menu className="h-4 w-4" />
              <span>All category</span>
            </div>
            <div className="text-sm">Hot offers</div>
            <div className="text-sm">Gift boxes</div>
            <div className="text-sm">Projects</div>
            <div className="text-sm">Menu item</div>
            <div className="flex items-center gap-1 text-sm">
              <span>Help</span>
              <ChevronDown className="h-3 w-3" />
            </div>
            
            {/* Right side items */}
            <div className="ml-auto flex items-center space-x-4">
              <select className="bg-transparent border-none focus:outline-none text-sm">
                <option>Ship to 🇩🇪</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden pb-1">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-full bg-primary text-white px-4 rounded-r-md"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
