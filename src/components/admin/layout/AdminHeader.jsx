
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  UserCircle,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import {
  adminLogout,
  getAdminUser
} from "../../../services/admin/auth.service";

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const admin = getAdminUser();

  function handleLogout() {
    adminLogout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <header className="relative z-30 flex h-20 items-center justify-between border-b border-[#eee8df] bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#5b302e] hover:bg-[#f5f0e9] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-[#4b2927] sm:text-base">
            Admin Panel
          </h2>
          <p className="hidden text-xs text-[#9b8878] sm:block">
            Manage your ADYA store
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowProfile((current) => !current)}
          className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#f7f3ed] sm:px-3"
        >
          <UserCircle size={25} className="text-[#79534a]" />

          <div className="hidden text-left sm:block">
            <p className="max-w-36 truncate text-sm font-medium text-[#4b2927]">
              {admin?.name || "Administrator"}
            </p>
            <p className="text-xs text-[#9b8878]">Admin</p>
          </div>

          <ChevronDown size={16} className="text-[#9b8878]" />
        </button>

        {showProfile && (
          <>
            <button
              type="button"
              aria-label="Close profile menu"
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 z-40 cursor-default"
            />

            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-[#eee8df] bg-white p-2 shadow-xl">
              <div className="border-b border-[#eee8df] px-3 py-3">
                <p className="truncate text-sm font-medium text-[#4b2927]">
                  {admin?.name || "Administrator"}
                </p>
                <p className="truncate text-xs text-[#9b8878]">
                  {admin?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
