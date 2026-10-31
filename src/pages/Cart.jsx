import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import useCart from "../hooks/useCart";
import useCartSummary from "../hooks/useCartSummary";
import useCurrency from "../hooks/useCurrency";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

export default function Cart() {
  const { lines, updateQuantity, removeFromCart } = useCart();
  const { lines: detailedLines, subtotal } = useCartSummary();
  const { format } = useCurrency();

  const isEmpty = lines.length === 0;
  const itemCount = lines.reduce(
    (total, line) => total + Number(line.quantity || 0),
    0
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
            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
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
              {detailedLines.map((line) => (
                <CartItem
                  key={line.lineId}
                  line={line}
                  format={format}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:text-gold-dark"
            >
              <ArrowLeft size={15} /> Continue shopping
            </Link>
          </section>

          <CartSummary subtotal={subtotal} format={format} />
        </div>
      </div>
    </main>
  );
}