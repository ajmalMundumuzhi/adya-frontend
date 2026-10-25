import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingBag, User, X } from 'lucide-react';
import Logo from '../common/Logo';
import CountrySelector from '../common/CountrySelector';
import SocialLinks from '../common/SocialLinks';
import { MOBILE_MENU_BUTTON_ID, PRIMARY_NAV } from '../../config/navigation';
import { SITE } from '../../config/site';
import useCart from '../../hooks/useCart';
import useScrollLock from '../../hooks/useScrollLock';

const rowClass = ({ isActive }) =>
  `flex min-h-[62px] flex-1 items-center px-3 py-4 font-display text-xl transition-colors sm:text-2xl ${
    isActive
      ? 'font-semibold text-[#493829]'
      : 'text-[#493829] hover:text-[#B49A68]'
  }`;

const utilityClass =
  'flex min-h-[62px] items-center gap-5 px-3 py-4 font-display text-lg text-[#493829] transition-colors hover:bg-[#D4BC98]/20 sm:text-xl';

export default function MobileNavigation({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);
  const location = useLocation();
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
    setExpanded(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => {
      if (event.matches) onClose();
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? 'visible' : 'invisible'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-[#493829]/45 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-r border-[#B49A68]/30 bg-[#F8F3E8] shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#493829]/15 px-5">
          <Logo onClick={onClose} />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#493829] hover:bg-[#D4BC98]/35"
          >
            <X size={23} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="px-5">
          <ul>
            {PRIMARY_NAV.map((item) => {
              const children = item.children?.length ? item.children : null;
              const isExpanded = expanded === item.key;

              return (
                <li key={item.key} className="border-b border-[#493829]/15">
                  {children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-nav-${item.key}`}
                        onClick={() => setExpanded(isExpanded ? null : item.key)}
                        className="flex min-h-[62px] w-full flex-row items-center justify-between px-3 py-4 text-left font-display text-xl text-[#493829] transition-colors hover:text-[#B49A68] sm:text-2xl"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={21}
                          aria-hidden="true"
                          className={`shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <ul
                          id={`mobile-nav-${item.key}`}
                          className="mb-4 ml-4 border-l border-[#B49A68]/60 pl-4"
                        >
                          {children.map((child) => (
                            <li key={child.to}>
                              <NavLink
                                to={child.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `flex min-h-11 items-center px-3 text-sm transition-colors ${
                                    isActive
                                      ? 'font-semibold text-[#493829]'
                                      : 'text-[#493829]/75 hover:text-[#B49A68]'
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={rowClass}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <ul className="mt-3 px-5">
          <li className="border-b border-[#493829]/15">
            <Link to="/account" onClick={onClose} className={utilityClass}>
              <User size={25} strokeWidth={1.5} aria-hidden="true" />
              <span className="flex-1">My Account</span>
            </Link>
          </li>

          <li className="border-b border-[#493829]/15">
            <Link to="/wishlist" onClick={onClose} className={utilityClass}>
              <Heart size={25} strokeWidth={1.5} aria-hidden="true" />
              <span className="flex-1">Wishlist</span>
            </Link>
          </li>

          <li className="border-b border-[#493829]/15">
            <Link to="/cart" onClick={onClose} className={utilityClass}>
              <ShoppingBag size={25} strokeWidth={1.5} aria-hidden="true" />
              <span className="flex-1">Shopping cart</span>
              {itemCount > 0 && (
                <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#D4BC98] px-2 text-sm font-semibold text-[#493829]">
                  {itemCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        <div className="mt-auto space-y-4 border-t border-[#493829]/15 px-5 py-5">
          <CountrySelector variant="drawer" />

          <div className="space-y-2 text-sm text-[#493829]/75">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              className="block hover:text-[#B49A68]"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="block break-all hover:text-[#B49A68]"
            >
              {SITE.email}
            </a>
          </div>

          <SocialLinks
            className="-ml-2 flex"
            itemClassName="text-[#493829] hover:bg-[#D4BC98]/40"
          />
        </div>
      </div>
    </div>
  );
}