
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Footer";
import ScrollToTop from "./ScrollTop";
import { ANNOUNCEMENTS } from "../../config/site";
import { getSetting } from "../../services/admin/settings.service";

const DEFAULT_ANNOUNCEMENT_SETTINGS = {
  enabled: true,
  intervalMs: 5000,
  messages: ANNOUNCEMENTS,
};

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementSettings, setAnnouncementSettings] = useState(
    DEFAULT_ANNOUNCEMENT_SETTINGS
  );

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let active = true;

    async function loadAnnouncementSettings() {
      try {
        const setting = await getSetting("site.announcement");

        if (!active || !setting?.value) return;

        const saved = setting.value;

        setAnnouncementSettings({
          enabled: saved.enabled ?? true,
          intervalMs: saved.intervalMs ?? 5000,
          messages: Array.isArray(saved.messages)
            ? saved.messages
            : ANNOUNCEMENTS,
        });
      } catch (error) {
        console.error("Failed to load announcement settings:", error);
      }
    }

    loadAnnouncementSettings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <div aria-hidden="true" className="page-backdrop" />
      <ScrollToTop />

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="sticky top-0 z-50">
        {announcementSettings.enabled && (
          <AnnouncementBar
            messages={announcementSettings.messages}
            intervalMs={announcementSettings.intervalMs}
          />
        )}

        <Header menuOpen={menuOpen} onOpenMenu={openMenu} />

        <MobileNavigation open={menuOpen} onClose={closeMenu} />
      </div>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
