import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';

interface DealSectionProps {
  title: string;
  description: string;
}

export function DealSection({ title, description }: DealSectionProps) {
  return (
    <Card className="mt-8 bg-primary overflow-hidden text-white">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-sm mb-4">{description}</p>
        </div>
        <div className="md:w-1/2 bg-white p-6 text-gray-900">
          <h3 className="text-lg font-semibold mb-4">Send quote to suppliers</h3>
          <form className="space-y-3">
            <div>
              <Input 
                type="text" 
                placeholder="What item you need?" 
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                type="text" 
                placeholder="Quantity" 
                className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Select defaultValue="pcs">
                <SelectTrigger className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pcs</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-primary text-white">
              Send inquiry
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
