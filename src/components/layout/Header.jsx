import { useCallback, useState } from 'react';
import { Menu } from 'lucide-react';
import Logo from '../common/Logo';
import DesktopNav from './DesktopNav';
import HeaderActions from './HeaderActions';
import HeaderContact from './HeaderContact';
import SearchPanel from './SearchPanel';
import { MOBILE_MENU_BUTTON_ID } from '../../config/navigation';

export default function Header({ menuOpen, onOpenMenu }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 lg:grid lg:h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          <div className="flex items-center lg:justify-self-start">
            <button
              id={MOBILE_MENU_BUTTON_ID}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={onOpenMenu}
              className="icon-btn -ml-2 lg:hidden"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <HeaderContact />
          </div>

          <div className="lg:justify-self-center">
            <Logo />
          </div>

          <div className="lg:justify-self-end">
            <HeaderActions
              searchOpen={searchOpen}
              onToggleSearch={() => setSearchOpen((current) => !current)}
            />
          </div>
        </div>

        <div className="hidden border-t border-burgundy/10 lg:block">
          <DesktopNav />
        </div>
      </div>
      <SearchPanel open={searchOpen} onClose={closeSearch} />
    </header>
  );
}