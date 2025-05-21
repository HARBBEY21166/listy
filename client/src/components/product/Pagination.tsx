import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // For larger page counts, limit what we display
  const maxVisiblePages = 3;
  let visiblePages = pages;
  
  if (totalPages > maxVisiblePages) {
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
    visiblePages = pages.slice(startPage - 1, startPage + maxVisiblePages - 1);
  }
  
  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-500">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Show 10</SelectItem>
            <SelectItem value="20">Show 20</SelectItem>
            <SelectItem value="50">Show 50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="icon"
          className="w-8 h-8 p-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {visiblePages.map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            className={`w-8 h-8 p-0 ${page === currentPage ? 'bg-primary text-white' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          size="icon"
          className="w-8 h-8 p-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
