import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import Footer from './Footer';
import ScrollToTop from './ScrollTop';
import { ANNOUNCEMENTS } from '../../config/site';

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <div aria-hidden="true" className="page-backdrop" />
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AnnouncementBar messages={ANNOUNCEMENTS} />
      <Header menuOpen={menuOpen} onOpenMenu={openMenu} />
      <MobileNavigation open={menuOpen} onClose={closeMenu} />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}