import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id").references(() => categories.id),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  discountPrice: doublePrecision("discount_price"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").references(() => categories.id),
  inStock: boolean("in_stock").default(true),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  soldCount: integer("sold_count").default(0),
  featured: boolean("featured").default(false),
  material: text("material"),
  type: text("type"),
  design: text("design"),
  customization: text("customization"),
  protection: text("protection"),
  warranty: text("warranty"),
  size: text("size"),
  color: text("color"),
  brand: text("brand"),
  seller: text("seller"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  zipCode: text("zip_code"),
  isAdmin: boolean("is_admin").default(false),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  savedForLater: boolean("saved_for_later").default(false),
});

// Insert Schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
