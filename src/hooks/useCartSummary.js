
import { useMemo } from "react";
import useCurrency from "./useCurrency";
import useCart from "./useCart";

export default function useCartSummary(cart = null) {
  const cartContext = useCart();
  const { convert, formatPrice } = useCurrency();

  return useMemo(() => {
    const source = cart || cartContext;

    const items = Array.isArray(source?.lines)
      ? source.lines
      : Array.isArray(source?.items)
        ? source.items
        : [];

    const getPrice = (item) => {
      const product = item.product || {};

      return Number(
        product.priceAUD ??
        product.unitPriceAUD ??
        product.price ??
        item.priceAUD ??
        item.unitPriceAUD ??
        item.price ??
        0
      );
    };

    const getCompareAtPrice = (item) => {
      const product = item.product || {};

      return Number(
        product.compareAtPriceAUD ??
        product.compareAtPrice ??
        item.compareAtPriceAUD ??
        item.compareAtPrice ??
        getPrice(item)
      );
    };

    const detailedLines = items.map((item) => {
      const unit = getPrice(item);
      const quantity = Number(item.quantity || 0);

      return {
        ...item,
        unit,
        lineTotal: unit * quantity,
      };
    });

    const itemCount = detailedLines.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    const subtotalAUD = detailedLines.reduce(
      (total, item) => total + item.lineTotal,
      0
    );

    const compareAtTotalAUD = items.reduce(
      (total, item) =>
        total + getCompareAtPrice(item) * Number(item.quantity || 0),
      0
    );

    const savingsAUD = Math.max(
      0,
      compareAtTotalAUD - subtotalAUD
    );

    return {
      lines: detailedLines,
      items: detailedLines,
      itemCount,
      subtotalAUD,
      compareAtTotalAUD,
      subtotal: subtotalAUD,
      convertedSubtotal: convert(subtotalAUD),
      formattedSubtotal: formatPrice(subtotalAUD),
      compareAtTotal: convert(compareAtTotalAUD),
      hasSavings: savingsAUD > 0,
      savingsAUD,
      formattedSavings: formatPrice(savingsAUD),
    };
  }, [cart, cartContext, convert, formatPrice]);
}
