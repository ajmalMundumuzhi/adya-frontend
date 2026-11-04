
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PRIMARY_NAV } from "../../config/navigation";
import useDismiss from "../../hooks/useDismiss";
import useHeaderSettings from "../../hooks/useHeaderSettings";
import api from "../../services/api";

const linkClass = ({ isActive }) =>
  `relative inline-flex items-center py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:bg-gold after:transition-transform ${
    isActive
      ? "text-burgundy after:scale-x-100"
      : "text-ink/80 hover:text-burgundy after:scale-x-0 hover:after:scale-x-100"
  }`;

function buildCategoryTree(categories) {
  const categoryMap = new Map();

  categories.forEach((category) => {
    categoryMap.set(String(category._id), {
      ...category,
      children: [],
    });
  });

  const roots = [];

  categoryMap.forEach((category) => {
    const parentId = category.parentId?._id || category.parentId;

    if (parentId && categoryMap.has(String(parentId))) {
      categoryMap.get(String(parentId)).children.push(category);
    } else if (!parentId) {
      roots.push(category);
    }
  });

  return roots;
}

function CategoryLinks({ categories, closeMenu, level = 0 }) {
  return (
    <ul
      className={
        level === 0
          ? "space-y-1"
          : "ml-3 mt-1 space-y-1 border-l border-burgundy/15 pl-3"
      }
    >
      {categories.map((category) => (
        <li key={category._id}>
          <NavLink
            to={`/shop?category=${encodeURIComponent(category.slug || category._id)}`}
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-burgundy/10 text-burgundy"
                  : "text-ink/80 hover:bg-burgundy/5 hover:text-burgundy"
              }`
            }
          >
            <span>{category.name}</span>

            {category.children.length > 0 && (
              <ChevronDown
                size={13}
                className="-rotate-90 text-ink/40"
              />
            )}
          </NavLink>

          {category.children.length > 0 && (
            <CategoryLinks
              categories={category.children}
              closeMenu={closeMenu}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function DesktopNav() {
  const [openKey, setOpenKey] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navRef = useRef(null);
  const headerSettings = useHeaderSettings();

  const navigationItems = PRIMARY_NAV.map((item) => ({
    ...item,
    label: headerSettings.navigation?.[item.key] || item.label,
  }));

  useDismiss(navRef, openKey !== null, () => setOpenKey(null));

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await api.get("/categories");
        const data = response.data?.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid category response");
        }

        const activeCategories = data.filter(
          (category) => category.isActive === true
        );

        const tree = buildCategoryTree(activeCategories);

        if (active) {
          setCategories(tree);
          setError(false);
        }
      } catch (error) {
        if (active) {
          setError(true);
        }

        console.error("Category loading failed:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const closeMenu = () => setOpenKey(null);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="justify-center hidden lg:flex"
    >
      <ul className="flex items-center gap-9">
        {navigationItems.map((item) => {
          const children = item.dynamic ? categories : item.children;
          const hasChildren = Boolean(children?.length);

          if (!hasChildren && !item.dynamic) {
            return (
              <li key={item.key}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={linkClass}
                >
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
              onMouseLeave={closeMenu}
            >
              <div className="flex items-center gap-0.5">
                <NavLink
                  to={item.to}
                  className={linkClass}
                  onClick={closeMenu}
                >
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
                    className={`transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {open && (
                <div
                  id={panelId}
                  className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-1"
                >
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-burgundy/15 bg-ivory-100/95 p-2 shadow-glass backdrop-blur-xl">
                    {loading ? (
                      <p className="px-3 py-3 text-sm text-ink/60">
                        Loading categories...
                      </p>
                    ) : error ? (
                      <p className="px-3 py-3 text-sm text-red-700">
                        Unable to load categories.
                      </p>
                    ) : children?.length ? (
                      <CategoryLinks
                        categories={children}
                        closeMenu={closeMenu}
                      />
                    ) : (
                      <p className="px-3 py-3 text-sm text-ink/60">
                        No categories available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
