import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Thank you for subscribing to our newsletter!",
    });
    
    setEmail('');
  };

  return (
    <div className="mt-8 py-6 text-center">
      <h3 className="text-lg font-semibold mb-2">Subscribe on our newsletter</h3>
      <p className="text-sm text-text-secondary mb-4">
        Get daily news on upcoming offers from many suppliers all over the world
      </p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button 
          type="submit" 
          className="bg-primary text-white px-4 py-2 rounded-r-md"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
