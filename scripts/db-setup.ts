import { db } from "../server/db";
import { categories, products, users, cartItems } from "../shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Setting up database tables...");
  
  try {
    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        parent_id INTEGER REFERENCES categories(id)
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price DOUBLE PRECISION NOT NULL,
        discount_price DOUBLE PRECISION,
        image_url TEXT,
        category_id INTEGER REFERENCES categories(id),
        in_stock BOOLEAN DEFAULT TRUE,
        rating DOUBLE PRECISION DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        sold_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        material TEXT,
        type TEXT,
        design TEXT,
        customization TEXT,
        protection TEXT,
        warranty TEXT,
        size TEXT,
        color TEXT,
        brand TEXT,
        seller TEXT
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT,
        last_name TEXT,
        address TEXT,
        city TEXT,
        country TEXT,
        zip_code TEXT,
        is_admin BOOLEAN DEFAULT FALSE
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        saved_for_later BOOLEAN DEFAULT FALSE
      );
    `);

    // Add sample categories
    const sampleCategories = [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen products",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        description: "Sports equipment and outdoor gear",
        imageUrl: "https://via.placeholder.com/150",
      }
    ];

    for (const category of sampleCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    // Add sample products
    const sampleProducts = [
      {
        name: "GoPro HERO6 4K Action Camera",
        slug: "gopro-hero6-action-camera",
        description: "Professional 4K action camera with waterproof capabilities and excellent image stabilization.",
        price: 299.99,
        discountPrice: 249.99,
        imageUrl: "https://via.placeholder.com/300x300?text=GoPro",
        categoryId: 1, // Electronics
        inStock: true,
        rating: 4.8,
        reviewCount: 142,
        soldCount: 598,
        featured: true,
        brand: "GoPro",
        seller: "Official GoPro Store"
      },
      {
        name: "Samsung Smart Watch",
        slug: "samsung-smart-watch",
        description: "Advanced smartwatch with health monitoring, call features, and long battery life.",
        price: 199.99,
        discountPrice: 159.99,
        imageUrl: "https://via.placeholder.com/300x300?text=SmartWatch",
        categoryId: 1, // Electronics
        inStock: true,
        rating: 4.5,
        reviewCount: 87,
        soldCount: 347,
        featured: true,
        brand: "Samsung",
        seller: "Samsung Official"
      },
      {
        name: "Mens Long Sleeve T-shirt Cotton Base",
        slug: "mens-long-sleeve-tshirt",
        description: "High-quality cotton long sleeve t-shirt, perfect for casual wear and layering.",
        price: 24.99,
        discountPrice: 18.99,
        imageUrl: "https://via.placeholder.com/300x300?text=Tshirt",
        categoryId: 2, // Clothing
        inStock: true,
        rating: 4.3,
        reviewCount: 65,
        soldCount: 422,
        featured: false,
        size: "M, L, XL",
        color: "Black, White, Gray",
        brand: "Cotton Basics",
        seller: "Fashion World"
      },
      {
        name: "T-shirts with multiple colors",
        slug: "multi-color-tshirts",
        description: "Pack of high-quality t-shirts available in multiple vibrant colors.",
        price: 49.99,
        discountPrice: 39.99,
        imageUrl: "https://via.placeholder.com/300x300?text=ColorTshirts",
        categoryId: 2, // Clothing
        inStock: true,
        rating: 4.2,
        reviewCount: 53,
        soldCount: 310,
        featured: false,
        size: "S, M, L, XL",
        color: "Multiple",
        brand: "Color Pop",
        seller: "Fashion Outlet"
      },
      {
        name: "Kitchen Mixer",
        slug: "kitchen-mixer",
        description: "Professional kitchen mixer with multiple attachments for all your baking needs.",
        price: 199.99,
        discountPrice: 159.99,
        imageUrl: "https://via.placeholder.com/300x300?text=Mixer",
        categoryId: 3, // Home & Kitchen
        inStock: true,
        rating: 4.7,
        reviewCount: 112,
        soldCount: 245,
        featured: true,
        brand: "KitchenPro",
        seller: "Home Essentials"
      },
      {
        name: "Coffee Maker",
        slug: "coffee-maker",
        description: "Automatic coffee maker with programmable timer and built-in grinder.",
        price: 149.99,
        discountPrice: 129.99,
        imageUrl: "https://via.placeholder.com/300x300?text=CoffeeMaker",
        categoryId: 3, // Home & Kitchen
        inStock: true,
        rating: 4.6,
        reviewCount: 98,
        soldCount: 320,
        featured: false,
        brand: "BrewMaster",
        seller: "Kitchen Gadgets"
      },
      {
        name: "Professional Basketball",
        slug: "professional-basketball",
        description: "Official size and weight basketball for professional play.",
        price: 39.99,
        discountPrice: 34.99,
        imageUrl: "https://via.placeholder.com/300x300?text=Basketball",
        categoryId: 4, // Sports & Outdoors
        inStock: true,
        rating: 4.4,
        reviewCount: 76,
        soldCount: 284,
        featured: false,
        brand: "SportsElite",
        seller: "Sports Gear Pro"
      },
      {
        name: "Camping Tent for 4 People",
        slug: "camping-tent-4-people",
        description: "Waterproof camping tent that comfortably fits 4 people with easy setup.",
        price: 129.99,
        discountPrice: 99.99,
        imageUrl: "https://via.placeholder.com/300x300?text=Tent",
        categoryId: 4, // Sports & Outdoors
        inStock: true,
        rating: 4.5,
        reviewCount: 89,
        soldCount: 176,
        featured: true,
        brand: "OutdoorLife",
        seller: "Camping World"
      },
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }

    // Add a default user
    const defaultUser = {
      username: "user1",
      password: "password123", // In a real app, this would be hashed
      email: "user1@example.com",
      firstName: "John",
      lastName: "Doe",
      isAdmin: false
    };

    await db.insert(users).values(defaultUser).onConflictDoNothing();

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();