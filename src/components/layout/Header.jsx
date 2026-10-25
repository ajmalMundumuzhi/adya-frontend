
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
    <header className="sticky top-0 z-50 border-b border-[#B49A68]/30 bg-[#F8F3E8] text-[#493829] shadow-[0_4px_20px_rgba(73,56,41,0.06)] md:static md:z-auto">
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
              className="icon-btn -ml-2 text-[#493829] hover:bg-[#D4BC98]/40 lg:hidden"
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
        <div className="hidden border-t border-[#B49A68]/25 lg:block">
          <DesktopNav />
        </div>
      </div>
      <SearchPanel open={searchOpen} onClose={closeSearch} />
    </header>
  );
}