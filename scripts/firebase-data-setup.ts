import { database, ref } from "../server/firebase";
import { set, get } from "firebase/database";

async function main() {
  console.log("Setting up Firebase database with sample data...");
  
  try {
    // Add sample categories
    const sampleCategories = [
      {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen products",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        description: "Sports equipment and outdoor gear",
        imageUrl: "https://via.placeholder.com/150",
      }
    ];

    // Add sample products
    const sampleProducts = [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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

    // Add a default user
    const defaultUser = {
      id: 1,
      username: "user1",
      password: "password123", // In a real app, this would be hashed
      email: "user1@example.com",
      firstName: "John",
      lastName: "Doe",
      isAdmin: false
    };

    // Check if data already exists before adding
    const checkCategories = await get(ref(database, 'categories'));
    if (!checkCategories.exists()) {
      // Add categories
      for (const category of sampleCategories) {
        await set(ref(database, `categories/${category.id}`), category);
      }
      console.log("Sample categories added to Firebase.");
    } else {
      console.log("Categories already exist in Firebase, skipping...");
    }

    // Check if products exist
    const checkProducts = await get(ref(database, 'products'));
    if (!checkProducts.exists()) {
      // Add products
      for (const product of sampleProducts) {
        await set(ref(database, `products/${product.id}`), product);
      }
      console.log("Sample products added to Firebase.");
    } else {
      console.log("Products already exist in Firebase, skipping...");
    }

    // Check if user exists
    const checkUsers = await get(ref(database, 'users'));
    if (!checkUsers.exists()) {
      // Add default user
      await set(ref(database, `users/${defaultUser.id}`), defaultUser);
      console.log("Default user added to Firebase.");
    } else {
      console.log("Users already exist in Firebase, skipping...");
    }

    console.log("Firebase database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Firebase database:", error);
    process.exit(1);
  } finally {
    // Wait a bit to make sure all writes are completed
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  }
}

// Run the setup
main();