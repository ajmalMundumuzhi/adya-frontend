
export default function CheckoutOrderSummary({
  lines = [],
  formatPrice,
  shippingChargeAUD = null,
  exchangeRate = 1,
  currency = "AUD",
  loadingShipping = false
}) {
  const subtotalAUD = lines.reduce((total, line) => {
    const price = Number(
      line.product?.priceAUD ??
      line.product?.price ??
      line.product?.unitPriceAUD ??
      0
    );

    return total + price * Number(line.quantity || 0);
  }, 0);

  const shipping = Number(shippingChargeAUD || 0);
  const totalAUD = subtotalAUD + shipping;

  const displayPrice = amount => {
    if (typeof formatPrice === "function") {
      return formatPrice(amount);
    }

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency
    }).format(amount * exchangeRate);
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          Step 2
        </p>
        <h2 className="mt-1 text-xl font-semibold text-stone-900">
          Order summary
        </h2>
      </div>

      <div className="space-y-4">
        {lines.map(line => {
          const product = line.product || {};
          const image =
            product.image ||
            product.imageUrl ||
            product.images?.[0] ||
            product.variantImages?.[0] ||
            "";

          const name = product.name || product.productName || "Saree";
          const color = product.color || product.variantColor;
          const size = product.selectedSize || product.size;
          const priceAUD = Number(
            product.priceAUD ??
            product.price ??
            product.unitPriceAUD ??
            0
          );

          return (
            <div
              key={line.lineId}
              className="flex gap-4 border-b border-stone-100 pb-4"
            >
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-stone-400">
                    ADYA
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium text-stone-900">
                  {name}
                </h3>

                {(color || size) && (
                  <p className="mt-1 text-xs text-stone-500">
                    {[color, size].filter(Boolean).join(" / ")}
                  </p>
                )}

                <p className="mt-1 text-xs text-stone-500">
                  Qty: {line.quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-medium text-stone-900">
                {displayPrice(priceAUD * Number(line.quantity || 0))}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-stone-600">
          <span>Subtotal</span>
          <span>{displayPrice(subtotalAUD)}</span>
        </div>

        <div className="flex justify-between gap-4 text-stone-600">
          <span>Shipping</span>
          <span>
            {loadingShipping
              ? "Calculating..."
              : shippingChargeAUD === null
                ? "Select an address"
                : displayPrice(shipping)}
          </span>
        </div>

        <div className="border-t border-stone-200 pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-stone-900">
              Total
            </span>
            <span className="text-lg font-semibold text-stone-900">
              {displayPrice(totalAUD)}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-stone-500">
            Prices displayed in {currency}
          </p>
        </div>
      </div>
    </section>
  );
}
