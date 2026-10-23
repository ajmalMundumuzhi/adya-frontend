import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart } from 'lucide-react';
import Price from '../common/Price';

export default function ProductCard({ product }) {
  const [showBack, setShowBack] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    priceInr,
    compareAtInr,
    image,
    backImage,
    tag,
    to,
  } = product;

  const productUrl = to || `/product/${id}`;
  const currentImage = showBack && backImage ? backImage : image;

  return (
    <article className="group min-w-0">
      <div
        className="relative overflow-hidden rounded-sm bg-ivory-100"
        onMouseEnter={() => {
          if (backImage) setShowBack(true);
        }}
        onMouseLeave={() => setShowBack(false)}
      >
        <Link
          to={productUrl}
          aria-label={`View ${name}`}
          className="block aspect-[3/4] overflow-hidden"
          onClick={(event) => {
            if (backImage && !showBack) {
              event.preventDefault();
              setShowBack(true);
            }
          }}
        >
          <img
            src={image}
            alt={`${name} front view`}
            loading="lazy"
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              showBack && backImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {backImage && (
            <img
              src={backImage}
              alt={`${name} back view`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                showBack ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {tag && (
          <span className="absolute left-3 top-3 bg-ivory-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-burgundy sm:left-4 sm:top-4">
            {tag}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${name} to wishlist`}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ivory-50/95 text-ink transition-colors hover:bg-white sm:right-4 sm:top-4"
        >
          <Heart size={17} strokeWidth={1.6} aria-hidden="true" />
        </button>

        <Link
          to={productUrl}
          aria-label={`View details for ${name}`}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory-50 text-burgundy transition-colors hover:bg-gold-light sm:bottom-4 sm:right-4"
        >
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <div className="pt-4">
        <Link
          to={productUrl}
          className="line-clamp-2 text-sm font-medium leading-6 text-ink transition-colors hover:text-burgundy sm:text-base"
        >
          {name}
        </Link>

        <div className="mt-2 text-sm">
          <Price
            amountInr={priceInr}
            compareAtInr={compareAtInr}
          />
        </div>
      </div>
    </article>
  );
}
