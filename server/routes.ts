import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema, insertProductSchema } from "@shared/schema";
import { fromZodError } from 'zod-validation-error';

// Create a validation helper function to replace zValidator
const validateZod = (schema: z.ZodType<any>) => {
  return (data: any) => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        throw { validation: true, message: validationError.message };
      }
      throw error;
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // ===== PRODUCT ROUTES =====
  // Get all products with optional filters
  apiRouter.get("/products", async (req: Request, res: Response) => {
    try {
      const { 
        categoryId, 
        featured, 
        limit, 
        offset, 
        search, 
        minPrice, 
        maxPrice, 
        inStock,
        sortBy,
        sortOrder
      } = req.query;
      
      const products = await storage.getProducts({
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        search: search as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        sortBy: sortBy as 'price' | 'rating' | 'newest' | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      });
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
  
  // Get a single product by ID
  apiRouter.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  });
  
  // Get a single product by slug
  apiRouter.get("/products/slug/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  });
  
  // Create a new product (admin only)
  apiRouter.post("/products", async (req: Request, res: Response) => {
    try {
      const validatedData = validateZod(insertProductSchema)(req.body);
      const newProduct = await storage.createProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      
      if ((error as any).validation) {
        return res.status(400).json({ message: (error as any).message });
      }
      
      res.status(500).json({ message: 'Error creating product' });
    }
  });
  
  // Update a product (admin only)
  apiRouter.put("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const updatedProduct = await storage.updateProduct(productId, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  });
  
  // Delete a product (admin only)
  apiRouter.delete("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const deleted = await storage.deleteProduct(productId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  });
  
  // Get featured products
  apiRouter.get("/featured-products", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const featuredProducts = await storage.getFeaturedProducts(limit);
      res.json(featuredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ message: 'Error fetching featured products' });
    }
  });
  
  // Get related products
  apiRouter.get("/products/:id/related", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const relatedProducts = await storage.getRelatedProducts(productId, limit);
      res.json(relatedProducts);
    } catch (error) {
      console.error('Error fetching related products:', error);
      res.status(500).json({ message: 'Error fetching related products' });
    }
  });
  
  // ===== CATEGORY ROUTES =====
  // Get all categories
  apiRouter.get("/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });
  
  // Get a single category by ID
  apiRouter.get("/categories/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await storage.getCategoryById(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Error fetching category' });
    }
  });
  
  // Get a single category by slug
  apiRouter.get("/categories/slug/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      res.status(500).json({ message: 'Error fetching category' });
    }
  });
  
  // ===== CART ROUTES =====
  // Get cart items for a user
  apiRouter.get("/cart", async (req: Request, res: Response) => {
    try {
      // For simplicity, using userId 1 for now
      // In a real app, would get this from authenticated user
      const userId = 1;
      
      const cartItems = await storage.getCartItems(userId);
      
      // Get the full product details for each cart item
      const itemsWithProductDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(itemsWithProductDetails);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Error fetching cart items' });
    }
  });
  
  // Add item to cart
  apiRouter.post("/cart", async (req: Request, res: Response) => {
    try {
      // For simplicity, using userId 1 for now
      // In a real app, would get this from authenticated user
      const userId = 1;
      
      const validationSchema = insertCartItemSchema.extend({
        userId: z.number().optional().default(userId)
      });
      
      const validatedData = validateZod(validationSchema)({
        ...req.body,
        userId
      });
      
      const newCartItem = await storage.addToCart(validatedData);
      const product = await storage.getProductById(newCartItem.productId);
      
      res.status(201).json({
        ...newCartItem,
        product
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      
      if ((error as any).validation) {
        return res.status(400).json({ message: (error as any).message });
      }
      
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  });
  
  // Update cart item quantity
  apiRouter.put("/cart/:id", async (req: Request, res: Response) => {
    try {
      const cartItemId = parseInt(req.params.id);
      
      if (isNaN(cartItemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity value' });
      }
      
      const updatedItem = await storage.updateCartItem(cartItemId, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      const product = await storage.getProductById(updatedItem.productId);
      
      res.json({
        ...updatedItem,
        product
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Error updating cart item' });
    }
  });
  
  // Remove item from cart
  apiRouter.delete("/cart/:id", async (req: Request, res: Response) => {
    try {
      const cartItemId = parseInt(req.params.id);
      
      if (isNaN(cartItemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const deleted = await storage.removeFromCart(cartItemId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ message: 'Error removing item from cart' });
    }
  });
  
  // Clear the entire cart
  apiRouter.delete("/cart", async (req: Request, res: Response) => {
    try {
      // For simplicity, using userId 1 for now
      // In a real app, would get this from authenticated user
      const userId = 1;
      
      await storage.clearCart(userId);
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Error clearing cart' });
    }
  });
  
  // Get saved for later items
  apiRouter.get("/saved-items", async (req: Request, res: Response) => {
    try {
      // For simplicity, using userId 1 for now
      // In a real app, would get this from authenticated user
      const userId = 1;
      
      const savedItems = await storage.getSavedForLaterItems(userId);
      
      // Get the full product details for each saved item
      const itemsWithProductDetails = await Promise.all(
        savedItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(itemsWithProductDetails);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      res.status(500).json({ message: 'Error fetching saved items' });
    }
  });
  
  // Move item to saved for later
  apiRouter.post("/cart/:id/save-for-later", async (req: Request, res: Response) => {
    try {
      const cartItemId = parseInt(req.params.id);
      
      if (isNaN(cartItemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const updatedItem = await storage.moveToSavedForLater(cartItemId);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      const product = await storage.getProductById(updatedItem.productId);
      
      res.json({
        ...updatedItem,
        product
      });
    } catch (error) {
      console.error('Error saving item for later:', error);
      res.status(500).json({ message: 'Error saving item for later' });
    }
  });
  
  // Move saved item to cart
  apiRouter.post("/saved-items/:id/move-to-cart", async (req: Request, res: Response) => {
    try {
      const savedItemId = parseInt(req.params.id);
      
      if (isNaN(savedItemId)) {
        return res.status(400).json({ message: 'Invalid saved item ID' });
      }
      
      const updatedItem = await storage.moveToCart(savedItemId);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Saved item not found' });
      }
      
      const product = await storage.getProductById(updatedItem.productId);
      
      res.json({
        ...updatedItem,
        product
      });
    } catch (error) {
      console.error('Error moving item to cart:', error);
      res.status(500).json({ message: 'Error moving item to cart' });
    }
  });

  // Register API routes under /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
