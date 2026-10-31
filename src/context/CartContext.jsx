import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "adya-cart";

function createLineId(product) {
  return [
    product.productId || product.id,
    product.variantId || "no-variant",
    product.sizeOptionId || product.selectedSize || "no-size",
  ].join(":");
}

function readCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((line) => line && line.product)
      .map((line) => {
        const product = line.product;
        const lineId = line.lineId || createLineId({
          ...product,
          productId: line.productId || product.productId || product.id,
        });

        return {
          ...line,
          lineId,
          productId: line.productId || product.productId || product.id,
          quantity: Math.max(1, Number(line.quantity) || 1),
          maxStock: Math.max(0, Number(product.stock ?? line.maxStock ?? 0)),
        };
      });
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      return;
    }
  }, [lines]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !(product.productId || product.id)) return;

    const lineId = createLineId(product);
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const maxStock = Math.max(0, Number(product.stock) || 0);

    if (maxStock <= 0) return;

    setLines((current) => {
      const existing = current.find((line) => line.lineId === lineId);

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId
            ? {
                ...line,
                quantity: Math.min(
                  maxStock,
                  Number(line.quantity || 0) + safeQuantity
                ),
                maxStock,
                product,
              }
            : line
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: product.productId || product.id,
          variantId: product.variantId || null,
          sizeOptionId: product.sizeOptionId || null,
          quantity: Math.min(safeQuantity, maxStock),
          maxStock,
          product,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((lineIdOrProductId) => {
    setLines((current) =>
      current.filter(
        (line) =>
          line.lineId !== lineIdOrProductId &&
          line.productId !== lineIdOrProductId
      )
    );
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    const nextQuantity = Number(quantity);

    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      setLines((current) => current.filter((line) => line.lineId !== lineId));
      return;
    }

    setLines((current) =>
      current.map((line) =>
        line.lineId === lineId
          ? {
              ...line,
              quantity: Math.min(nextQuantity, Number(line.maxStock || 0)),
            }
          : line
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + Number(line.quantity || 0), 0),
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