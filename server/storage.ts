import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  cartItems, type CartItem, type InsertCartItem 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(options?: {
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
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRelatedProducts(productId: number, limit?: number): Promise<Product[]>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemById(id: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  getSavedForLaterItems(userId: number): Promise<CartItem[]>;
  moveToSavedForLater(id: number): Promise<CartItem | undefined>;
  moveToCart(id: number): Promise<CartItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private cartItems: Map<number, CartItem>;
  
  currentUserId: number;
  currentProductId: number;
  currentCategoryId: number;
  currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentCartItemId = 1;

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample categories
    const categories = [
      { name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      { name: "Clothing", slug: "clothing", description: "Apparel and fashion items" },
      { name: "Home & Outdoor", slug: "home-outdoor", description: "Home decor and outdoor items" },
      { name: "Smartphones", slug: "smartphones", description: "Mobile phones and accessories", parentId: 1 },
      { name: "Laptops", slug: "laptops", description: "Portable computers", parentId: 1 },
      { name: "Men's Wear", slug: "mens-wear", description: "Clothing for men", parentId: 2 },
      { name: "Women's Wear", slug: "womens-wear", description: "Clothing for women", parentId: 2 },
      { name: "Kitchen", slug: "kitchen", description: "Kitchen appliances and utensils", parentId: 3 }
    ];
    
    categories.forEach(category => {
      this.createCategory({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        imageUrl: null
      });
    });

    // Sample products
    const products = [
      {
        name: "GoPro HERO6 4K Action Camera",
        slug: "gopro-hero6-4k-action-camera",
        description: "Capture stunning 4K video and incredible photos with the GoPro HERO6 Black. With its all-new GP1 chip, improved stabilization, and 2x the performance of the HERO5, this action camera lets you capture life's moments like never before.",
        price: 99.50,
        discountPrice: 128.00,
        imageUrl: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3",
        categoryId: 1,
        inStock: true,
        rating: 4.5,
        reviewCount: 154,
        soldCount: 254,
        featured: true,
        material: "Plastic material",
        type: "Action Camera",
        design: "Modern nice",
        color: "Black",
        brand: "GoPro",
        seller: "Artel Market"
      },
      {
        name: "Mens Long Sleeve T-shirt Cotton Base",
        slug: "mens-long-sleeve-tshirt",
        description: "Classic long sleeve t-shirt for men, made with high-quality cotton material that's comfortable and durable.",
        price: 78.00,
        discountPrice: 98.00,
        imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3",
        categoryId: 6,
        inStock: true,
        rating: 4.7,
        reviewCount: 32,
        soldCount: 154,
        featured: true,
        material: "Cotton",
        type: "T-shirt",
        design: "Classic style",
        customization: "Customized logo and design custom packages",
        protection: "Refund Policy",
        warranty: "2 years full warranty",
        size: "Medium",
        color: "Gray",
        brand: "Fashion Brand",
        seller: "Guizar Trading LLC"
      },
      {
        name: "T-shirts with multiple colors",
        slug: "tshirts-multiple-colors",
        description: "High-quality t-shirts available in various colors, perfect for casual wear.",
        price: 10.30,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3",
        categoryId: 6,
        inStock: true,
        rating: 4.0,
        reviewCount: 42,
        soldCount: 137,
        featured: false,
        material: "Cotton",
        size: "Medium",
        color: "Blue",
        brand: "Fashion Brand",
        seller: "Artel Market"
      },
      {
        name: "Samsung Smart Watch",
        slug: "samsung-smart-watch",
        description: "Stay connected with this stylish and functional smart watch from Samsung.",
        price: 99.50,
        discountPrice: 128.00,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3",
        categoryId: 1,
        inStock: true,
        rating: 4.8,
        reviewCount: 75,
        soldCount: 208,
        featured: true,
        material: "Plastic and metal",
        type: "Smart Watch",
        color: "Silver",
        brand: "Samsung",
        seller: "Best Factory LLC"
      },
      {
        name: "Apple iPhone 12 Pro",
        slug: "apple-iphone-12-pro",
        description: "The latest iPhone with advanced features and stunning camera capabilities.",
        price: 999.00,
        discountPrice: 1099.00,
        imageUrl: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3",
        categoryId: 4,
        inStock: true,
        rating: 4.9,
        reviewCount: 132,
        soldCount: 345,
        featured: true,
        material: "Glass and aluminum",
        type: "Smartphone",
        color: "Blue",
        brand: "Apple",
        seller: "Tech Solutions Inc"
      },
      {
        name: "Professional DSLR Camera",
        slug: "professional-dslr-camera",
        description: "Capture professional-quality photos and videos with this high-end DSLR camera.",
        price: 699.00,
        discountPrice: 799.00,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3",
        categoryId: 1,
        inStock: true,
        rating: 4.7,
        reviewCount: 87,
        soldCount: 156,
        featured: false,
        material: "Plastic and metal",
        type: "Camera",
        color: "Black",
        brand: "Canon",
        seller: "PhotoPro Store"
      },
      {
        name: "Modern Laptop with SSD",
        slug: "modern-laptop-ssd",
        description: "Fast and efficient laptop with solid-state drive for optimal performance.",
        price: 899.00,
        discountPrice: 999.00,
        imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3",
        categoryId: 5,
        inStock: true,
        rating: 4.6,
        reviewCount: 65,
        soldCount: 129,
        featured: true,
        material: "Aluminum",
        type: "Laptop",
        color: "Silver",
        brand: "Dell",
        seller: "TechMart"
      },
      {
        name: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones",
        description: "Immerse yourself in high-quality sound with these comfortable wireless headphones.",
        price: 59.99,
        discountPrice: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?ixlib=rb-4.0.3",
        categoryId: 1,
        inStock: true,
        rating: 4.4,
        reviewCount: 93,
        soldCount: 217,
        featured: false,
        material: "Plastic and fabric",
        type: "Headphones",
        color: "Black",
        brand: "Sony",
        seller: "AudioPlus"
      }
    ];
    
    products.forEach(product => {
      this.createProduct(product as InsertProduct);
    });

    // Sample users
    this.createUser({
      username: "user1",
      password: "password123",
      email: "user1@example.com",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Anytown",
      country: "USA",
      zipCode: "12345",
      isAdmin: false
    });

    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(options: {
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
  } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    // Filter by category if specified
    if (options.categoryId) {
      products = products.filter(product => product.categoryId === options.categoryId);
    }
    
    // Filter by featured if specified
    if (options.featured !== undefined) {
      products = products.filter(product => product.featured === options.featured);
    }
    
    // Filter by search term if specified
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by price range if specified
    if (options.minPrice !== undefined) {
      products = products.filter(product => product.price >= options.minPrice!);
    }
    
    if (options.maxPrice !== undefined) {
      products = products.filter(product => product.price <= options.maxPrice!);
    }
    
    // Filter by stock status if specified
    if (options.inStock !== undefined) {
      products = products.filter(product => product.inStock === options.inStock);
    }
    
    // Sort products
    if (options.sortBy) {
      const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
      
      switch (options.sortBy) {
        case 'price':
          products.sort((a, b) => sortOrder * (a.price - b.price));
          break;
        case 'rating':
          products.sort((a, b) => sortOrder * ((b.rating || 0) - (a.rating || 0)));
          break;
        case 'newest':
          // In a real database, we would sort by createdAt
          // For this in-memory implementation, we'll sort by id (assuming newer products have higher ids)
          products.sort((a, b) => sortOrder * (b.id - a.id));
          break;
      }
    }
    
    // Apply pagination
    if (options.limit !== undefined) {
      const offset = options.offset || 0;
      products = products.slice(offset, offset + options.limit);
    }
    
    return products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct = { ...existingProduct, ...productUpdate };
    this.products.set(id, updatedProduct);
    
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const featuredProducts = Array.from(this.products.values()).filter(
      (product) => product.featured
    );
    
    return featuredProducts.slice(0, limit);
  }

  async getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
    const product = this.products.get(productId);
    
    if (!product) {
      return [];
    }
    
    // Get products in the same category except the current product
    let relatedProducts = Array.from(this.products.values()).filter(
      (p) => p.categoryId === product.categoryId && p.id !== productId
    );
    
    // If we don't have enough related products, add some random products
    if (relatedProducts.length < limit) {
      const otherProducts = Array.from(this.products.values()).filter(
        (p) => p.id !== productId && !relatedProducts.find(rp => rp.id === p.id)
      );
      
      // Shuffle array to get random products
      for (let i = otherProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherProducts[i], otherProducts[j]] = [otherProducts[j], otherProducts[i]];
      }
      
      relatedProducts = [
        ...relatedProducts,
        ...otherProducts.slice(0, limit - relatedProducts.length)
      ];
    }
    
    return relatedProducts.slice(0, limit);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId && !item.savedForLater
    );
  }

  async getCartItemById(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && 
                item.productId === insertCartItem.productId &&
                item.savedForLater === insertCartItem.savedForLater
    );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      return this.updateCartItem(existingItem.id, existingItem.quantity + (insertCartItem.quantity || 1)) as Promise<CartItem>;
    }
    
    // Add new item to cart
    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    
    if (!cartItem) {
      return undefined;
    }
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId && !item.savedForLater)
      .map(item => item.id);
    
    itemsToRemove.forEach(id => this.cartItems.delete(id));
    
    return true;
  }

  async getSavedForLaterItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId && item.savedForLater
    );
  }

  async moveToSavedForLater(id: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    
    if (!cartItem) {
      return undefined;
    }
    
    const updatedItem = { ...cartItem, savedForLater: true };
    this.cartItems.set(id, updatedItem);
    
    return updatedItem;
  }

  async moveToCart(id: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    
    if (!cartItem) {
      return undefined;
    }
    
    const updatedItem = { ...cartItem, savedForLater: false };
    this.cartItems.set(id, updatedItem);
    
    return updatedItem;
  }
}

export const storage = new MemStorage();
