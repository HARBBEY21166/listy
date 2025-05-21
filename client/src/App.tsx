import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HomePage from "@/pages/index";
import ProductsPage from "@/pages/products";
import ProductDetailPage from "@/pages/product-detail";
import CartPage from "@/pages/cart";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FeaturedProvider } from "@/context/FeaturedContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/product-detail" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FeaturedProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-white">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
            </TooltipProvider>
          </CartProvider>
        </FeaturedProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
