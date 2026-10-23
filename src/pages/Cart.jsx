
import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import useCart from '../hooks/useCart';
import useCartSummary from '../hooks/useCartSummary';
import useCurrency from '../hooks/useCurrency';

export default function Cart() {
  const { lines, updateQuantity, removeFromCart } = useCart();
  const { lines: detailedLines, subtotal } = useCartSummary();
  const { format } = useCurrency();

  const isEmpty = lines.length === 0;
  const itemCount = lines.reduce(
    (total, line) => total + line.quantity,
    0,
  );

  if (isEmpty) {
    return (
      <main className="min-h-[60vh] bg-ivory-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <ShoppingBag
            className="mx-auto h-12 w-12 text-burgundy/40"
            strokeWidth={1.2}
          />
          <h1 className="mt-6 font-display text-4xl text-burgundy sm:text-5xl">
            Your shopping bag
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/60">
            Your bag is waiting for something beautiful. Explore our collection
            and find something special.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 bg-burgundy px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-burgundy/90"
          >
            Continue shopping <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-burgundy/10 pb-6 sm:mb-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-dark">
            Your selection
          </p>
          <h1 className="mt-2 font-display text-4xl text-burgundy sm:text-5xl">
            Shopping bag
          </h1>
          <p className="mt-3 text-sm text-ink/60">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <section>
            <div className="hidden grid-cols-[minmax(0,1fr)_100px_110px] border-b border-ink/10 pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50 sm:grid">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>

            <div className="divide-y divide-ink/10">
              {detailedLines.map(({ product, quantity, unit, lineTotal }) => (
                <article
                  key={product.id}
                  className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[112px_minmax(0,1fr)_100px_110px] sm:items-center sm:gap-5"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="overflow-hidden bg-ivory-100"
                  >
                    <img
                      src={
                        product.image ||
                        product.variants?.[0]?.images?.[0] ||
                        productImagesFallback(product.id)
                      }
                      alt={product.name}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="font-display text-lg leading-6 text-ink transition hover:text-burgundy"
                    >
                      {product.name}
                    </Link>

                    {product.selectedColor && (
                      <p className="mt-1 text-xs text-ink/60">
                        Color: {product.selectedColor}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-ink/70">
                      {format(unit)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink/50 transition hover:text-burgundy sm:mt-4"
                    >
                      <Trash2 size={13} /> Remove
                    </button>

                    <div className="mt-4 flex items-center justify-between sm:hidden">
                      <QuantityControl
                        product={product}
                        quantity={quantity}
                        updateQuantity={updateQuantity}
                        mobile
                      />
                      <span className="text-sm font-medium">
                        {format(lineTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden justify-center sm:flex">
                    <QuantityControl
                      product={product}
                      quantity={quantity}
                      updateQuantity={updateQuantity}
                    />
                  </div>

                  <div className="hidden text-right text-sm font-medium sm:block">
                    {format(lineTotal)}
                  </div>
                </article>
              ))}
            </div>

            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:text-gold-dark"
            >
              <ArrowLeft size={15} /> Continue shopping
            </Link>
          </section>

          <aside className="h-fit border border-ink/10 bg-white/50 p-5 sm:p-7 lg:sticky lg:top-6">
            <h2 className="font-display text-2xl text-burgundy">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-ink/10 pb-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-medium">{format(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-ink/60">Shipping</span>
                <span className="text-xs text-ink/60">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-5">
              <span className="font-display text-xl text-burgundy">
                Estimated total
              </span>
              <span className="text-lg font-semibold">{format(subtotal)}</span>
            </div>

            <p className="mb-5 text-xs leading-5 text-ink/50">
              Taxes and delivery charges, if applicable, are confirmed at
              checkout.
            </p>

            <button
              type="button"
              disabled
              title="Checkout will be enabled when the checkout flow is implemented"
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 bg-burgundy/60 px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white"
            >
              Proceed to checkout <ArrowRight size={16} />
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-ink/50">
              <ShoppingBag size={14} />
              Secure checkout coming soon
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function QuantityControl({
  product,
  quantity,
  updateQuantity,
  mobile = false,
}) {
  return (
    <div
      className={`flex h-9 items-center border border-ink/15 ${
        mobile ? '' : ''
      }`}
    >
      <button
        type="button"
        aria-label={`Decrease ${product.name} quantity`}
        onClick={() => updateQuantity(product.id, -1)}
        disabled={quantity <= 1}
        className={`flex h-full items-center justify-center disabled:opacity-30 ${
          mobile ? 'w-9' : 'w-8'
        }`}
      >
        <Minus size={13} />
      </button>

      <span className="w-7 text-center text-xs">{quantity}</span>

      <button
        type="button"
        aria-label={`Increase ${product.name} quantity`}
        onClick={() => updateQuantity(product.id, 1)}
        disabled={quantity >= 9}
        className={`flex h-full items-center justify-center disabled:opacity-30 ${
          mobile ? 'w-9' : 'w-8'
        }`}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function productImagesFallback(productId) {
  const images = {
    'kanjivaram-ruby':
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
    'banarasi-ivory':
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=500&q=80',
    'chanderi-gold':
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
  };

  return images[productId] || images['kanjivaram-ruby'];
}
