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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
                <span>B</span>
              </div>
              <span className="ml-2 text-primary font-medium text-xl">Brand</span>
            </Link>
            
            {/* Category menu (desktop) */}
            <div className="hidden md:flex ml-6 space-x-1">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Menu className="h-4 w-4" />
                <span>All category</span>
              </Button>
              <Button variant="ghost" size="sm">Hot offers</Button>
              <Button variant="ghost" size="sm">Gift boxes</Button>
              <Button variant="ghost" size="sm">Projects</Button>
              <Button variant="ghost" size="sm">Menu item</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    Help
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>FAQ</DropdownMenuItem>
                  <DropdownMenuItem>Contact Us</DropdownMenuItem>
                  <DropdownMenuItem>Shipping Information</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-6">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="absolute right-16 top-0 h-full flex items-center">
                <select className="h-full bg-white border-l border-gray-300 py-2 px-2 focus:outline-none text-sm">
                  <option>All category</option>
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
          
          {/* User Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <select className="bg-transparent border-none focus:outline-none text-sm">
                <option>English, USD</option>
              </select>
            </div>
            
            <div className="hidden md:flex items-center">
              <select className="bg-transparent border-none focus:outline-none text-sm">
                <option>Ship to 🇩🇪</option>
              </select>
            </div>
            
            <Link href="/profile" className="text-center text-sm">
              <div className="h-6 w-6 mx-auto">
                <User className="mx-auto" size={24} />
              </div>
              <span className="hidden md:block text-xs">Profile</span>
            </Link>
            
            <Link href="/messages" className="text-center text-sm">
              <div className="h-6 w-6 mx-auto">
                <MessageSquare className="mx-auto" size={24} />
              </div>
              <span className="hidden md:block text-xs">Message</span>
            </Link>
            
            <Link href="/orders" className="text-center text-sm">
              <div className="h-6 w-6 mx-auto">
                <Heart className="mx-auto" size={24} />
              </div>
              <span className="hidden md:block text-xs">Orders</span>
            </Link>
            
            <Link href="/cart" className="text-center text-sm relative">
              <div className="h-6 w-6 mx-auto">
                <ShoppingCart className="mx-auto" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-xs">My cart</span>
            </Link>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
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
    </header>
  );
}
