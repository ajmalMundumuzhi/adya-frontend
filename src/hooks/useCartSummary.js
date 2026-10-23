
import { useMemo } from 'react';
import useCart from './useCart';
import useCurrency from './useCurrency';
import { SAMPLE_PRODUCTS_BY_ID } from '../data/sampleProduct';
import { convertFromInr } from '../utils/formatPrice';

export default function useCartSummary() {
  const { lines, itemCount } = useCart();
  const { country } = useCurrency();

  return useMemo(() => {
    const detailed = lines.map((line) => {
      const product = line.product || SAMPLE_PRODUCTS_BY_ID[line.productId];

      if (!product) return null;

      const unit = convertFromInr(product.priceInr, country);

      return {
        product,
        quantity: line.quantity,
        unit,
        lineTotal: unit * line.quantity,
      };
    }).filter(Boolean);

    const subtotal = detailed.reduce(
      (total, line) => total + line.lineTotal,
      0,
    );

    return { lines: detailed, subtotal, itemCount };
  }, [lines, itemCount, country]);
}
