import { useState } from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Price from '../common/Price';

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-[#eee5d8]">
        <Link to={product.to || '/shop'} aria-label={`View ${product.name}`} className="block aspect-[3/4] overflow-hidden"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></Link>
        {product.tag && <span className="absolute left-3 top-3 rounded-full bg-ivory-50/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-burgundy sm:text-xs">{product.tag}</span>}
        <button type="button" onClick={() => setWishlisted((value) => !value)} aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={wishlisted} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory-50/90 text-burgundy transition-colors hover:bg-white"><Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" /></button>
        <Link to={product.to || '/shop'} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory-50 text-burgundy transition-colors hover:bg-gold-light" aria-label={`Explore ${product.name}`}><ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="pt-4"><Link to={product.to || '/shop'} className="font-display text-xl leading-snug text-ink transition-colors hover:text-burgundy sm:text-2xl">{product.name}</Link><div className="mt-2 text-sm"><Price amountInr={product.priceInr} compareAtInr={product.compareAtInr} /></div></div>
    </article>
  );
}
