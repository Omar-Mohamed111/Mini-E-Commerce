import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CatalogProvider } from "./context/CatalogContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <CatalogProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </CatalogProvider>
    </ThemeProvider>
  </StrictMode>,
);
