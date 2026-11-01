
import useCurrency from "../../hooks/useCurrency";

export default function Price({
  amountAUD,
  compareAtAUD = null,
  className = ""
}) {
  const { formatPrice } = useCurrency();
  const onSale =
    compareAtAUD !== null &&
    compareAtAUD > amountAUD;

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={onSale ? "font-semibold text-burgundy" : "font-semibold"}>
        {formatPrice(amountAUD)}
      </span>

      {onSale && (
        <s className="text-[0.85em] text-ink/50">
          <span className="sr-only">Original price </span>
          {formatPrice(compareAtAUD)}
        </s>
      )}
    </span>
  );
}
