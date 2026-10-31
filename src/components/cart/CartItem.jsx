import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import QuantityControl from "./QuantityControl";

export default function CartItem({
  line,
  format,
  updateQuantity,
  removeFromCart,
}) {
  const { lineId, product, quantity, unit, lineTotal } = line;
  const productUrl = `/product/${product.slug || product.id || line.productId}`;
  const image =
    product.image ||
    product.imagePath ||
    product.images?.[0] ||
    product.variants?.[0]?.images?.[0];

  return (
    <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[112px_minmax(0,1fr)_100px_110px] sm:items-center sm:gap-5">
      <Link to={productUrl} className="overflow-hidden bg-ivory-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="aspect-[3/4] w-full" />
        )}
      </Link>

      <div className="min-w-0">
        <Link
          to={productUrl}
          className="font-display text-lg leading-6 text-ink transition hover:text-burgundy"
        >
          {product.name}
        </Link>

        {product.selectedColor && (
          <p className="mt-1 text-xs text-ink/60">
            Color: {product.selectedColor}
          </p>
        )}

        {product.selectedSize && (
          <p className="mt-1 text-xs text-ink/60">
            Size: {product.selectedSize}
          </p>
        )}

        {product.sku && (
          <p className="mt-1 text-xs text-ink/50">SKU: {product.sku}</p>
        )}

        <p className="mt-2 text-sm text-ink/70">{format(unit)}</p>

        <button
          type="button"
          onClick={() => removeFromCart(lineId)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink/50 transition hover:text-burgundy sm:mt-4"
        >
          <Trash2 size={13} /> Remove
        </button>

        <div className="mt-4 flex items-center justify-between sm:hidden">
          <QuantityControl
            lineId={lineId}
            product={product}
            quantity={quantity}
            maxStock={product.stock}
            updateQuantity={updateQuantity}
            mobile
          />
          <span className="text-sm font-medium">{format(lineTotal)}</span>
        </div>
      </div>

      <div className="hidden justify-center sm:flex">
        <QuantityControl
          lineId={lineId}
          product={product}
          quantity={quantity}
          maxStock={product.stock}
          updateQuantity={updateQuantity}
        />
      </div>

      <div className="hidden text-right text-sm font-medium sm:block">
        {format(lineTotal)}
      </div>
    </article>
  );
}
