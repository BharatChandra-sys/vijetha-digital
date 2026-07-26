import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css"; // ✅ 1. Tailwind base
import "./styles/button-system.css"; // ✅ 2. Comprehensive button styling system
import "./styles/mobile-enhancements-clean.css"; // ✅ 3. Mobile-only enhancements
import "./styles/mobile-optimized.css"; // ✅ 4. Advanced mobile e-commerce optimizations
import "./styles/whatsapp-button-fix.css"; // ✅ 5. WhatsApp button visibility fix
import "./styles/critical-fixes.css"; // ✅ 6. Critical fixes only
import "./styles/portal.css";          // ✅ 7. Enterprise portal styles

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    )}
  </React.StrictMode>
);
