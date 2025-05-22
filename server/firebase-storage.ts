import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  cartItems, type CartItem, type InsertCartItem 
} from "@shared/schema";
import { database, ref } from "./firebase";
import { get, set, push, remove, update, query, orderByChild, equalTo, startAt, endAt } from "firebase/database";
import { IStorage } from "./storage";

export class FirebaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const snapshot = await get(ref(database, `users/${id}`));
      return snapshot.exists() ? snapshot.val() : undefined;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Get all users and filter in memory
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const users = snapshot.val();
      
      // Find the user with matching username
      for (const [userId, user] of Object.entries(users)) {
        if ((user as any).username === username) {
          return { id: parseInt(userId), ...(user as any) };
        }
      }
      
      return undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Get the current highest ID to assign a new ID
      const snapshot = await get(ref(database, 'users'));
      let nextId = 1;
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        const ids = Object.keys(users).map(key => parseInt(key));
        nextId = Math.max(...ids, 0) + 1;
      }
      
      const newUser: User = { id: nextId, ...insertUser };
      await set(ref(database, `users/${nextId}`), newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Product methods
  async getProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'price' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    try {
      // Get all products first
      const snapshot = await get(ref(database, 'products'));
      if (!snapshot.exists()) {
        return [];
      }
      
      let products: Product[] = [];
      const productsData = snapshot.val();
      
      // Convert to array and assign IDs
      for (const [id, product] of Object.entries(productsData)) {
        products.push({ id: parseInt(id), ...product as Omit<Product, 'id'> });
      }
      
      // Apply filters
      if (options?.categoryId) {
        products = products.filter(p => p.categoryId === options.categoryId);
      }
      
      if (options?.featured !== undefined) {
        products = products.filter(p => p.featured === options.featured);
      }
      
      if (options?.search) {
        const searchLower = options.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }
      
      if (options?.minPrice !== undefined) {
        products = products.filter(p => p.price >= options.minPrice!);
      }
      
      if (options?.maxPrice !== undefined) {
        products = products.filter(p => p.price <= options.maxPrice!);
      }
      
      if (options?.inStock !== undefined) {
        products = products.filter(p => p.inStock === options.inStock);
      }
      
      // Apply sorting
      if (options?.sortBy) {
        const isAsc = options.sortOrder !== 'desc';
        
        switch (options.sortBy) {
          case 'price':
            products.sort((a, b) => isAsc ? a.price - b.price : b.price - a.price);
            break;
          case 'rating':
            products.sort((a, b) => {
              const ratingA = a.rating || 0;
              const ratingB = b.rating || 0;
              return isAsc ? ratingA - ratingB : ratingB - ratingA;
            });
            break;
          case 'newest':
            products.sort((a, b) => isAsc ? a.id - b.id : b.id - a.id);
            break;
        }
      } else {
        // Default sort by name
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Apply pagination
      if (options?.offset !== undefined && options?.limit !== undefined) {
        const start = options.offset;
        const end = options.offset + options.limit;
        products = products.slice(start, end);
      } else if (options?.limit !== undefined) {
        products = products.slice(0, options.limit);
      }
      
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      const snapshot = await get(ref(database, `products/${id}`));
      return snapshot.exists() ? { id, ...snapshot.val() } : undefined;
    } catch (error) {
      console.error("Error fetching product:", error);
      return undefined;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      // Get all products and filter by slug in memory
      const productsRef = ref(database, 'products');
      const snapshot = await get(productsRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const products = snapshot.val();
      
      // Find the product with the matching slug
      for (const [productId, product] of Object.entries(products)) {
        if ((product as any).slug === slug) {
          return { id: parseInt(productId), ...(product as any) };
        }
      }
      
      return undefined;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      // Get the current highest ID to assign a new ID
      const snapshot = await get(ref(database, 'products'));
      let nextId = 1;
      
      if (snapshot.exists()) {
        const products = snapshot.val();
        const ids = Object.keys(products).map(key => parseInt(key));
        nextId = Math.max(...ids, 0) + 1;
      }
      
      const newProduct: Product = { id: nextId, ...insertProduct };
      await set(ref(database, `products/${nextId}`), newProduct);
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    try {
      const productRef = ref(database, `products/${id}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const existingProduct = snapshot.val();
      const updatedProduct = { ...existingProduct, ...productUpdate };
      
      await update(productRef, updatedProduct);
      return { id, ...updatedProduct };
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const productRef = ref(database, `products/${id}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        return false;
      }
      
      await remove(productRef);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const productsRef = ref(database, 'products');
      const snapshot = await get(productsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const productsData = snapshot.val();
      const featuredProducts: Product[] = [];
      
      for (const [id, product] of Object.entries(productsData)) {
        const typedProduct = product as any;
        if (typedProduct.featured) {
          featuredProducts.push({ id: parseInt(id), ...typedProduct });
        }
      }
      
      // Sort by rating (highest first) and limit
      return featuredProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  }

  async getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
    try {
      const product = await this.getProductById(productId);
      
      if (!product || !product.categoryId) {
        // Return random products if product has no category
        return this.getProducts({ limit });
      }
      
      // Get products in the same category
      const productsInCategory = await this.getProducts({
        categoryId: product.categoryId,
        limit: limit + 1  // Get one extra to filter out the current product
      });
      
      // Filter out the current product
      return productsInCategory
        .filter(p => p.id !== productId)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      const snapshot = await get(ref(database, 'categories'));
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const categoriesData = snapshot.val();
      const categories: Category[] = [];
      
      for (const [id, category] of Object.entries(categoriesData)) {
        categories.push({ id: parseInt(id), ...category as Omit<Category, 'id'> });
      }
      
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    try {
      const snapshot = await get(ref(database, `categories/${id}`));
      return snapshot.exists() ? { id, ...snapshot.val() } : undefined;
    } catch (error) {
      console.error("Error fetching category:", error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const categoriesRef = ref(database, 'categories');
      const categoryQuery = query(categoriesRef, orderByChild('slug'), equalTo(slug));
      const snapshot = await get(categoryQuery);
      
      if (snapshot.exists()) {
        const categories = snapshot.val();
        const categoryId = Object.keys(categories)[0];
        return { id: parseInt(categoryId), ...categories[categoryId] };
      }
      
      return undefined;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return undefined;
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      // Get the current highest ID to assign a new ID
      const snapshot = await get(ref(database, 'categories'));
      let nextId = 1;
      
      if (snapshot.exists()) {
        const categories = snapshot.val();
        const ids = Object.keys(categories).map(key => parseInt(key));
        nextId = Math.max(...ids, 0) + 1;
      }
      
      const newCategory: Category = { id: nextId, ...insertCategory };
      await set(ref(database, `categories/${nextId}`), newCategory);
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    try {
      // Get all cart items without using orderByChild
      const cartRef = ref(database, 'cart_items');
      
      // Simple get without query parameters
      const snapshot = await get(cartRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const cartItems: CartItem[] = [];
      const cartData = snapshot.val();
      
      for (const [id, item] of Object.entries(cartData)) {
        const typedItem = item as any;
        // Filter by userId and not savedForLater
        if (typedItem.userId === userId && !typedItem.savedForLater) {
          // For each cart item, fetch the associated product
          const product = await this.getProductById(typedItem.productId);
          
          if (product) {
            cartItems.push({
              id: parseInt(id),
              userId: typedItem.userId,
              productId: typedItem.productId,
              quantity: typedItem.quantity || 1,
              savedForLater: typedItem.savedForLater || false,
              product: product as any // Added product information
            } as any);
          }
        }
      }
      
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  async getCartItemById(id: number): Promise<CartItem | undefined> {
    try {
      const snapshot = await get(ref(database, `cart_items/${id}`));
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const item = snapshot.val();
      
      // Fetch the associated product
      const product = await this.getProductById(item.productId);
      
      if (!product) {
        return undefined;
      }
      
      return {
        id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity || 1,
        savedForLater: item.savedForLater || false,
        product: product as any
      } as any;
    } catch (error) {
      console.error("Error fetching cart item:", error);
      return undefined;
    }
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    try {
      // Check if this product is already in the cart for this user
      const cartRef = ref(database, 'cart_items');
      const cartQuery = query(
        cartRef,
        orderByChild('productId'),
        equalTo(insertCartItem.productId)
      );
      
      const snapshot = await get(cartQuery);
      
      if (snapshot.exists()) {
        const items = snapshot.val();
        
        for (const [itemId, item] of Object.entries(items)) {
          const typedItem = item as any;
          if (
            typedItem.userId === insertCartItem.userId && 
            typedItem.savedForLater === (insertCartItem.savedForLater || false)
          ) {
            // Update quantity instead of adding a new item
            const newQuantity = (typedItem.quantity || 1) + (insertCartItem.quantity || 1);
            return this.updateCartItem(parseInt(itemId), newQuantity);
          }
        }
      }
      
      // If we got here, the item is not in the cart yet
      // Get the current highest ID to assign a new ID
      const allCartSnapshot = await get(ref(database, 'cart_items'));
      let nextId = 1;
      
      if (allCartSnapshot.exists()) {
        const items = allCartSnapshot.val();
        const ids = Object.keys(items).map(key => parseInt(key));
        nextId = Math.max(...ids, 0) + 1;
      }
      
      const newCartItem = {
        id: nextId,
        userId: insertCartItem.userId,
        productId: insertCartItem.productId,
        quantity: insertCartItem.quantity || 1,
        savedForLater: insertCartItem.savedForLater || false
      };
      
      await set(ref(database, `cart_items/${nextId}`), newCartItem);
      
      // Fetch the product information to include in the response
      const product = await this.getProductById(newCartItem.productId);
      
      return { 
        ...newCartItem,
        product: product as any
      } as any;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    try {
      const cartItemRef = ref(database, `cart_items/${id}`);
      const snapshot = await get(cartItemRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const cartItem = snapshot.val();
      cartItem.quantity = quantity;
      
      await update(cartItemRef, cartItem);
      
      // Fetch the product to include in the response
      const product = await this.getProductById(cartItem.productId);
      
      return {
        id,
        ...cartItem,
        product: product as any
      } as any;
    } catch (error) {
      console.error("Error updating cart item:", error);
      return undefined;
    }
  }

  async removeFromCart(id: number): Promise<boolean> {
    try {
      const cartItemRef = ref(database, `cart_items/${id}`);
      const snapshot = await get(cartItemRef);
      
      if (!snapshot.exists()) {
        return false;
      }
      
      await remove(cartItemRef);
      return true;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      return false;
    }
  }

  async clearCart(userId: number): Promise<boolean> {
    try {
      const cartRef = ref(database, 'cart_items');
      const cartQuery = query(
        cartRef,
        orderByChild('userId'),
        equalTo(userId)
      );
      
      const snapshot = await get(cartQuery);
      
      if (!snapshot.exists()) {
        return true; // Cart is already empty
      }
      
      const items = snapshot.val();
      
      // Delete each item that belongs to this user and is not saved for later
      for (const [itemId, item] of Object.entries(items)) {
        const typedItem = item as any;
        if (typedItem.userId === userId && !typedItem.savedForLater) {
          await remove(ref(database, `cart_items/${itemId}`));
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }

  async getSavedForLaterItems(userId: number): Promise<CartItem[]> {
    try {
      // Get all cart items and filter in code
      const cartRef = ref(database, 'cart_items');
      const snapshot = await get(cartRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const savedItems: CartItem[] = [];
      const cartData = snapshot.val();
      
      for (const [id, item] of Object.entries(cartData)) {
        const typedItem = item as any;
        // Filter by userId and savedForLater status
        if (typedItem.userId === userId && typedItem.savedForLater) {
          // For each saved item, fetch the associated product
          const product = await this.getProductById(typedItem.productId);
          
          if (product) {
            savedItems.push({
              id: parseInt(id),
              userId: typedItem.userId,
              productId: typedItem.productId,
              quantity: typedItem.quantity || 1,
              savedForLater: true,
              product: product as any
            } as any);
          }
        }
      }
      
      return savedItems;
    } catch (error) {
      console.error("Error fetching saved items:", error);
      return [];
    }
  }

  async moveToSavedForLater(id: number): Promise<CartItem | undefined> {
    try {
      const cartItemRef = ref(database, `cart_items/${id}`);
      const snapshot = await get(cartItemRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const cartItem = snapshot.val();
      cartItem.savedForLater = true;
      
      await update(cartItemRef, cartItem);
      
      // Fetch the product to include in the response
      const product = await this.getProductById(cartItem.productId);
      
      return {
        id,
        ...cartItem,
        product: product as any
      } as any;
    } catch (error) {
      console.error("Error moving item to saved for later:", error);
      return undefined;
    }
  }

  async moveToCart(id: number): Promise<CartItem | undefined> {
    try {
      const cartItemRef = ref(database, `cart_items/${id}`);
      const snapshot = await get(cartItemRef);
      
      if (!snapshot.exists()) {
        return undefined;
      }
      
      const cartItem = snapshot.val();
      cartItem.savedForLater = false;
      
      await update(cartItemRef, cartItem);
      
      // Fetch the product to include in the response
      const product = await this.getProductById(cartItem.productId);
      
      return {
        id,
        ...cartItem,
        product: product as any
      } as any;
    } catch (error) {
      console.error("Error moving item to cart:", error);
      return undefined;
    }
  }
}