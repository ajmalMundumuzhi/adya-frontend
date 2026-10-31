
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import {
  getProductsPage,
  getCategories,
} from '../services/store.service';

const PAGE_SIZE = 9;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [saleOnly, setSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (!cancelled) {
          setCategories(
            data.filter((item) => item.isActive !== false)
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Category loading failed:', err);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const categorySlug = searchParams.get('category');

    if (!categorySlug) {
      setCategory('All');
      return;
    }

    const matchedCategory = categories.find(
      (item) => item.slug === categorySlug
    );

    if (matchedCategory) {
      setCategory(matchedCategory._id);
      setPage(1);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        const params = {
          page,
          limit: PAGE_SIZE,
          sort: sortBy === 'featured' ? 'newest' : sortBy,
        };

        if (category !== 'All') {
          params.categoryId = category;
        }

        if (color !== 'All') {
          params.color = color;
        }

        if (minPrice > 0) {
          params.minPrice = minPrice;
        }

        if (maxPrice < 25000) {
          params.maxPrice = maxPrice;
        }

        if (saleOnly) {
          params.onSale = true;
        }

        if (inStockOnly) {
          params.inStock = true;
        }

        const response = await getProductsPage(params);

        const formattedProducts = (response.products || [])
          .filter((product) => product.isActive !== false)
          .map((product) => ({
            id: product.slug || product._id,
            name: product.name,
            priceInr: product.price,
            compareAtInr: product.compareAtPrice,
            image:
              product.imagePath ||
              product.images?.[0] ||
              '',
            backImage: product.images?.[1] || '',
            tag: product.stock > 0 ? 'In stock' : 'Sold out',
            to: `/product/${product.slug || product._id}`,
          }));

        if (!cancelled) {
          setProducts(formattedProducts);
          setTotal(response.total || 0);
          setTotalPages(Math.max(1, response.pages || 1));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Product loading failed:', err);
          setError('Unable to load products. Please try again later.');
          setProducts([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [
    category,
    color,
    minPrice,
    maxPrice,
    saleOnly,
    inStockOnly,
    sortBy,
    page,
  ]);

  const visibleProducts = products;

  const resetFilters = () => {
    setCategory('All');
    setColor('All');
    setMinPrice(0);
    setMaxPrice(25000);
    setSaleOnly(false);
    setInStockOnly(false);
    setSortBy('featured');
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const filterContent = (
    <>
      <div className="border-b border-burgundy/10 pb-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Filter by price
        </h2>

        <div className="mt-6 flex items-center justify-between gap-3">
          <label className="flex-1 text-sm text-ink/70">
            Minimum
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={minPrice}
              onChange={(event) =>
                changeFilter(
                  setMinPrice,
                  Math.max(
                    0,
                    Math.min(
                      Number(event.target.value) || 0,
                      maxPrice
                    )
                  )
                )
              }
              className="mt-2 w-full rounded-sm border border-burgundy/15 bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="flex-1 text-sm text-ink/70">
            Maximum
            <input
              type="number"
              min={minPrice}
              max="25000"
              value={maxPrice}
              onChange={(event) =>
                changeFilter(
                  setMaxPrice,
                  Math.max(
                    minPrice,
                    Math.min(
                      Number(event.target.value) || 0,
                      25000
                    )
                  )
                )
              }
              className="mt-2 w-full rounded-sm border border-burgundy/15 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-ink/60">
          Prices are filtered in INR; display currency follows your currency setting.
        </p>
      </div>

      <div className="border-b border-burgundy/10 py-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Category
        </h2>

        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/75">
            <input
              type="radio"
              name="category"
              checked={category === 'All'}
              onChange={() => changeFilter(setCategory, 'All')}
              className="accent-burgundy"
            />
            All categories
          </label>

          {categories.map((item) => (
            <label
              key={item._id}
              className="flex cursor-pointer items-center gap-3 text-sm text-ink/75"
            >
              <input
                type="radio"
                name="category"
                checked={category === item._id}
                onChange={() =>
                  changeFilter(setCategory, item._id)
                }
                className="accent-burgundy"
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-burgundy/10 py-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Filter by color
        </h2>

        <select
          value={color}
          onChange={(event) =>
            changeFilter(setColor, event.target.value)
          }
          className="mt-4 w-full rounded-sm border border-burgundy/15 bg-white px-3 py-3 text-sm"
        >
          <option value="All">Any color</option>
          <option value="Red">Red</option>
          <option value="Gold">Gold</option>
          <option value="Green">Green</option>
          <option value="Ivory">Ivory</option>
          <option value="Pink">Pink</option>
          <option value="Blue">Blue</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
        </select>
      </div>

      <div className="py-7">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Stock status
        </h2>

        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/75">
            <input
              type="checkbox"
              checked={saleOnly}
              onChange={(event) =>
                changeFilter(setSaleOnly, event.target.checked)
              }
              className="accent-burgundy"
            />
            On sale
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/75">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) =>
                changeFilter(setInStockOnly, event.target.checked)
              }
              className="accent-burgundy"
            />
            In stock
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="text-sm font-medium text-burgundy underline underline-offset-4"
      >
        Clear all filters
      </button>
    </>
  );

  return (
    <main className="min-h-screen bg-ivory-50">
      <section className="border-b border-burgundy/5 bg-ivory-100 px-5 py-10 text-center sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          The ADYA collection
        </p>

        <h1 className="mt-3 font-display text-4xl text-burgundy sm:text-5xl">
          All Sarees
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65 sm:text-base">
          Explore timeless weaves, thoughtful details and sarees for
          meaningful moments.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-ink/55 sm:text-sm"
        >
          <Link to="/" className="hover:text-burgundy">
            Home
          </Link>

          <ChevronRight size={14} />

          <span className="text-ink">All Sarees</span>
        </nav>

        <div className="flex items-center justify-between gap-4 border-b border-burgundy/10 pb-5 lg:hidden">
          <p className="text-sm text-ink/65">
            {total} products
          </p>

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen((value) => !value)
            }
            className="inline-flex items-center gap-2 border border-burgundy/15 px-4 py-2.5 text-sm"
          >
            <SlidersHorizontal size={16} />
            {mobileFiltersOpen ? 'Hide filters' : 'Filters'}
            <ChevronDown size={15} />
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="border-b border-burgundy/10 py-6 lg:hidden">
            {filterContent}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              {filterContent}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink/60">
                Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                {'–'}
                {Math.min(page * PAGE_SIZE, total)} of {total} products
              </p>

              <label className="flex items-center gap-3 text-sm">
                <span className="whitespace-nowrap text-ink/60">
                  Sort by
                </span>

                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setPage(1);
                  }}
                  className="max-w-[190px] border-0 bg-transparent py-2 font-medium text-ink focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>

            {loading && (
              <p className="py-12 text-center text-sm text-ink/60">
                Loading sarees...
              </p>
            )}

            {error && (
              <p className="py-12 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && visibleProducts.length > 0 && (
              <ProductGrid
                products={visibleProducts}
                columns={3}
              />
            )}

            {!loading && !error && visibleProducts.length === 0 && (
              <div className="py-20 text-center">
                <h2 className="font-display text-2xl text-burgundy">
                  No sarees found
                </h2>

                <p className="mt-3 text-sm text-ink/60">
                  Try changing your filters to see more products.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-white"
                >
                  Clear filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-12 flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  disabled={page === 1 || loading}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                  className="rounded-sm border border-burgundy/15 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-current={
                      page === pageNumber ? 'page' : undefined
                    }
                    onClick={() => setPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-sm border px-3 text-sm ${
                      page === pageNumber
                        ? 'border-burgundy bg-burgundy text-white'
                        : 'border-burgundy/15 hover:border-burgundy'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages || loading}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="rounded-sm border border-burgundy/15 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
