import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  ShoppingBag,
  Mail,
  Phone,
  Trash2,
  Star,
} from "lucide-react";
import { SITE } from "../config/site";
import api from "../services/api";
import { getCurrentCustomer, logoutCustomer } from "../services/auth.service";
import {
  getWishlist,
  removeWishlistItem,
} from "../services/wishlist.service";
import Price from "../components/common/Price";
import AddressManager from "../components/account/AddressManager";
import AccountOrders from "../components/account/AccountOrders";

const tabs = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "reviews", label: "My Reviews", icon: Star },
  { id: "details", label: "Account Details", icon: Settings },
];

function getId(value) {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
}

function getWishlistProduct(item) {
  const product =
    item.productId && typeof item.productId === "object"
      ? item.productId
      : null;

  const variant =
    item.variantId && typeof item.variantId === "object"
      ? item.variantId
      : null;

  const sizeId = getId(item.sizeOptionId);

  const size = variant?.sizes?.find(
    (option) => getId(option._id) === sizeId
  );

  return {
    product,
    variant,
    size,
    image:
      variant?.images?.[0] ||
      product?.imagePath ||
      product?.images?.[0] ||
      "",
  };
}

export default function Account() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customer, setCustomer] = useState(getCurrentCustomer);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [removingId, setRemovingId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  const navigate = useNavigate();

  const isLoggedIn = Boolean(customer);

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

    async function loadWishlist() {
      if (!isLoggedIn || activeTab !== "wishlist") return;

      setWishlistLoading(true);
      setWishlistError("");

      try {
        const items = await getWishlist();

        if (active) {
          setWishlistItems(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        if (active) {
          setWishlistError(
            error.response?.data?.message ||
              "Unable to load your wishlist. Please try again."
          );
        }
      } finally {
        if (active) setWishlistLoading(false);
      }
    }

    loadWishlist();

    return () => {
      active = false;
    };
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      if (!isLoggedIn || activeTab !== "reviews") return;

      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await api.get("/reviews/mine");
        const items = response.data?.data;

        if (active) {
          setReviews(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        if (active) {
          setReviewsError(
            error.response?.data?.message ||
              "Unable to load your reviews. Please try again."
          );
        }
      } finally {
        if (active) setReviewsLoading(false);
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, [activeTab, isLoggedIn]);

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    setWishlistItems([]);
    setReviews([]);
    setActiveTab("overview");
    navigate("/login");
  };

  const handleRemoveWishlistItem = async (itemId) => {
    if (!itemId || removingId) return;

    setRemovingId(itemId);
    setWishlistError("");

    try {
      await removeWishlistItem(itemId);

      setWishlistItems((current) =>
        current.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      setWishlistError(
        error.response?.data?.message ||
          "Unable to remove this item. Please try again."
      );
    } finally {
      setRemovingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <section className="border-b border-[#B49A68]/30 bg-[#D4BC98]/35">
        <div className="px-5 py-10 mx-auto max-w-7xl sm:px-8 sm:py-14 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#493829]/65 sm:text-xs">
            {SITE.name} / My Account
          </p>

          <div className="flex flex-col justify-between gap-5 mt-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-medium tracking-tight font-display sm:text-5xl lg:text-6xl">
                Your account
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#493829]/75 sm:text-base">
                Your orders, personal details and favourite drapes, all in one
                place.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex min-h-11 w-fit items-center gap-3 border border-[#493829]/35 px-5 py-3 text-sm font-medium transition-colors hover:bg-[#F8F3E8]"
            >
              Continue shopping
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 mx-auto max-w-7xl sm:px-8 sm:py-14 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[270px_1fr] lg:gap-12">
          <aside>
            <div className="border border-[#B49A68]/35 bg-white/40 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D4BC98] text-[#493829]">
                  <UserRound size={25} strokeWidth={1.4} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-display">
                    {customer?.name || "Welcome back"}
                  </h2>

                  <p className="mt-1 truncate text-xs text-[#493829]/60">
                    {customer?.email || "Guest account"}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#493829]/15 pt-5">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="flex min-h-11 w-full items-center justify-center bg-[#493829] px-4 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                    >
                      Login / Register
                    </Link>

                    <p className="mt-3 text-center text-xs leading-5 text-[#493829]/65">
                      Sign in to manage orders and personal details.
                    </p>
                  </>
                ) : (
                  <p className="text-center text-xs leading-5 text-[#493829]/65">
                    Welcome to your ADYA account.
                  </p>
                )}
              </div>
            </div>

            <nav
              aria-label="Account navigation"
              className="mt-5 border border-[#B49A68]/35 bg-white/30 p-2"
            >
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex min-h-12 w-full items-center gap-3 px-3 py-3 text-left text-sm transition-colors ${
                    activeTab === id
                      ? "bg-[#D4BC98]/50 font-semibold text-[#493829]"
                      : "text-[#493829]/75 hover:bg-[#D4BC98]/20 hover:text-[#493829]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              ))}

              <div className="my-2 border-t border-[#493829]/15" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 w-full items-center gap-3 px-3 py-3 text-left text-sm text-[#493829]/75 transition-colors hover:bg-[#D4BC98]/20 hover:text-[#493829]"
              >
                <LogOut size={18} strokeWidth={1.6} aria-hidden="true" />
                <span>{isLoggedIn ? "Logout" : "Login"}</span>
              </button>
            </nav>
          </aside>

          <div className="min-w-0">
            {activeTab === "overview" && (
              <div>
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                    Account overview
                  </p>

                  <h2 className="mt-2 text-3xl font-display sm:text-4xl">
                    A little space for you
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#493829]/70">
                    {isLoggedIn
                      ? `Welcome back, ${customer.name}. Manage your ADYA shopping experience here.`
                      : "Sign in to access your personal shopping experience."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Package size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    <h3 className="text-2xl mt-7 font-display">
                      Your orders
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      View purchases and track deliveries after signing in.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("addresses")}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <MapPin size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    <h3 className="text-2xl mt-7 font-display">
                      Addresses
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Manage your delivery addresses after signing in.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("wishlist")}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Heart size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    <h3 className="text-2xl mt-7 font-display">
                      Wishlist
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Keep your favourite sarees close at hand.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Settings size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    <h3 className="text-2xl mt-7 font-display">
                      Your details
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Update your profile and contact information.
                    </p>
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-4 border border-[#B49A68]/35 bg-[#D4BC98]/25 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h3 className="text-2xl font-display">
                      Find your next favourite
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#493829]/70">
                      Explore the latest drapes and timeless collections.
                    </p>
                  </div>

                  <Link
                    to="/shop"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#493829] px-5 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                  >
                    <ShoppingBag size={16} />
                    Shop sarees
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "orders" &&
              (isLoggedIn ? (
                <AccountOrders />
              ) : (
                <AccountPanel
                  eyebrow="Your purchases"
                  title="My orders"
                  description="Sign in to view your order history and delivery updates."
                  isLoggedIn={false}
                />
              ))}

            {activeTab === "addresses" &&
              (isLoggedIn ? (
                <AddressManager />
              ) : (
                <AccountPanel
                  eyebrow="Delivery details"
                  title="Saved addresses"
                  description="Sign in to view and manage your saved shipping addresses."
                  isLoggedIn={false}
                />
              ))}

            {activeTab === "wishlist" && (
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                  Your favourites
                </p>

                <h2 className="mt-2 text-3xl font-display sm:text-4xl">
                  Wishlist
                </h2>

                {!isLoggedIn ? (
                  <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
                    <Heart size={28} strokeWidth={1.4} />

                    <h3 className="mt-5 text-2xl font-display">
                      Sign in to view your wishlist
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
                      Log in to see the sarees you have saved.
                    </p>

                    <Link
                      to="/login"
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                    >
                      Login / Register
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ) : wishlistLoading ? (
                  <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-16 text-center text-sm text-[#493829]/65">
                    Loading your wishlist...
                  </div>
                ) : wishlistError ? (
                  <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center">
                    <p className="text-sm text-[#8C3A36]">{wishlistError}</p>

                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="mt-4 text-sm underline underline-offset-4"
                    >
                      Return to account overview
                    </button>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
                      <Heart size={27} strokeWidth={1.4} />
                    </div>

                    <h3 className="mt-5 text-2xl font-display">
                      Your wishlist is empty
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
                      Save the sarees you love and they will appear here.
                    </p>

                    <Link
                      to="/shop"
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                    >
                      <ShoppingBag size={16} />
                      Explore sarees
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 xl:grid-cols-3">
                    {wishlistItems.map((item) => {
                      const { product, variant, size, image } =
                        getWishlistProduct(item);

                      const productId = getId(item.productId);
                      const productName = product?.name || "ADYA saree";

                      const productPath = product
                        ? `/product/${product.slug || product._id}`
                        : "/shop";

                      return (
                        <article
                          key={item._id}
                          className="overflow-hidden border border-[#B49A68]/35 bg-white/40"
                        >
                          <div className="relative bg-[#F0E8DC]">
                            <Link
                              to={productPath}
                              aria-label={`View ${productName}`}
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={productName}
                                  loading="lazy"
                                  className="aspect-[3/4] w-full object-cover"
                                />
                              ) : (
                                <div className="flex aspect-[3/4] items-center justify-center text-sm text-[#82776E]">
                                  Image unavailable
                                </div>
                              )}
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveWishlistItem(item._id)
                              }
                              disabled={removingId === item._id}
                              aria-label={`Remove ${productName} from wishlist`}
                              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#792431] transition hover:bg-[#F3E4E2] disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="p-4">
                            <Link
                              to={productPath}
                              className="block font-display text-lg text-[#493829] transition-colors hover:text-[#792431]"
                            >
                              {productName}
                            </Link>

                            <p className="mt-2 text-xs text-[#493829]/65">
                              {variant?.color
                                ? `Colour: ${variant.color}`
                                : ""}
                              {variant?.color && size?.size ? " · " : ""}
                              {size?.size ? `Size: ${size.size}` : ""}
                            </p>

                            {product?.price && (
                              <div className="mt-3">
                                <Price
                                  price={product.price}
                                  salePrice={product.salePrice}
                                />
                              </div>
                            )}

                            <Link
                              to={productPath}
                              className="mt-4 inline-flex min-h-10 items-center gap-2 border border-[#493829]/30 px-4 py-2 text-xs font-medium text-[#493829] transition-colors hover:bg-[#D4BC98]/25"
                            >
                              View product
                              <ArrowUpRight size={15} />
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === "reviews" && (
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                  Your feedback
                </p>

                <h2 className="mt-2 text-3xl font-display sm:text-4xl">
                  My Reviews
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#493829]/70">
                  Keep track of the reviews you have shared with ADYA.
                </p>

                {!isLoggedIn ? (
                  <AccountPanel
                    eyebrow="Your feedback"
                    title="My reviews"
                    description="Sign in to view the reviews you have submitted."
                    isLoggedIn={false}
                  />
                ) : reviewsLoading ? (
                  <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-16 text-center text-sm text-[#493829]/65">
                    Loading your reviews...
                  </div>
                ) : reviewsError ? (
                  <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center">
                    <p className="text-sm text-[#8C3A36]">{reviewsError}</p>

                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="mt-4 text-sm underline underline-offset-4"
                    >
                      Return to account overview
                    </button>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
                      <Star size={27} strokeWidth={1.4} />
                    </div>

                    <h3 className="mt-5 text-2xl font-display">
                      You have not reviewed anything yet
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
                      Once you submit a review for an eligible delivered order, it will appear here.
                    </p>

                    <Link
                      to="/shop"
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                    >
                      <ShoppingBag size={16} />
                      Explore sarees
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {reviews.map((review) => {
                      console.log("Review product data:", review.productId);
                      const product =
                        review.productId &&
                        typeof review.productId === "object"
                          ? review.productId
                          : null;

                      const productName = product?.name || "ADYA saree";

                      const productPath = product
                        ? `/product/${product.slug || product._id}`
                        : "/shop";

                      const productImage =
                        product?.thumbnail ||
                        product?.imagePath ||
                        product?.images?.[0] ||
                        "";

                      return (
                        <article
                          key={review._id}
                          className="border border-[#B49A68]/35 bg-white/40 p-4 sm:p-6"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                              to={productPath}
                              className="h-28 w-24 shrink-0 overflow-hidden bg-[#F0E8DC]"
                              aria-label={`View ${productName}`}
                            >
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={productName}
                                  loading="lazy"
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-[#82776E]">
                                  Image unavailable
                                </div>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link
                                to={productPath}
                                className="font-display text-xl text-[#493829] transition-colors hover:text-[#792431]"
                              >
                                {productName}
                              </Link>

                              <div
                                className="flex items-center gap-1 mt-2"
                                aria-label={`${review.rating} out of 5 stars`}
                              >
                                {Array.from({ length: 5 }, (_, index) => (
                                  <Star
                                    key={index}
                                    size={15}
                                    className={
                                      index < Number(review.rating)
                                        ? "fill-[#B8923A] text-[#B8923A]"
                                        : "text-[#B49A68]/40"
                                    }
                                  />
                                ))}
                              </div>

                              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#493829]/80">
                                {review.text}
                              </p>

                              <p className="mt-3 text-xs text-[#493829]/55">
                                Submitted{" "}
                                {review.createdAt
                                  ? new Date(
                                      review.createdAt
                                    ).toLocaleDateString(undefined, {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "recently"}
                              </p>
                            </div>
                          </div>

                          {Array.isArray(review.images) &&
                            review.images.length > 0 && (
                              <div className="mt-5 border-t border-[#493829]/10 pt-4">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B7047]">
                                  Your photos
                                </p>

                                <div className="flex flex-wrap gap-3">
                                  {review.images.map((image, index) =>
                                    image?.url ? (
                                      <a
                                        key={
                                          image._id ||
                                          image.publicId ||
                                          image.url ||
                                          index
                                        }
                                        href={image.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block h-20 w-20 overflow-hidden border border-[#B49A68]/30 bg-[#F0E8DC]"
                                        aria-label={`Open review photo ${index + 1}`}
                                      >
                                        <img
                                          src={image.url}
                                          alt={`Review photo ${index + 1}`}
                                          loading="lazy"
                                          className="object-cover w-full h-full"
                                        />
                                      </a>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === "details" && (
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                  Personal information
                </p>

                <h2 className="mt-2 text-3xl font-display sm:text-4xl">
                  Account details
                </h2>

                <div className="mt-6 border border-[#B49A68]/35 bg-white/40 p-5 sm:p-7">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4BC98]/45">
                      <UserRound size={25} strokeWidth={1.4} />
                    </div>

                    <div>
                      <h3 className="text-xl font-display">
                        {customer?.name || "Guest"}
                      </h3>

                      <p className="mt-1 text-xs text-[#493829]/60">
                        Your ADYA account information
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-[#493829]/10 pt-6">
                    <div className="flex items-start gap-3">
                      <UserRound
                        size={17}
                        className="mt-1 shrink-0 text-[#8B7047]"
                      />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B7047]">
                          Full name
                        </p>

                        <p className="mt-1 text-sm">
                          {customer?.name || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail
                        size={17}
                        className="mt-1 shrink-0 text-[#8B7047]"
                      />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B7047]">
                          Email address
                        </p>

                        <p className="mt-1 text-sm">
                          {customer?.email || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        size={17}
                        className="mt-1 shrink-0 text-[#8B7047]"
                      />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B7047]">
                          Phone number
                        </p>

                        <p className="mt-1 text-sm">
                          {customer?.phone || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isLoggedIn && (
                    <Link
                      to="/login"
                      className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-5 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                    >
                      Login to manage details
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function AccountPanel({
  eyebrow,
  title,
  description,
  actionLabel = "Login / Register",
  actionTo = "/login",
  isLoggedIn,
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-display sm:text-4xl">{title}</h2>

      <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
          <UserRound size={27} strokeWidth={1.4} />
        </div>

        <h3 className="mt-5 text-2xl font-display">Welcome to ADYA</h3>

        <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
          {description}
        </p>

        {(!isLoggedIn || actionTo === "/shop") && (
          <Link
            to={actionTo}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
          >
            {isLoggedIn && actionTo === "/shop"
              ? "Explore sarees"
              : actionLabel}
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}