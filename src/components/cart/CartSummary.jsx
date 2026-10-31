import { ArrowRight, ShoppingBag } from "lucide-react";

export default function CartSummary({ subtotal, format }) {
  return (
    <aside className="h-fit border border-ink/10 bg-white/50 p-5 sm:p-7 lg:sticky lg:top-6">
      <h2 className="font-display text-2xl text-burgundy">Order summary</h2>

      <div className="mt-6 space-y-4 border-b border-ink/10 pb-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Subtotal</span>
          <span className="font-medium">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Shipping</span>
          <span className="text-xs text-ink/60">Calculated at checkout</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 py-5">
        <span className="font-display text-xl text-burgundy">
          Estimated total
        </span>
        <span className="text-lg font-semibold">{format(subtotal)}</span>
      </div>

      <p className="mb-5 text-xs leading-5 text-ink/50">
        Taxes and delivery charges, if applicable, are confirmed at checkout.
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
  );
}
