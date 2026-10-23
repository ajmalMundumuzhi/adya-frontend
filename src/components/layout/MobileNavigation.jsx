import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingBag, User, X } from 'lucide-react';
import Logo from '../common/Logo';
import CountrySelector from '../common/CountrySelector';
import SocialLinks from '../common/SocialLinks';
import { MOBILE_MENU_BUTTON_ID, PRIMARY_NAV } from '../../config/navigation';
import { SITE } from '../../config/site';
import useCart from '../../hooks/useCart';
import useScrollLock from '../../hooks/useScrollLock';

const rowClass = ({ isActive }) =>
  `flex min-h-12 flex-1 items-center rounded-lg px-3 text-base font-medium transition-colors ${
    isActive ? 'bg-burgundy/10 text-burgundy' : 'text-ink hover:bg-burgundy/5'
  }`;

export default function MobileNavigation({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);
  const { itemCount } = useCart();
  useScrollLock(open);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      document.getElementById(MOBILE_MENU_BUTTON_ID)?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => {
      if (event.matches) onClose();
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        open ? 'visible' : 'invisible transition-[visibility] duration-300'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-r border-burgundy/30 bg-ivory-100/90 shadow-glass backdrop-blur-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-burgundy/15 px-4">
          <Logo onClick={onClose} />
          <button ref={closeRef} type="button" aria-label="Close menu" onClick={onClose} className="icon-btn -mr-2">
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="px-3 py-4">
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.key}>
                    <div className="flex">
                      <NavLink to={item.to} end={item.to === '/'} onClick={onClose} className={rowClass}>
                        {item.label}
                      </NavLink>
                    </div>
                  </li>
                );
              }
              const isExpanded = expanded === item.key;
              const panelId = `mobile-nav-${item.key}`;
              return (
                <li key={item.key}>
                  <div className="flex items-center">
                    <NavLink to={item.to} onClick={onClose} className={rowClass}>
                      {item.label}
                    </NavLink>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      aria-label={`${item.label} submenu`}
                      onClick={() => setExpanded(isExpanded ? null : item.key)}
                      className="icon-btn h-12 w-12"
                    >
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {isExpanded && (
                    <ul id={panelId} className="mb-2 ml-3 space-y-0.5 border-l border-gold/60 pl-3">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex min-h-11 items-center rounded-lg px-3 text-[15px] transition-colors ${
                                isActive ? 'bg-burgundy/10 text-burgundy' : 'text-ink/80 hover:bg-burgundy/5'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-burgundy/15 px-3 py-4">
          <Link to="/account" onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base text-ink hover:bg-burgundy/5">
            <User size={20} aria-hidden="true" />
            Login / Register
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base text-ink hover:bg-burgundy/5">
            <Heart size={20} aria-hidden="true" />
            Wishlist
          </Link>
          <Link to="/cart" onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base text-ink hover:bg-burgundy/5">
            <ShoppingBag size={20} aria-hidden="true" />
            Cart
            {itemCount > 0 && (
              <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="mt-auto space-y-4 border-t border-burgundy/15 px-4 py-5">
          <CountrySelector variant="drawer" />
          <div className="space-y-1 text-sm text-ink/70">
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="block hover:text-burgundy">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block break-all hover:text-burgundy">
              {SITE.email}
            </a>
          </div>
          <SocialLinks className="-ml-2 flex" itemClassName="text-burgundy hover:bg-burgundy/10" />
        </div>
      </div>
    </div>
  );
}