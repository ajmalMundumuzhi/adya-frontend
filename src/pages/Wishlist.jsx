
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

const WISHLIST_KEY = 'adya-wishlist';

function readWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Wishlist() {
  const [products, setProducts] = useState(readWishlist);
  const { format } = useCurrency();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
    } catch {
        console.log("Error storing.")
    }
  }, [products]);

  function removeProduct(productId) {
    setProducts((current) =>
      current.filter((product) => product.id !== productId),
    );
  }

  function moveToCart(product) {
    try {
      const saved = localStorage.getItem('adya-cart');
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((line) => line.productId === product.id);

      let updatedCart;

      if (existing) {
        updatedCart = cart.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: Math.min(9, line.quantity + 1), product }
            : line,
        );
      } else {
        updatedCart = [
          ...cart,
          { productId: product.id, quantity: 1, product },
        ];
      }

      localStorage.setItem('adya-cart', JSON.stringify(updatedCart));
      removeProduct(product.id);
    } catch {
      return;
    }
  }

  return (
    <main className="min-h-screen bg-ivory-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-b border-[#C4B382]/40 pb-7 sm:mb-12">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8D7547]">
            Your personal collection
          </p>
          <div className="flex items-center gap-3">
            <Heart size={27} strokeWidth={1.4} className="text-[#A58F5D]" />
            <h1 className="font-display text-4xl text-[#51452F] sm:text-5xl">
              My Wishlist
            </h1>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'} saved for later
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
            <Heart
              size={48}
              strokeWidth={1.2}
              className="text-[#C4B382]"
            />
            <h2 className="mt-6 font-display text-3xl text-[#51452F]">
              Your wishlist is waiting
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-ink/60">
              Save the sarees you love and keep your favourite styles close.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 bg-[#75633D] px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#51452F]"
            >
              Explore collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group min-w-0"
              >
                <div className="relative overflow-hidden rounded-sm bg-[#E8D9B9] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Link
                    to={`/product/${product.id}`}
                    className="block aspect-[3/4] overflow-hidden"
                  >
                    <img
                      src={
                        product.image ||
                        product.variants?.[0]?.images?.[0] ||
                        productImagesFallback(product.id)
                      }
                      alt={product.name || 'Saved product'}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF9ED]/95 text-[#75633D] shadow-sm transition hover:bg-[#75633D] hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-display text-base leading-6 text-[#51452F] transition hover:text-[#8D7547] sm:text-lg"
                  >
                    {product.name}
                  </Link>

                  {Number.isFinite(Number(product.priceInr)) && (
                    <p className="mt-2 text-sm font-medium text-[#75633D]">
                      {format(Number(product.priceInr))}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => moveToCart(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 border border-[#C4B382] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#75633D] transition hover:bg-[#75633D] hover:text-white sm:text-xs"
                  >
                    <ShoppingBag size={15} />
                    Move to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function productImagesFallback(productId) {
  const images = {
    'kanjivaram-ruby':
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
    'banarasi-ivory':
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=500&q=80',
    'chanderi-gold':
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
  };

  return images[productId] || images['kanjivaram-ruby'];
}
