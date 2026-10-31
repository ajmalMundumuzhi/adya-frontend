import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Maximize2,
  Minus,
  Plus,
  Shuffle,
  Share2,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Package,
} from "lucide-react";
import Price from "../components/common/Price";
import useCart from "../hooks/useCart";
import { getProductById, getProducts } from "../services/store.service";
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../services/wishlist.service";
const benefits = [
  { icon: Truck, title: "Free Shipping", description: "On orders above ₹999" },
  { icon: RotateCcw, title: "Easy Returns", description: "7 days hassle free" },
  { icon: ShieldCheck, title: "Secure Payment", description: "100% secure checkout" },
  { icon: Leaf, title: "Premium Quality", description: "Assured craftsmanship" },
];
function formatProduct(product) {
  return {
    ...product,
    id: product._id,
    priceInr: product.price,
    compareAtInr: product.compareAtPrice,
    image: product.imagePath || product.images?.[0] || "",
    to: `/product/${product.slug || product._id}`,
  };
}
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [variantIndex, setVariantIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistActionLoading, setWishlistActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let active = true;
    async function loadProduct() {
      setLoading(true);
      setLoadError("");
      setProduct(null);
      setVariantIndex(0);
      setSizeIndex(0);
      setImageIndex(0);
      setQuantity(1);
      setAdded(false);
      try {
        const result = await getProductById(id);
        if (!active) return;
        if (!result) {
          setLoadError("Product not found.");
          return;
        }
        setProduct(formatProduct(result));
        const allProducts = await getProducts({ limit: 8 });
        if (active) {
          setRelatedProducts(
            (allProducts || [])
              .filter((item) => item._id !== result._id)
              .slice(0, 4)
              .map(formatProduct)
          );
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load this product. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    let active = true;
    async function loadWishlist() {
      try {
        const items = await getWishlist();
        if (active) {
          setWishlistItems(Array.isArray(items) ? items : []);
        }
      } catch {
        if (active) setWishlistItems([]);
      }
    }
    loadWishlist();
    return () => {
      active = false;
    };
  }, []);
  const variants = useMemo(
    () => (product?.variants || []).filter((variant) => variant.isActive !== false),
    [product]
  );
  const selectedVariant = variants[variantIndex] || null;
  const sizes = useMemo(
    () =>
      (selectedVariant?.sizes || []).filter(
        (size) => size.isActive !== false
      ),
    [selectedVariant]
  );
  const selectedSize = sizes[sizeIndex] || null;
  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : [];
  const mainImage = images[imageIndex] || images[0] || "";
  const price = Number(selectedSize?.price ?? product?.price ?? 0);
  const compareAtPrice = Number(
    selectedSize?.compareAtPrice ?? product?.compareAtPrice ?? 0
  );
  const stock = Number(selectedSize?.stock ?? 0);
  const isInStock = Boolean(selectedSize && selectedSize.isActive !== false && stock > 0);
  const discount =
    compareAtPrice > price && compareAtPrice > 0
      ? Math.round((1 - price / compareAtPrice) * 100)
      : 0;
  const getReferenceId = (value) => {
    if (!value) return "";
    return typeof value === "object" ? value._id : value;
  };
  const wishlistIds = [
    ...new Set(wishlistItems.map((item) => getReferenceId(item.productId))),
  ];
  const isWishlistItem = (productId, variantId, sizeOptionId) =>
    wishlistItems.some(
      (item) =>
        getReferenceId(item.productId) === productId &&
        getReferenceId(item.variantId) === variantId &&
        getReferenceId(item.sizeOptionId) === sizeOptionId
    );
  const wishlist = Boolean(
    product &&
      selectedVariant &&
      selectedSize &&
      isWishlistItem(product.id, selectedVariant._id, selectedSize._id)
  );
  const refreshWishlist = async () => {
    const items = await getWishlist();
    setWishlistItems(Array.isArray(items) ? items : []);
  };
  const handleToggleWishlist = async () => {
    if (!product || !selectedVariant || !selectedSize || wishlistActionLoading) {
      return;
    }
    setWishlistActionLoading(true);
    try {
      const existingItem = wishlistItems.find(
        (item) =>
          getReferenceId(item.productId) === product.id &&
          getReferenceId(item.variantId) === selectedVariant._id &&
          getReferenceId(item.sizeOptionId) === selectedSize._id
      );
      if (existingItem) {
        await removeWishlistItem(existingItem._id);
        setWishlistItems((current) =>
          current.filter((item) => item._id !== existingItem._id)
        );
      } else {
        await addWishlistItem({
          productId: product.id,
          variantId: selectedVariant._id,
          sizeOptionId: selectedSize._id,
        });
        await refreshWishlist();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        window.alert("Please log in to use your wishlist.");
      } else {
        window.alert(
          error.response?.data?.message || "Unable to update your wishlist."
        );
      }
    } finally {
      setWishlistActionLoading(false);
    }
  };
  const handleRelatedWishlist = async (item) => {
    if (wishlistActionLoading) return;
    const availableVariant = (item.variants || []).find(
      (variant) => variant.isActive !== false
    );
    const availableSize = availableVariant?.sizes?.find(
      (size) => size.isActive !== false && Number(size.stock) > 0
    );
    if (!availableVariant || !availableSize) {
      window.alert("This product currently has no available size.");
      return;
    }
    setWishlistActionLoading(true);
    try {
      const existingItem = wishlistItems.find(
        (savedItem) =>
          getReferenceId(savedItem.productId) === item.id &&
          getReferenceId(savedItem.variantId) === availableVariant._id &&
          getReferenceId(savedItem.sizeOptionId) === availableSize._id
      );
      if (existingItem) {
        await removeWishlistItem(existingItem._id);
        setWishlistItems((current) =>
          current.filter((savedItem) => savedItem._id !== existingItem._id)
        );
      } else {
        await addWishlistItem({
          productId: item.id,
          variantId: availableVariant._id,
          sizeOptionId: availableSize._id,
        });
        await refreshWishlist();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        window.alert("Please log in to use your wishlist.");
      } else {
        window.alert(
          error.response?.data?.message || "Unable to update your wishlist."
        );
      }
    } finally {
      setWishlistActionLoading(false);
    }
  };
  const selectVariant = (index) => {
    setVariantIndex(index);
    setSizeIndex(0);
    setImageIndex(0);
    setQuantity(1);
    setAdded(false);
  };
  const changeImage = (direction) => {
    if (!images.length) return;
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };
  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedSize || !isInStock) return;
    if (quantity > stock) return;
    addToCart(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        variantId: selectedVariant._id,
        sizeOptionId: selectedSize._id,
        selectedColor: selectedVariant.color,
        selectedSize: selectedSize.size,
        sku: selectedSize.sku || "",
        price,
        compareAtPrice: compareAtPrice || null,
        stock,
        image: mainImage,
        description: product.description || "",
      },
      quantity
    );
    setAdded(true);
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#FAF8F3] px-5 py-24 text-center text-[#82776E]">
        Loading product...
      </main>
    );
  }
  if (!product || loadError || !variants.length) {
    return (
      <main className="min-h-[60vh] bg-[#FAF8F3] px-5 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#34251F]">
          {loadError || "Product not found"}
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-[#792431] px-7 py-3 text-sm text-white"
        >
          Continue shopping
        </Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#34251F]">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-7 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-5 text-[11px] tracking-wide text-[#8B8178] sm:text-xs"
        >
          <Link to="/" className="text-[#B18A36] hover:text-[#792431]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#792431]">Saree</Link>
          <span>/</span>
          <span>{product.category || "Traditional"}</span>
          <span>/</span>
          <span className="max-w-[220px] truncate text-[#5B4B41]">{product.name}</span>
        </nav>
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,1fr)] xl:gap-10">
          <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <button
                  key={`${selectedVariant._id}-${image}-${index}`}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => setImageIndex(index)}
                  className={`overflow-hidden rounded-md border transition ${
                    imageIndex === index
                      ? "border-[#A77B27] ring-1 ring-[#A77B27]/30"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name}, view ${index + 1}`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </button>
              ))}
              {images.length > 1 && (
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    aria-label="Previous image"
                    className="flex h-8 flex-1 items-center justify-center rounded bg-[#F0ECE5] hover:bg-[#E8E0D4]"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    aria-label="Next image"
                    className="flex h-8 flex-1 items-center justify-center rounded bg-[#F0ECE5] hover:bg-[#E8E0D4]"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>
            <div className="relative min-w-0 self-start overflow-hidden rounded-md bg-[#EFE7DB]">
              {mainImage ? (
                <img
                  key={`${selectedVariant._id}-${mainImage}`}
                  src={mainImage}
                  alt={`${product.name} in ${selectedVariant.color}`}
                  className="aspect-[3/4] w-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center text-sm text-[#82776E]">
                  No product image available
                </div>
              )}
              {mainImage && (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  aria-label="Enlarge product image"
                  className="absolute flex items-center justify-center w-10 h-10 transition rounded-full shadow-sm bottom-4 right-4 bg-white/95 hover:bg-white"
                >
                  <Maximize2 size={17} />
                </button>
              )}
              {discount > 0 && (
                <span className="absolute left-3 top-3 bg-[#D7AE3F] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-white">
                  SALE
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_130px] lg:gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#D8B45A] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white">
                    {discount > 0 ? "SALE" : "NEW COLLECTION"}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#9B8D7E]">
                    ADYA EXCLUSIVE
                  </span>
                </div>
                <h1 className="font-serif text-[30px] leading-[1.17] tracking-[-0.025em] text-[#38261F] sm:text-[36px] lg:text-[38px]">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  {compareAtPrice > price && (
                    <div className="text-lg text-[#B6AEA5] line-through">
                      <Price amountInr={compareAtPrice} />
                    </div>
                  )}
                  <div className="text-xl font-semibold text-[#B68B2E]">
                    <Price amountInr={price} />
                  </div>
                  {discount > 0 && (
                    <span className="rounded-md bg-[#F3E0D7] px-3 py-1.5 text-[11px] font-semibold text-[#8C3A36]">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="mt-4 max-w-2xl text-[13px] leading-6 text-[#82776E]">
                  {product.description ||
                    `Discover the elegance of ${product.name}, thoughtfully selected for weddings, festive occasions and timeless celebrations.`}
                </p>
              </div>
              <aside className="grid grid-cols-2 gap-4 border-t border-[#E9E0D5] pt-5 sm:grid-cols-4 lg:grid-cols-1 lg:gap-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-2.5 lg:block">
                    <Icon size={23} strokeWidth={1.3} className="shrink-0 text-[#C19331] lg:mb-2.5" />
                    <div>
                      <h3 className="font-serif text-[13px] text-[#38261F]">{title}</h3>
                      <p className="mt-1 text-[10px] leading-4 text-[#93877D]">{description}</p>
                    </div>
                  </div>
                ))}
              </aside>
            </div>
            <div className="mt-6 border-t border-[#E7DED2] pt-5">
              <div className="mb-3 flex items-center gap-3 text-[13px]">
                <span className="font-medium">Color:</span>
                <span className="text-[#75665A]">{selectedVariant.color}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant, index) => (
                  <button
                    key={variant._id}
                    type="button"
                    onClick={() => selectVariant(index)}
                    aria-label={`Select ${variant.color} color`}
                    aria-pressed={variantIndex === index}
                    title={variant.color}
                    className={`h-[54px] w-[54px] rounded-md border-2 p-1 transition ${
                      variantIndex === index
                        ? "border-[#B78A30]"
                        : "border-transparent hover:border-[#D8C6A3]"
                    }`}
                  >
                    {variant.images?.[0] ? (
                      <img
                        src={variant.images[0]}
                        alt=""
                        className="object-cover w-full h-full rounded-sm"
                      />
                    ) : (
                      <span className="block h-full w-full rounded-sm bg-[#DDD0C1]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-[#E7DED2] pt-5">
              <div className="mb-3 flex items-center gap-3 text-[13px]">
                <span className="font-medium">Size:</span>
                <span className="text-[#75665A]">{selectedSize?.size || "Choose a size"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => {
                  const unavailable = Number(size.stock || 0) <= 0;
                  return (
                    <button
                      key={size._id}
                      type="button"
                      disabled={unavailable}
                      onClick={() => {
                        setSizeIndex(index);
                        setQuantity(1);
                        setAdded(false);
                      }}
                      aria-pressed={sizeIndex === index}
                      className={`min-h-10 border px-4 py-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        sizeIndex === index
                          ? "border-[#792431] bg-[#792431] text-white"
                          : "border-[#D9CFC2] text-[#67594E] hover:border-[#A77B27]"
                      }`}
                    >
                      {size.size}
                      {unavailable ? " · Out of stock" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 text-[12px] leading-6">
              <p>
                <span className="inline-block w-[90px] font-medium">SKU:</span>
                <span className="text-[#82766C]">{selectedSize?.sku || "Not assigned"}</span>
              </p>
              <p>
                <span className="inline-block w-[90px] font-medium">Availability:</span>
                <span className={isInStock ? "text-[#39764A]" : "text-[#A13A35]"}>
                  {isInStock ? `${stock} available` : "Out of stock"}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-stretch gap-3 mt-6">
              <div className="flex h-11 shrink-0 items-center border border-[#D9CFC2] bg-white/50">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex items-center justify-center w-10 h-full disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm text-center min-w-8 tabular-nums">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!isInStock || quantity >= Math.min(9, stock)}
                  onClick={() => setQuantity((value) => Math.min(Math.min(9, stock), value + 1))}
                  className="flex items-center justify-center w-10 h-full disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex h-11 min-w-[160px] flex-1 items-center justify-center gap-3 bg-[#792431] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5E1B26] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
              >
                {added ? <Check size={17} /> : <ShoppingBag size={17} />}
                {added ? "Added to cart" : isInStock ? "Add to cart" : "Out of stock"}
              </button>
              <button
                type="button"
                aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlist}
                onClick={handleToggleWishlist}
                className={`flex h-11 w-12 items-center justify-center border transition ${
                  wishlist
                    ? "border-[#792431] bg-[#F4E7E5] text-[#792431]"
                    : "border-[#D9CFC2] text-[#792431] hover:bg-[#F4E7E5]"
                }`}
              >
                <Heart size={19} fill={wishlist ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>
            {added && (
              <p role="status" className="mt-3 text-xs text-[#39764A]">
                Added to your shopping cart.
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-[#67594E]">
              <button type="button" className="inline-flex items-center gap-2 transition hover:text-[#792431]">
                <Shuffle size={15} />
                Add to compare
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 transition hover:text-[#792431]"
              >
                <Share2 size={15} />
                {copied ? "Link copied" : "Share"}
              </button>
            </div>
          </div>
        </section>
        <section className="mt-12 border-b border-[#E7DED2] sm:mt-16">
          <div className="flex flex-wrap gap-x-7 gap-y-0 sm:gap-x-9">
            {[
              { id: "description", label: "Description" },
              { id: "information", label: "Additional information" },
              { id: "shipping", label: "Shipping & returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] transition sm:text-[11px] ${
                  activeTab === tab.id
                    ? "border-[#792431] text-[#792431]"
                    : "border-transparent text-[#8B8178] hover:text-[#792431]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
        <section className="grid gap-7 py-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
          <div className="text-[13px] leading-6 text-[#82776E]">
            {activeTab === "description" && (
              <p>
                {product.description ||
                  `This exquisite ${product.name} brings together traditional craftsmanship and timeless elegance. Its carefully selected design makes it a beautiful choice for weddings, festive celebrations and special occasions.`}
              </p>
            )}
            {activeTab === "information" && (
              <div className="space-y-2">
                <p><span className="font-medium text-[#514137]">Product:</span> {product.name}</p>
                <p><span className="font-medium text-[#514137]">Color:</span> {selectedVariant.color}</p>
                <p><span className="font-medium text-[#514137]">Size:</span> {selectedSize?.size || "Not selected"}</p>
                <p><span className="font-medium text-[#514137]">SKU:</span> {selectedSize?.sku || "Not assigned"}</p>
              </div>
            )}
            {activeTab === "shipping" && (
              <p>
                Shipping options and delivery estimates are confirmed at checkout.
                Please check the product and delivery details before completing
                your order. Return eligibility is subject to the store's published
                return policy.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-5 rounded-md bg-[#F3EEE5] p-5 sm:grid-cols-4 lg:gap-3 lg:p-5">
            {[
              { icon: Package, title: "Fabric", detail: product.details?.fabric || "Premium textile" },
              { icon: Leaf, title: "Craftsmanship", detail: "Detailed finish" },
              { icon: Heart, title: "Occasion", detail: product.details?.occasion || "Wedding, festive" },
              { icon: ShieldCheck, title: "Care", detail: "Follow care label" },
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="text-center">
                <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A99A] text-[#925C50]">
                  <Icon size={15} strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-[12px] text-[#4A382E]">{title}</h3>
                <p className="mt-1 text-[10px] text-[#8B8178]">{detail}</p>
              </div>
            ))}
          </div>
        </section>
        {relatedProducts.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-5 mb-6">
              <h2 className="font-serif text-2xl tracking-tight shrink-0 sm:text-3xl">
                Related products
              </h2>
              <div className="h-px flex-1 bg-[#E7DED2]" />
              <div className="hidden gap-2 sm:flex">
                <Link
                  to="/shop"
                  aria-label="Browse shop"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D7C9] transition hover:border-[#A77B27] hover:text-[#792431]"
                >
                  <ChevronLeft size={17} />
                </Link>
                <Link
                  to="/shop"
                  aria-label="View all products"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D7C9] transition hover:border-[#A77B27] hover:text-[#792431]"
                >
                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <article key={item.id} className="min-w-0 group">
                  <div className="relative overflow-hidden rounded-md bg-[#F0E8DC]">
                    <Link to={item.to} aria-label={`View ${item.name}`}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="aspect-[3/4] w-full" />
                      )}
                    </Link>
                    {item.compareAtInr > item.priceInr && (
                      <span className="absolute left-2 top-2 bg-[#D7AE3F] px-2 py-1 text-[9px] font-semibold text-white sm:left-3 sm:top-3">
                        SALE
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={
                        wishlistIds.includes(item.id)
                          ? `Remove ${item.name} from wishlist`
                          : `Add ${item.name} to wishlist`
                      }
                      aria-pressed={wishlistIds.includes(item.id)}
                      onClick={() => handleRelatedWishlist(item)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#792431] transition hover:bg-[#F3E4E2] sm:right-3 sm:top-3"
                    >
                      <Heart
                        size={15}
                        strokeWidth={1.5}
                        fill={wishlistIds.includes(item.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <Link
                    to={item.to}
                    className="mt-3 block line-clamp-2 text-center font-serif text-[12px] leading-5 text-[#4A382E] transition hover:text-[#792431] sm:text-[13px]"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                    {item.compareAtInr > item.priceInr && (
                      <span className="text-[#B6AEA5] line-through">
                        <Price amountInr={item.compareAtInr} />
                      </span>
                    )}
                    <span className="font-semibold text-[#B68B2E]">
                      <Price amountInr={item.priceInr} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
      {zoomOpen && mainImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211713]/95 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Close image viewer"
            onClick={() => setZoomOpen(false)}
            className="absolute flex items-center justify-center text-white transition rounded-full right-5 top-5 h-11 w-11 hover:bg-white/10"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              changeImage(-1);
            }}
            className="absolute flex items-center justify-center text-white rounded-full left-3 h-11 w-11 bg-white/10 hover:bg-white/20 sm:left-8"
          >
            <ArrowLeft size={21} />
          </button>
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-[88vh] max-w-[85vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              changeImage(1);
            }}
            className="absolute flex items-center justify-center text-white rounded-full right-3 h-11 w-11 bg-white/10 hover:bg-white/20 sm:right-8"
          >
            <ArrowRight size={21} />
          </button>
        </div>
      )}
    </main>
  );
}