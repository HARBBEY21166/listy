import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ThemeProvider>
);
