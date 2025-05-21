import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function calculateDiscount(price: number, discountPrice: number | null | undefined): number | null {
  if (!discountPrice) return null;
  const discount = discountPrice - price;
  if (discount <= 0) return null;
  return discount;
}

export function calculateSavings(price: number, discountPrice: number | null | undefined): string {
  if (!discountPrice || discountPrice <= price) return '';
  const savingsPercent = Math.round(((discountPrice - price) / discountPrice) * 100);
  return `-${savingsPercent}%`;
}

export function getStarRating(rating: number): { full: number; half: number; empty: number } {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
}

export function getQueryParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

export function updateSearchParams(
  searchParams: URLSearchParams,
  updates: Record<string, string | number | null | undefined>
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams.toString());
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });
  
  return newParams;
}

export function getCategoryPath(categoryId?: number | null): string {
  return categoryId ? `/products?categoryId=${categoryId}` : '/products';
}

export function getProductPath(productId: number): string {
  return `/product-detail?id=${productId}`;
}

export function getProductPathBySlug(slug: string): string {
  return `/product-detail?slug=${slug}`;
}

export function getCartTotal(items: { quantity: number; product: { price: number } }[]): number {
  return items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
}

export function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}
