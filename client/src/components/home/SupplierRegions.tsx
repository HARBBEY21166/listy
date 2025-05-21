import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCountryFlag } from '@/lib/utils';

interface Supplier {
  country: string;
  code: string;
  domain: string;
}

interface SupplierRegionsProps {
  suppliers: Supplier[];
}

export function SupplierRegions({ suppliers }: SupplierRegionsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Suppliers by region</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {suppliers.map((supplier, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2">
                {getCountryFlag(supplier.code)}
              </div>
              <div className="text-xs">{supplier.country}</div>
              <div className="text-xs text-gray-500">{supplier.domain}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
