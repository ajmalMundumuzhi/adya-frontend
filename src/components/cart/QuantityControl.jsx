import { Minus, Plus } from "lucide-react";

export default function QuantityControl({
  lineId,
  product,
  quantity,
  maxStock,
  updateQuantity,
  mobile = false,
}) {
  const stockLimit = Math.max(
    0,
    Number(maxStock ?? product?.stock ?? 0),
  );

  return (
    <div className="flex items-center border h-9 border-ink/15">
      <button
        type="button"
        aria-label={`Decrease ${product.name} quantity`}
        onClick={() => updateQuantity(lineId, quantity - 1)}
        disabled={quantity <= 1}
        className={`flex h-full items-center justify-center disabled:opacity-30 ${
          mobile ? "w-9" : "w-8"
        }`}
      >
        <Minus size={13} />
      </button>

      <span className="text-xs text-center w-7">
        {quantity}
      </span>

      <button
        type="button"
        aria-label={`Increase ${product.name} quantity`}
        onClick={() => updateQuantity(lineId, quantity + 1)}
        disabled={quantity >= stockLimit}
        className={`flex h-full items-center justify-center disabled:opacity-30 ${
          mobile ? "w-9" : "w-8"
        }`}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}