# E-Commerce Web Application

## Overview
This is a modern e-commerce web application built with a React frontend and Express backend. It uses Drizzle ORM for database operations, PostgreSQL for data storage, and provides a complete shopping experience with product listings, categories, cart functionality, and user management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application follows a client-server architecture:

1. **Frontend**: React-based SPA (Single Page Application) using modern React patterns and hooks
2. **Backend**: Express.js server providing REST API endpoints
3. **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
4. **State Management**: Combination of React Context API and TanStack Query for client-side state

The application is designed to be deployed on Replit, with considerations for production deployment using autoscaling.

## Key Components

### Backend Components

#### Express Server
- Entry point: `server/index.ts`
- Handles API requests, serves static assets in production
- Uses middleware for JSON parsing, logging, and error handling

#### API Routes
- Defined in `server/routes.ts`
- RESTful endpoints for products, categories, users, and cart operations
- Implements filtering, sorting, and pagination for product listings

#### Data Storage
- Interface defined in `server/storage.ts`
- Abstracts database operations for all entities
- Implements methods for CRUD operations on products, categories, users, and cart items

#### Database Schema
- Defined in `shared/schema.ts`
- Uses Drizzle ORM with PostgreSQL driver
- Main entities:
  - Products: Store items with details like price, description, images
  - Categories: Hierarchical product grouping
  - Users: Customer accounts with authentication info
  - Cart Items: Products added to user shopping carts

### Frontend Components

#### Main App Structure
- Entry: `client/src/main.tsx` and `client/src/App.tsx`
- Routing via Wouter (lightweight router)
- Wrapped with context providers for theme, cart, and query client

#### Pages
- Home: Featured products and category showcases
- Products: Filtered product listings with search and category filters
- Product Detail: Individual product view with add to cart functionality
- Cart: Shopping cart with checkout flow

#### UI Components
- Uses a comprehensive UI component library based on Radix UI primitives
- Tailwind CSS for styling with a consistent design system
- Custom components for e-commerce specific needs (ProductCard, CategoryCard, etc.)

#### State Management
- Context API for global state (cart, theme, user)
- TanStack Query for server state and data fetching
- Custom hooks for shared logic

## Data Flow

### Product Browsing Flow
1. User visits homepage or product listing
2. Frontend requests products from the `/api/products` endpoint
3. Server retrieves products from database, applies filters if needed
4. Frontend displays products with pagination
5. User can filter by category, price, and other attributes

### Cart Management Flow
1. User adds products to cart via "Add to Cart" buttons
2. Frontend updates cart context and persists to server via API
3. Cart state is maintained between sessions
4. Users can view, update quantities, and remove items from cart
5. Checkout process collects shipping and payment information

### Authentication Flow
1. User registers or logs in via auth endpoints
2. Server validates credentials and provides session information
3. Frontend stores authentication state in context
4. Protected routes and actions check auth state before proceeding

## External Dependencies

### Frontend Dependencies
- React for UI rendering
- TanStack Query for data fetching and caching
- Radix UI for accessible UI components
- Tailwind CSS for styling
- Wouter for client-side routing
- date-fns for date formatting
- lucide-react for icons

### Backend Dependencies
- Express for API server
- Drizzle ORM for database operations
- zod for validation
- NeonDB for PostgreSQL connectivity

## Deployment Strategy
The application is configured for deployment on Replit with:

1. **Development Mode**:
   - Command: `npm run dev`
   - Runs both server and client with hot-reloading

2. **Production Build**:
   - Build command: `npm run build`
   - Bundles React app and optimizes server for production
   - Run command: `npm run start`

3. **Database**:
   - Uses the PostgreSQL module in Replit
   - Schema migrations managed via Drizzle

4. **Environment Variables**:
   - `DATABASE_URL`: Connection string for PostgreSQL database

## Getting Started

To set up the development environment:

1. Ensure PostgreSQL is properly set up in your Replit
2. Run `npm run dev` to start the development server
3. Access the application at the provided URL

For schema changes:
1. Modify `shared/schema.ts` to update database models
2. Run `npm run db:push` to apply schema changes to the database

## Next Steps

Potential enhancements to consider:
1. Add authentication with session management
2. Implement payment processing integration
3. Add product reviews and ratings system
4. Enhance admin features for product management
5. Implement order processing and history