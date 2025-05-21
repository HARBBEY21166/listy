import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rating } from '@/components/ui/Rating';
import { DiscountBanner } from '@/components/ui/discount-banner';
import { ProductCard } from '@/components/ui/ProductCard';
import { Heart, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const productId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : undefined;
  const productSlug = searchParams.get('slug');
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch product details
  const { 
    data: product, 
    isLoading: isLoadingProduct,
    error: productError
  } = useQuery({
    queryKey: productId 
      ? ['/api/products', productId] 
      : ['/api/products/slug', productSlug],
    queryFn: async () => {
      let url = '';
      if (productId) {
        url = `/api/products/${productId}`;
      } else if (productSlug) {
        url = `/api/products/slug/${productSlug}`;
      } else {
        throw new Error('Product ID or slug is required');
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return response.json();
    },
    enabled: !!productId || !!productSlug
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['/api/products', productId, 'related'],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/related?limit=6`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json();
    },
    enabled: !!productId && !isLoadingProduct
  });

  // Set page title when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Brand`;
    }
  }, [product]);

  // Handle errors
  useEffect(() => {
    if (productError) {
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
      navigate('/products');
    }
  }, [productError]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleSaveForLater = () => {
    toast({
      title: "Success",
      description: "Product saved for later",
    });
  };

  if (isLoadingProduct) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading product details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products')}>
              Browse All Products
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' }
  ];

  if (product.categoryId) {
    breadcrumbItems.push({
      label: product.category || 'Category',
      href: `/products?categoryId=${product.categoryId}`
    });
  }

  breadcrumbItems.push({ label: product.name });

  // Create an array of product images (using main image for all thumbnails in this example)
  const productImages = Array(6).fill(product.imageUrl);

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Images */}
            <div className="md:w-2/5">
              {/* Main Image */}
              <div className="mb-3 border rounded-lg p-4">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-auto object-contain aspect-square"
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2">
                {productImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`border rounded p-1 cursor-pointer ${selectedImage === index ? '' : 'opacity-50'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-auto object-contain aspect-square"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-3/5">
              <div className="flex justify-between flex-wrap">
                <div className="w-full md:w-2/3">
                  {product.inStock ? (
                    <div className="inline-block text-xs bg-green-100 text-green-600 px-2 py-1 rounded mb-2">
                      <CheckCircle className="inline-block h-3 w-3 mr-1" /> In stock
                    </div>
                  ) : (
                    <div className="inline-block text-xs bg-red-100 text-red-600 px-2 py-1 rounded mb-2">
                      Out of stock
                    </div>
                  )}
                  <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
                  
                  <div className="flex items-center mb-2">
                    <Rating 
                      value={product.rating || 0} 
                      reviews={product.reviewCount}
                      sales={product.soldCount}
                      showReviews={true}
                      showSales={true}
                      size="md"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-end gap-3 mb-4">
                    <div>
                      {product.discountPrice && (
                        <div className="text-gray-500 line-through text-sm">
                          {formatPrice(product.discountPrice)}
                        </div>
                      )}
                      <div className="text-2xl font-semibold">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                      50-100 pcs
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                      $70.00 / 100-700 pcs
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-center text-blue-500 flex items-center justify-center mr-2">
                        R
                      </div>
                      <div>
                        <div className="text-sm font-medium">Supplier</div>
                        <div className="text-xs text-gray-500">{product.seller || 'Brand Seller'}</div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 text-xs mb-2">
                      <div className="flex items-center">
                        <span className="mr-1">🇩🇪</span>
                        <span>Germany, Berlin</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 h-3 w-3 mr-1" />
                        <span>Verified seller</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🌐</span>
                        <span>Worldwide shipping</span>
                      </div>
                    </div>
                    <Button variant="default" size="sm" className="w-full mb-2">
                      Send inquiry
                    </Button>
                    <Button variant="link" size="sm" className="text-primary w-full p-0">
                      Seller's profile
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Price:</div>
                  <div className="text-sm">Negotiable</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Type:</div>
                  <div className="text-sm">{product.type || 'Classic'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Material:</div>
                  <div className="text-sm">{product.material || 'Standard material'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Design:</div>
                  <div className="text-sm">{product.design || 'Modern nice'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Customization:</div>
                  <div className="text-sm">{product.customization || 'Customized logo and design custom packages'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Protection:</div>
                  <div className="text-sm">{product.protection || 'Refund Policy'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Warranty:</div>
                  <div className="text-sm">{product.warranty || '2 years full warranty'}</div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center">
                  <label className="text-sm text-gray-500 mr-2">Quantity:</label>
                  <select 
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-2 flex-wrap gap-2">
                  <Button 
                    variant="default" 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to cart' : 'Out of stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSaveForLater}
                  >
                    <Heart className="h-4 w-4 mr-1" /> Save for later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Product Tabs */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-0">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto">
              <TabsTrigger 
                value="description" 
                className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger 
                value="about-seller" 
                className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                About seller
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  {product.description || 
                    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`}
                </p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                
                <div className="mt-6">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.type && (
                        <tr className="border-t border-gray-200">
                          <td className="py-2 text-gray-500 w-1/4">Model</td>
                          <td className="py-2">MS78668</td>
                        </tr>
                      )}
                      {product.type && (
                        <tr className="border-t border-gray-200">
                          <td className="py-2 text-gray-500">Style</td>
                          <td className="py-2">Classic style</td>
                        </tr>
                      )}
                      <tr className="border-t border-gray-200">
                        <td className="py-2 text-gray-500">Certificate</td>
                        <td className="py-2">ISO-898921212</td>
                      </tr>
                      {product.size && (
                        <tr className="border-t border-gray-200">
                          <td className="py-2 text-gray-500">Size</td>
                          <td className="py-2">{product.size}</td>
                        </tr>
                      )}
                      {product.material && (
                        <tr className="border-t border-gray-200">
                          <td className="py-2 text-gray-500">Material</td>
                          <td className="py-2">{product.material}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Some great feature name here</li>
                    <li>Lorem ipsum dolor sit amet, consectetur</li>
                    <li>Duis aute irure dolor in reprehenderit</li>
                    <li>Some great feature name here</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Product Reviews</h3>
                <p className="text-sm text-gray-500 mt-2">
                  This product has {product.reviewCount || 0} reviews with an average rating of {product.rating?.toFixed(1) || 0} stars.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Shipping Information</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We offer worldwide shipping with fast delivery and tracking information.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="about-seller" className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">About the Seller</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {product.seller || 'Brand Seller'} is a verified seller with excellent customer service.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Related Products */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Related products</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              name={relatedProduct.name}
              price={relatedProduct.price}
              discountPrice={relatedProduct.discountPrice}
              imageUrl={relatedProduct.imageUrl}
            />
          ))}
        </div>
      </div>
      
      {/* You May Like */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">You may like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.slice(0, 4).map((product) => (
            <Card key={product.id} className="flex flex-row shadow-sm">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded-l-lg"
              />
              <CardContent className="p-2">
                <div className="text-xs font-medium">{product.name}</div>
                <div className="text-xs text-gray-500">{formatPrice(product.price)} - {formatPrice(product.price * 1.3)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Super Discount Banner */}
      <DiscountBanner
        title="Super discount on more than 100 USD"
        subtitle="Have you ever finally just write dummy info"
        buttonText="Shop now"
        className="mb-6"
      />
    </Container>
  );
}
