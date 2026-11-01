
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  getProducts,
  deactivateProduct
} from "../../services/admin/products.service";

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD"
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProducts({
        page,
        limit: 10,
        search: search.trim() || undefined
      });

      setProducts(result.products);
      setPages(result.pages || 1);
      setTotal(result.total);
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 350);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  async function handleDeactivate(product) {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${product.name}"?`
    );

    if (!confirmed) return;

    setActionId(product._id);
    setError("");

    try {
      await deactivateProduct(product._id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to deactivate product");
    } finally {
      setActionId(null);
    }
  }

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
            Store management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#4b2927]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[#927e6e]">
            Manage your saree collection and product inventory.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b302e] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#442321]"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eee8df] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#927e6e]">Total active products</p>
            <Package size={20} className="text-[#9b806b]" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#4b2927]">
            {total}
          </p>
        </div>

        <div className="rounded-2xl border border-[#eee8df] bg-white p-5">
          <p className="text-sm text-[#927e6e]">Current page</p>
          <p className="mt-3 text-2xl font-semibold text-[#4b2927]">
            {page} <span className="text-base font-normal text-[#a18c7c]">/ {pages}</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#eee8df] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eee8df] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c7c]"
            />
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-[#eee8df] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#8b6257]"
            />
          </div>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8df] px-4 py-3 text-sm text-[#715d50] hover:bg-[#faf8f4] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#faf8f4] text-xs uppercase tracking-wider text-[#927e6e]">
              <tr>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0ebe4]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-sm text-[#927e6e]">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-sm text-[#927e6e]">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="transition hover:bg-[#fffdf9]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f0e9]">
                          {product.imagePath ? (
                            <img
                              src={product.imagePath}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#a18c7c]">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#4b2927]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-[#a18c7c]">
                            {product.slug || product._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#715d50]">
                      {product.categoryId?.name || "Uncategorised"}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#4b2927]">
                      {currency.format(Number(product.price || 0))}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#715d50]">
                      {product.stock ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          title="Edit product"
                          className="rounded-lg border border-[#eee8df] p-2 text-[#715d50] hover:bg-[#f5f0e9]"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          title="Deactivate product"
                          onClick={() => handleDeactivate(product)}
                          disabled={actionId === product._id}
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#eee8df] px-5 py-4">
          <p className="text-xs text-[#927e6e]">
            Page {page} of {pages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-[#eee8df] p-2 text-[#715d50] disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pages, current + 1))}
              disabled={page >= pages || loading}
              className="rounded-lg border border-[#eee8df] p-2 text-[#715d50] disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
