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
      const product = SAMPLE_PRODUCTS_BY_ID[line.productId];
      const unit = convertFromInr(product.priceInr, country);
      return { product, quantity: line.quantity, unit, lineTotal: unit * line.quantity };
    });
    const subtotal = detailed.reduce((total, line) => total + line.lineTotal, 0);
    return { lines: detailed, subtotal, itemCount };
  }, [lines, itemCount, country]);
}