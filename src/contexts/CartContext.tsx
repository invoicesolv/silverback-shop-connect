import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, size?: string, color?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingCost: (country?: string) => number;
  getFinalTotal: (country?: string) => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      );

      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, size?: string, color?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setItems(prev => prev.map(item =>
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = (country?: string) => {
    const subtotal = getTotalPrice();
    
    // Free shipping on orders over €150
    if (subtotal >= 150) {
      return 0;
    }
    
    // Default to Europe shipping if no country specified
    if (!country) {
      return 15; // Europe shipping
    }
    
    // Spain gets €10 shipping, all other Europe gets €15
    if (country.toLowerCase() === 'spain' || country.toLowerCase() === 'es') {
      return 10;
    }
    
    // Default Europe shipping
    return 15;
  };

  const getFinalTotal = (country?: string) => {
    return getTotalPrice() + getShippingCost(country);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      getShippingCost,
      getFinalTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};