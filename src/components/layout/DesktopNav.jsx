import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { PRIMARY_NAV } from '../../config/navigation';
import useDismiss from '../../hooks/useDismiss';

const linkClass = ({ isActive }) =>
  `relative inline-flex items-center py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:bg-gold after:transition-transform ${
    isActive
      ? 'text-burgundy after:scale-x-100'
      : 'text-ink/80 hover:text-burgundy after:scale-x-0 hover:after:scale-x-100'
  }`;

export default function DesktopNav() {
  const [openKey, setOpenKey] = useState(null);
  const navRef = useRef(null);
  useDismiss(navRef, openKey !== null, () => setOpenKey(null));

  return (
    <nav ref={navRef} aria-label="Primary" className="hidden justify-center lg:flex">
      <ul className="flex items-center gap-9">
        {PRIMARY_NAV.map((item) => {
          if (!item.children) {
            return (
              <li key={item.key}>
                <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            );
          }

          const open = openKey === item.key;
          const panelId = `desktop-nav-${item.key}`;
          return (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => setOpenKey(item.key)}
              onMouseLeave={() => setOpenKey(null)}
            >
              <div className="flex items-center gap-0.5">
                <NavLink to={item.to} className={linkClass} onClick={() => setOpenKey(null)}>
                  {item.label}
                </NavLink>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={`${item.label} submenu`}
                  onClick={() => setOpenKey(open ? null : item.key)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink/60 hover:text-burgundy"
                >
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              {open && (
                <div id={panelId} className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1">
                  <ul className="w-60 animate-fade-in rounded-xl border border-burgundy/15 bg-ivory-100/90 p-2 shadow-glass backdrop-blur-xl">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          onClick={() => setOpenKey(null)}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'bg-burgundy/10 text-burgundy'
                                : 'text-ink/80 hover:bg-burgundy/5 hover:text-burgundy'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}