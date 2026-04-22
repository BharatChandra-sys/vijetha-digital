import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "vijetha_cart";

function readInitialCart() {
  const saved = localStorage.getItem(CART_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart);
  const cartLoaded = true;

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, cartLoaded]);

  const addToCart = (item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product_id === item.product_id && JSON.stringify(i.config) === JSON.stringify(item.config)
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const total = useMemo(() => {
    return items.reduce((sum, i) => {
      const price = Number(i.unit_price) || 0;
      const qty   = Number(i.quantity)   || 0;
      return sum + price * qty;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ items, cartLoaded, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
