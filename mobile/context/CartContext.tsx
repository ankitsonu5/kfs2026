import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  discountPrice: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSavings: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 1. Add to Cart
  const addToCart = (product: any, qty: number = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item._id === product._id);

      const productImage =
        product.images && product.images.length > 0
          ? product.images[0]
          : product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200';

      if (existingIndex > -1) {
        // Agar pehle se cart me hai to quantity badhayein
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qty;
        const maxStock = product.stock || 10;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        // Naya item add karein
        return [
          ...prevItems,
          {
            _id: product._id,
            title: product.title,
            price: Number(product.price) || 0,
            discountPrice: Number(product.discountPrice) || 0,
            image: productImage,
            quantity: qty,
            stock: product.stock || 10,
          },
        ];
      }
    });
  };

  // 2. Remove Item
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // 3. Update Quantity
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: qty } : item))
    );
  };

  // 4. Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // 5. Total Price
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // 6. Total Savings
  const getCartSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.discountPrice > item.price) {
        return sum + (item.discountPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);
  };

  // 7. Total Items Count
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartSavings,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
