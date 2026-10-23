
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const saved = localStorage.getItem('adya-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('adya-cart', JSON.stringify(lines));
  }, [lines]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product?.id) return;

    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);

      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          quantity,
          product,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.productId !== productId));
      return;
    }

    setLines((current) =>
      current.map((line) =>
        line.productId === productId ? { ...line, quantity } : line
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [lines, itemCount, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
