import React from 'react';
import { Link } from 'wouter';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-8 bg-white pt-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
                <span>B</span>
              </div>
              <span className="ml-2 text-primary font-medium text-xl">Brand</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Best information about the company goes here but now lorem ipsum is
            </p>
            <div className="flex space-x-2">
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                <Twitter size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                <Linkedin size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                <Instagram size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Find store</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Categories</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Blogs</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Partnership</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Find store</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Categories</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Blogs</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Money Refund</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Shipping</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Contact us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">For users</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Login</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Register</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">Settings</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary">My Orders</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t mt-8">
          <div className="text-sm text-gray-500">
            © 2023 Ecommerce.
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <img src="https://cdn.worldvectorlogo.com/logos/united-states-of-america-flag-logo.svg" alt="English" className="h-4 mr-2" />
            <select className="bg-transparent border-none focus:outline-none text-sm text-gray-500">
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
