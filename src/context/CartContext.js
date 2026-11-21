"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("arears_cart") || localStorage.getItem("aura_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("arears_cart", JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const addItem = (product, colorName, size, quantity = 1) => {
    setItems(prev => {
      const key = `${product.slug}-${colorName}-${size}`;
      const existingIndex = prev.findIndex(item => item.cartKey === key);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const selectedColorway = product.colorways?.find(c => c.name === colorName) || {
        name: colorName,
        primaryHex: "#10b981",
        image: product.image
      };

      const newItem = {
        cartKey: key,
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.basePrice,
        color: colorName,
        colorHex: selectedColorway.primaryHex,
        size: parseFloat(size),
        quantity
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (cartKey) => {
    setItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeItem(cartKey);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.cartKey === cartKey ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode("");
    setDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === "AREARS20" || normalized === "AURA20") {
      setDiscountPercent(0.20);
      setPromoCode("AREARS20");
      return { success: true, message: "20% discount applied!" };
    }
    return { success: false, message: "Invalid promo code. Try 'AREARS20'." };
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const shippingFee = subtotal >= 150 || subtotal === 0 ? 0 : 15;
  const totalAmount = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingFee : 0));
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discountAmount,
        discountPercent,
        shippingFee,
        totalAmount,
        totalItemsCount,
        promoCode,
        applyPromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
