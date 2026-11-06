import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Tags,
  Package,
  Settings,
  Store,
  Image,
  Star,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: ShoppingBag },
  { label: "Banners", path: "/admin/banners", icon: Image },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Categories", path: "/admin/categories", icon: Tags },
  { label: "Inventory", path: "/admin/inventory", icon: Package },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#eee8df] bg-[#fffdf9] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#eee8df] px-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-[0.18em] text-[#4b2927]">
              ADYA
            </h1>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#9b806b]">
              Administration
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#725b4d] hover:bg-[#f4eee6] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a18c7c]">
            Main Menu
          </p>

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-[#5b302e] font-medium text-white shadow-sm"
                    : "text-[#715d50] hover:bg-[#f4eee6] hover:text-[#4b2927]"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#eee8df] p-5">
          <div className="rounded-xl bg-[#f5f0e9] p-4">
            <div className="flex items-center gap-2 text-[#5b302e]">
              <Store size={17} />
              <span className="text-xs font-semibold">ADYA Store</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#927e6e]">
              Manage your store from one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}