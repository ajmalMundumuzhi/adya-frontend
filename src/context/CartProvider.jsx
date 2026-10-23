
import { useCallback, useEffect, useMemo, useState } from 'react';
import CartContext from './CartContext';
import { INITIAL_CART_LINES } from '../data/sampleProduct.js';

const MAX_QUANTITY = 9;

export default function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const saved = localStorage.getItem('adya-cart');
      return saved ? JSON.parse(saved) : INITIAL_CART_LINES;
    } catch {
      return INITIAL_CART_LINES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('adya-cart', JSON.stringify(lines));
    } catch {
    }
  }, [lines]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product?.id) return;

    const safeQuantity = Math.min(
      MAX_QUANTITY,
      Math.max(1, Number(quantity) || 1),
    );

    setLines((current) => {
      const existing = current.find(
        (line) => line.productId === product.id,
      );

      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? {
                ...line,
                quantity: Math.min(
                  MAX_QUANTITY,
                  line.quantity + safeQuantity,
                ),
                product,
              }
            : line,
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          quantity: safeQuantity,
          product,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setLines((current) =>
      current.filter((line) => line.productId !== productId),
    );
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setLines((current) =>
      current.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantity: Math.min(
                MAX_QUANTITY,
                Math.max(1, line.quantity + delta),
              ),
            }
          : line,
      ),
    );
  }, []);

  const setCartQuantity = useCallback((productId, quantity) => {
    const safeQuantity = Number(quantity);

    if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
      setLines((current) =>
        current.filter((line) => line.productId !== productId),
      );
      return;
    }

    setLines((current) =>
      current.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantity: Math.min(
                MAX_QUANTITY,
                Math.max(1, Math.floor(safeQuantity)),
              ),
            }
          : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      setCartQuantity,
      clearCart,
    }),
    [
      lines,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      setCartQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
