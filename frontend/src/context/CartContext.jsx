import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const qtyToAdd = product.quantity !== undefined ? product.quantity : 1;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        let newQty = (existing.quantity || 1) + qtyToAdd;
        
        // Enforce maximum quantity limit
        if (newQty > 5000) {
          alert('Maximum limit of 5000 units per product reached for this order.');
          newQty = 5000;
        }

        if (newQty <= 0) {
          return prev.filter(item => item.id !== product.id);
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      
      // Enforce maximum quantity limit for new items
      let initialQty = qtyToAdd;
      if (initialQty > 5000) {
        alert('Maximum limit of 5000 units per product reached for this order.');
        initialQty = 5000;
      }

      // If it's a new item, ensure we don't add negative or zero
      if (initialQty <= 0) return prev;
      return [...prev, { ...product, quantity: initialQty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
