import { Minus, Plus } from 'lucide-react';
import Price from '../common/Price';
import useCart from '../../hooks/useCart';
import useCartSummary from '../../hooks/useCartSummary';
import useCurrency from '../../hooks/useCurrency';
import { RATES_DISCLAIMER } from '../../config/currency';

export default function CurrencyPreview() {
  const { country, format } = useCurrency();
  const { updateQuantity } = useCart();
  const { lines, subtotal, itemCount } = useCartSummary();

  return (
    <section aria-labelledby="currency-preview-title" className="glass-panel rounded-2xl p-5 sm:p-8">
      <h2 id="currency-preview-title" className="font-display text-2xl font-semibold text-burgundy sm:text-3xl">
        Currency preview
      </h2>
      <p className="mt-1 text-sm text-ink/70">
        Destination: <strong className="font-semibold">{country.name}</strong> &middot; {country.currency} &middot;{' '}
        {country.locale}
      </p>

      <ul className="mt-6 divide-y divide-burgundy/10">
        {lines.map(({ product, quantity, lineTotal }) => (
          <li key={product.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-ink">{product.name}</p>
              <Price amountInr={product.priceInr} compareAtInr={product.compareAtInr} className="text-sm" />
            </div>
            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${product.name}`}
                  onClick={() => updateQuantity(product.id, -1)}
                  className="icon-btn border border-burgundy/20"
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span aria-live="polite" className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${product.name}`}
                  onClick={() => updateQuantity(product.id, 1)}
                  className="icon-btn border border-burgundy/20"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              <span className="min-w-[5.5rem] text-right font-semibold text-ink">{format(lineTotal)}</span>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-2 flex items-center justify-between border-t border-burgundy/20 pt-4">
        <dt className="text-sm text-ink/70">Subtotal ({itemCount} items)</dt>
        <dd className="font-display text-2xl font-semibold text-burgundy">{format(subtotal)}</dd>
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-ink/60">{RATES_DISCLAIMER}</p>
    </section>
  );
}