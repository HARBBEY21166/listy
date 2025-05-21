import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { getStarRating } from '@/lib/utils';

interface RatingProps {
  value: number;
  reviews?: number;
  sales?: number;
  className?: string;
  showCount?: boolean;
  showReviews?: boolean;
  showSales?: boolean;
  size?: 'sm' | 'md';
}

export function Rating({
  value,
  reviews,
  sales,
  className = '',
  showCount = true,
  showReviews = false,
  showSales = false,
  size = 'sm'
}: RatingProps) {
  const { full, half, empty } = getStarRating(value);
  
  const starSize = size === 'sm' ? 14 : 18;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex text-amber-400 mr-1">
        {Array(full).fill(0).map((_, i) => (
          <Star key={`full-${i}`} size={starSize} fill="currentColor" />
        ))}
        
        {half > 0 && <StarHalf key="half" size={starSize} fill="currentColor" />}
        
        {Array(empty).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} size={starSize} className="text-gray-300" />
        ))}
      </div>
      
      {showCount && <span className={`${textSize} text-amber-500 mr-3`}>{value.toFixed(1)}</span>}
      
      {showReviews && reviews !== undefined && (
        <>
          <div className={`${textSize} text-gray-500 flex items-center`}>
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span>{reviews} reviews</span>
          </div>
          
          {showSales && sales !== undefined && (
            <>
              <div className="mx-2 text-gray-300">|</div>
              <div className={`${textSize} text-gray-500 flex items-center`}>
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                <span>{sales} sold</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
