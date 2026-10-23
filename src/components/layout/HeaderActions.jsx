import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import CountrySelector from '../common/CountrySelector';
import useCart from '../../hooks/useCart';
import useCartSummary from '../../hooks/useCartSummary';
import useCurrency from '../../hooks/useCurrency';

export default function HeaderActions({ searchOpen, onToggleSearch }) {
  const { itemCount } = useCart();
  const { subtotal } = useCartSummary();
  const { format } = useCurrency();

  return (
    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
      <div className="mr-1 hidden min-[380px]:block">
        <CountrySelector variant="header" />
      </div>

      <Link
        to="/account"
        className="hidden items-center gap-2 px-2 text-[13px] font-medium uppercase tracking-[0.12em] text-ink/80 hover:text-burgundy 2xl:inline-flex"
      >
        Login / Register
      </Link>
      <Link to="/account" aria-label="Account" className="icon-btn hidden lg:inline-flex 2xl:hidden">
        <User size={20} aria-hidden="true" />
      </Link>

      <button
        type="button"
        aria-label="Search"
        aria-expanded={searchOpen}
        aria-controls="header-search-panel"
        data-search-toggle
        onClick={onToggleSearch}
        className="icon-btn"
      >
        <Search size={20} aria-hidden="true" />
      </button>

      <Link to="/wishlist" aria-label="Wishlist" className="icon-btn hidden lg:inline-flex">
        <Heart size={20} aria-hidden="true" />
      </Link>

      <Link
        to="/cart"
        aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
        className="relative inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-ink transition-colors hover:bg-burgundy/10"
      >
        <span className="relative inline-flex">
          <ShoppingBag size={20} aria-hidden="true" />
          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </span>
        <span className="hidden text-sm font-medium xl:inline">{format(subtotal)}</span>
      </Link>
    </div>
  );
}