import { useMemo } from "react";
import useCart from "./useCart";
import useCurrency from "./useCurrency";
import { convertFromInr } from "../utils/formatPrice";

export default function useCartSummary() {
  const { lines, itemCount } = useCart();
  const { country } = useCurrency();

  return useMemo(() => {
    const detailed = lines.map((line) => {
      const product = line.product;

      if (!product) return null;

      const priceInr = Number(product.price ?? product.priceInr ?? 0);
      const unit = convertFromInr(priceInr, country);

      return {
        lineId: line.lineId,
        productId: line.productId,
        product,
        quantity: line.quantity,
        unit,
        lineTotal: unit * line.quantity,
      };
    }).filter(Boolean);

    const subtotal = detailed.reduce(
      (total, line) => total + line.lineTotal,
      0
    );

    return {
      lines: detailed,
      subtotal,
      itemCount,
    };
  }, [lines, itemCount, country]);
}