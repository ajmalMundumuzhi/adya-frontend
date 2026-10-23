
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Heart, Maximize2, Minus, Plus, Shuffle, Share2, ShoppingBag, Truck, RotateCcw, ShieldCheck, Leaf, ChevronLeft, ChevronRight, X, Check, Package,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/sampleProduct.js';
import Price from '../components/common/Price';
import useCart from '../hooks/useCart';

const benefits = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7 days hassle free' },
  { icon: ShieldCheck, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: Leaf, title: 'Premium Quality', description: 'Assured craftsmanship' },
];

const productImages = [
  {
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    alt: 'Saree front view',
  },
  {
    src: 'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=1000&q=85',
    alt: 'Saree alternate view',
  },
  {
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
    alt: 'Saree fabric detail',
  },
];

const fallbackVariants = [
  { name: 'Teal', color: '#527D80', images: productImages.map((image) => image.src) },
  { name: 'Ivory', color: '#E8DDC9', images: [productImages[1].src, productImages[2].src, productImages[0].src] },
  { name: 'Rose', color: '#A74C65', images: [productImages[2].src, productImages[0].src, productImages[1].src] },
  { name: 'Burgundy', color: '#762B39', images: [productImages[0].src, productImages[2].src, productImages[1].src] },
];

export default function ProductDetails() {
  const { id } = useParams();
  const product = SAMPLE_PRODUCTS.find((item) => item.id === id);
  const { addToCart } = useCart();

  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <main className="min-h-[60vh] bg-[#FAF8F3] px-5 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#34251F]">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block bg-[#792431] px-7 py-3 text-sm text-white">
          Continue shopping
        </Link>
      </main>
    );
  }

  const variants = product.variants?.length ? product.variants : fallbackVariants;
  const selectedVariant = variants[variantIndex % variants.length];
  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : productImages.map((image) => image.src);

  const mainImage = images[imageIndex % images.length];

  const relatedProducts = SAMPLE_PRODUCTS.filter((item) => item.id !== product.id);

  const selectVariant = (index) => {
    setVariantIndex(index);
    setImageIndex(0);
    setAdded(false);
  };

  const changeImage = (direction) => {
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (typeof addToCart !== 'function') return;

    addToCart(
      {
        ...product,
        id: product.id,
        selectedColor: selectedVariant?.name,
        image: mainImage,
      },
      quantity,
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

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#34251F]">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-7 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-5 text-[11px] tracking-wide text-[#8B8178] sm:text-xs">
          <Link to="/" className="text-[#B18A36] hover:text-[#792431]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#792431]">Saree</Link>
          <span>/</span>
          <span>{product.category || 'Traditional'}</span>
          <span>/</span>
          <span className="max-w-[220px] truncate text-[#5B4B41]">{product.name}</span>
        </nav>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,1fr)] xl:gap-10">
          <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <button
                  key={`${selectedVariant?.name}-${image}-${index}`}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => setImageIndex(index)}
                  className={`overflow-hidden rounded-md border transition ${
                    imageIndex === index
                      ? 'border-[#A77B27] ring-1 ring-[#A77B27]/30'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name}, view ${index + 1}`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </button>
              ))}

              <div className="mt-1 flex gap-1">
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
            </div>

            <div className="relative min-w-0 self-start overflow-hidden rounded-md bg-[#EFE7DB]">
              <img
                key={`${selectedVariant?.name}-${mainImage}`}
                src={mainImage}
                alt={`${product.name} in ${selectedVariant?.name || ''}`}
                className="aspect-[3/4] w-full object-cover transition-opacity duration-300"
              />

              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Enlarge product image"
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:bg-white"
              >
                <Maximize2 size={17} />
              </button>

              {product.compareAtInr && product.compareAtInr > product.priceInr && (
                <span className="absolute left-3 top-3 bg-[#D7AE3F] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-white">
                  SALE
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_130px] lg:gap-6">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-[#D8B45A] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white">
                    {product.compareAtInr ? 'SALE' : 'NEW COLLECTION'}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#9B8D7E]">
                    ADYA EXCLUSIVE
                  </span>
                </div>

                <h1 className="font-serif text-[30px] leading-[1.17] tracking-[-0.025em] text-[#38261F] sm:text-[36px] lg:text-[38px]">
                  {product.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="text-lg text-[#B6AEA5] line-through">
                    {product.compareAtInr ? (
                      <Price amountInr={product.compareAtInr} />
                    ) : null}
                  </div>
                  <div className="text-xl font-semibold text-[#B68B2E]">
                    <Price amountInr={product.priceInr} />
                  </div>
                  {product.compareAtInr > product.priceInr && (
                    <span className="rounded-md bg-[#F3E0D7] px-3 py-1.5 text-[11px] font-semibold text-[#8C3A36]">
                      {Math.round((1 - product.priceInr / product.compareAtInr) * 100)}% OFF
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
                <span className="text-[#75665A]">{selectedVariant?.name}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.map((variant, index) => (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => selectVariant(index)}
                    aria-label={`Select ${variant.name} color`}
                    aria-pressed={variantIndex === index}
                    title={variant.name}
                    className={`h-[54px] w-[54px] rounded-md border-2 p-1 transition ${
                      variantIndex === index
                        ? 'border-[#B78A30]'
                        : 'border-transparent hover:border-[#D8C6A3]'
                    }`}
                  >
                    {variant.images?.[0] ? (
                      <img
                        src={variant.images[0]}
                        alt=""
                        className="h-full w-full rounded-sm object-cover"
                      />
                    ) : (
                      <span
                        className="block h-full w-full rounded-sm"
                        style={{ backgroundColor: variant.color || '#DDD0C1' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-stretch gap-3">
              <div className="flex h-11 shrink-0 items-center border border-[#D9CFC2] bg-white/50">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-full w-10 items-center justify-center disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-8 text-center text-sm tabular-nums">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= 9}
                  onClick={() => setQuantity((value) => Math.min(9, value + 1))}
                  className="flex h-full w-10 items-center justify-center disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-11 min-w-[160px] flex-1 items-center justify-center gap-3 bg-[#792431] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5E1B26] sm:flex-none sm:px-8"
              >
                {added ? <Check size={17} /> : <ShoppingBag size={17} />}
                {added ? 'Added to cart' : 'Add to cart'}
              </button>

              <button
                type="button"
                aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlist}
                onClick={() => setWishlist((value) => !value)}
                className={`flex h-11 w-12 items-center justify-center border transition ${
                  wishlist
                    ? 'border-[#792431] bg-[#F4E7E5] text-[#792431]'
                    : 'border-[#D9CFC2] text-[#792431] hover:bg-[#F4E7E5]'
                }`}
              >
                <Heart size={19} fill={wishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
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
                {copied ? 'Link copied' : 'Share'}
              </button>
            </div>

            <div className="mt-5 border-t border-[#E7DED2] pt-4 text-[12px] leading-6">
              <p>
                <span className="inline-block w-[90px] font-medium">SKU:</span>
                <span className="text-[#82766C]">{product.sku || product.id}</span>
              </p>
              <p>
                <span className="inline-block w-[90px] font-medium">Categories:</span>
                <span className="text-[#82766C]">{product.category || 'Traditional Saree'}</span>
              </p>
              <p>
                <span className="inline-block w-[90px] font-medium">Availability:</span>
                <span className="inline-flex items-center gap-2 text-[#39764A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#39764A]" />
                  In stock
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 border-b border-[#E7DED2] sm:mt-16">
          <div className="flex flex-wrap gap-x-7 gap-y-0 sm:gap-x-9">
            {[
              { id: 'description', label: 'Description' },
              { id: 'information', label: 'Additional information' },
              { id: 'shipping', label: 'Shipping & returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] transition sm:text-[11px] ${
                  activeTab === tab.id
                    ? 'border-[#792431] text-[#792431]'
                    : 'border-transparent text-[#8B8178] hover:text-[#792431]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-7 py-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
          <div className="text-[13px] leading-6 text-[#82776E]">
            {activeTab === 'description' && (
              <p>
                {product.description ||
                  `This exquisite ${product.name} brings together traditional craftsmanship and timeless elegance. Its carefully selected design makes it a beautiful choice for weddings, festive celebrations and special occasions.`}
              </p>
            )}

            {activeTab === 'information' && (
              <div className="space-y-2">
                <p><span className="font-medium text-[#514137]">Product:</span> {product.name}</p>
                <p><span className="font-medium text-[#514137]">Color:</span> {selectedVariant?.name}</p>
                <p><span className="font-medium text-[#514137]">Category:</span> {product.category || 'Traditional Saree'}</p>
                <p><span className="font-medium text-[#514137]">SKU:</span> {product.sku || product.id}</p>
              </div>
            )}

            {activeTab === 'shipping' && (
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
              { icon: Package, title: 'Fabric', detail: 'Premium textile' },
              { icon: Leaf, title: 'Craftsmanship', detail: 'Detailed finish' },
              { icon: Heart, title: 'Occasion', detail: 'Wedding, festive' },
              { icon: ShieldCheck, title: 'Care', detail: 'Follow care label' },
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

        <section className="mt-6">
          <div className="mb-6 flex items-center gap-5">
            <h2 className="shrink-0 font-serif text-2xl tracking-tight sm:text-3xl">
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
            {relatedProducts.slice(0, 4).map((item, index) => {
              const image = item.variants?.[0]?.images?.[0] || productImages[index % productImages.length].src;

              return (
                <article key={item.id} className="group min-w-0">
                  <div className="relative overflow-hidden rounded-md bg-[#F0E8DC]">
                    <Link to={`/product/${item.id}`} aria-label={`View ${item.name}`}>
                      <img
                        src={image}
                        alt={item.name}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>

                    {item.compareAtInr && item.compareAtInr > item.priceInr && (
                      <span className="absolute left-2 top-2 bg-[#D7AE3F] px-2 py-1 text-[9px] font-semibold text-white sm:left-3 sm:top-3">
                        SALE
                      </span>
                    )}

                    <button
                      type="button"
                      aria-label={`Add ${item.name} to wishlist`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#792431] transition hover:bg-[#F3E4E2] sm:right-3 sm:top-3"
                    >
                      <Heart size={15} strokeWidth={1.5} />
                    </button>
                  </div>

                  <Link
                    to={`/product/${item.id}`}
                    className="mt-3 block line-clamp-2 text-center font-serif text-[12px] leading-5 text-[#4A382E] transition hover:text-[#792431] sm:text-[13px]"
                  >
                    {item.name}
                  </Link>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                    {item.compareAtInr && (
                      <span className="text-[#B6AEA5] line-through">
                        <Price amountInr={item.compareAtInr} />
                      </span>
                    )}
                    <span className="font-semibold text-[#B68B2E]">
                      <Price amountInr={item.priceInr} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
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
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10"
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
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-8"
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
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-8"
          >
            <ArrowRight size={21} />
          </button>
        </div>
      )}
    </main>
  );
}
