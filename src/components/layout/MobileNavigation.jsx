
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Logo from "../common/Logo";
import CountrySelector from "../common/CountrySelector";
import SocialLinks from "../common/SocialLinks";
import {
  MOBILE_MENU_BUTTON_ID,
  PRIMARY_NAV,
} from "../../config/navigation";
import useHeaderSettings from "../../hooks/useHeaderSettings";
import useCart from "../../hooks/useCart";
import useScrollLock from "../../hooks/useScrollLock";
import { getCurrentCustomer } from "../../services/auth.service";
import api from "../../services/api";

const rowClass = ({ isActive }) =>
  `flex min-h-[52px] flex-1 items-center px-3 py-3 font-display text-base transition-colors sm:text-lg ${
    isActive
      ? "font-semibold text-[#493829]"
      : "text-[#493829] hover:text-[#B49A68]"
  }`;

const utilityClass =
  "flex min-h-[54px] items-center gap-4 px-3 py-3 font-display text-base text-[#493829] transition-colors hover:bg-[#D4BC98]/20 sm:text-lg";

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

function MobileCategoryLinks({ categories, onClose, level = 0 }) {
  return (
    <ul
      className={
        level === 0
          ? "mb-3 ml-4 border-l border-[#B49A68]/60 pl-3"
          : "ml-3 border-l border-[#B49A68]/40 pl-3"
      }
    >
      {categories.map((category) => (
        <li key={category._id}>
          <NavLink
            to={`/shop?category=${encodeURIComponent(category.slug || category._id)}`}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-10 items-center px-3 text-sm transition-colors ${
                isActive
                  ? "font-semibold text-[#493829]"
                  : "text-[#493829]/75 hover:text-[#B49A68]"
              }`
            }
          >
            {category.name}
          </NavLink>

          {category.children.length > 0 && (
            <MobileCategoryLinks
              categories={category.children}
              onClose={onClose}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function MobileNavigation({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const [customer, setCustomer] = useState(getCurrentCustomer);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  const closeRef = useRef(null);
  const wasOpen = useRef(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const headerSettings = useHeaderSettings();

  const navigationItems = PRIMARY_NAV.map((item) => ({
    ...item,
    label: headerSettings.navigation?.[item.key] || item.label,
  }));

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
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event) => {
      if (event.matches) onClose();
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [onClose]);

  useEffect(() => {
    const updateCustomer = () => {
      setCustomer(getCurrentCustomer());
    };

    window.addEventListener("adya-auth-change", updateCustomer);

    return () => {
      window.removeEventListener("adya-auth-change", updateCustomer);
    };
  }, []);

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
          setCategoriesError(false);
        }
      } catch (error) {
        console.error("Category loading failed:", error);

        if (active) {
          setCategoriesError(true);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-[#493829]/45 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-r border-[#B49A68]/30 bg-[#F8F3E8] shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#493829]/15 px-5">
          <Logo onClick={onClose} />

          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#493829] hover:bg-[#D4BC98]/35"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="px-5">
          <ul>
            {navigationItems.map((item) => {
              const children = item.dynamic
                ? categories
                : item.children || [];

              const hasChildren = Boolean(
                item.dynamic || children.length
              );

              const isExpanded = expanded === item.key;

              return (
                <li
                  key={item.key}
                  className="border-b border-[#493829]/15"
                >
                  {hasChildren ? (
                    <>
                      <div className="flex items-center">
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={rowClass}
                        >
                          {item.label}
                        </NavLink>

                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={`mobile-nav-${item.key}`}
                          aria-label={`${item.label} submenu`}
                          onClick={() =>
                            setExpanded(isExpanded ? null : item.key)
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#493829]"
                        >
                          <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <div id={`mobile-nav-${item.key}`}>
                          {item.dynamic && categoriesLoading ? (
                            <p className="mb-3 ml-4 px-3 text-sm text-[#493829]/60">
                              Loading categories...
                            </p>
                          ) : item.dynamic && categoriesError ? (
                            <p className="mb-3 ml-4 px-3 text-sm text-red-700">
                              Unable to load categories.
                            </p>
                          ) : item.dynamic && !children.length ? (
                            <p className="mb-3 ml-4 px-3 text-sm text-[#493829]/60">
                              No categories available.
                            </p>
                          ) : (
                            <MobileCategoryLinks
                              categories={children}
                              onClose={onClose}
                            />
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
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
            <Link
              to={customer ? "/account" : "/login"}
              onClick={onClose}
              className={utilityClass}
            >
              <User
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>
                {customer ? customer.name : headerSettings.accountLabel}
              </span>
            </Link>
          </li>

          <li className="border-b border-[#493829]/15">
            <Link
              to="/wishlist"
              onClick={onClose}
              className={utilityClass}
            >
              <Heart
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="flex-1">
                {headerSettings.wishlistLabel}
              </span>
            </Link>
          </li>

          <li className="border-b border-[#493829]/15">
            <Link
              to="/cart"
              onClick={onClose}
              className={utilityClass}
            >
              <ShoppingBag
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="flex-1">
                {headerSettings.cartLabel}
              </span>

              {itemCount > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#D4BC98] px-2 text-xs font-semibold text-[#493829]">
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
              href={`tel:${headerSettings.phone.replace(/\s/g, "")}`}
              className="block hover:text-[#B49A68]"
            >
              {headerSettings.phone}
            </a>

            <a
              href={`mailto:${headerSettings.email}`}
              className="block break-all hover:text-[#B49A68]"
            >
              {headerSettings.email}
            </a>
          </div>

          <SocialLinks
            className="flex -ml-2"
            itemClassName="text-[#493829] hover:bg-[#D4BC98]/40"
          />
        </div>
      </div>
    </div>
  );
}
