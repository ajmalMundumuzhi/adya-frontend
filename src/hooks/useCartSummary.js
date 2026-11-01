import { useMemo } from 'react';
import useCurrency from './useCurrency';

export default function useCartSummary(cart) {
  const { convert, formatPrice } = useCurrency();

  return useMemo(() => {
    const items = cart?.items || [];

    const itemCount = items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    const subtotalAUD = items.reduce((total, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);

    const compareAtTotalAUD = items.reduce((total, item) => {
      const price = Number(
        item.compareAtPrice || item.price || 0
      );

      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);

    const subtotal = convert(subtotalAUD);
    const compareAtTotal = convert(compareAtTotalAUD);

    return {
      items,
      itemCount,
      subtotalAUD,
      compareAtTotalAUD,
      subtotal,
      compareAtTotal,
      formattedSubtotal: formatPrice(subtotalAUD),
      formattedCompareAtTotal: formatPrice(compareAtTotalAUD),
      hasSavings: compareAtTotalAUD > subtotalAUD,
      savingsAUD: Math.max(0, compareAtTotalAUD - subtotalAUD),
      formattedSavings: formatPrice(
        Math.max(0, compareAtTotalAUD - subtotalAUD)
      ),
    };
  }, [cart, convert, formatPrice]);
}