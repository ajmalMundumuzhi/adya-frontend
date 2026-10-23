import { useCallback, useMemo, useState } from 'react';
import CartContext from './CartContext';
import { INITIAL_CART_LINES } from '../data/sampleProduct';

const MAX_QUANTITY = 9;

export default function CartProvider({ children }) {
  const [lines, setLines] = useState(INITIAL_CART_LINES);

  const updateQuantity = useCallback((productId, delta) => {
    setLines((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(1, line.quantity + delta)) }
          : line,
      ),
    );
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines],
  );

  const value = useMemo(() => ({ lines, itemCount, updateQuantity }), [lines, itemCount, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}