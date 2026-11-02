
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Package,
  AlertTriangle,
  Boxes,
  X,
  Plus,
  History
} from "lucide-react";

import {
  getInventoryProducts,
  adjustInventoryStock,
  getInventoryHistory
} from "../../services/admin/inventory.service";

import adminApi from "../../services/admin/admin.api";

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

function getStockStatus(stock, threshold) {
  if (stock <= 0) return "Out of stock";
  if (stock <= threshold) return "Low stock";
  return "In stock";
}

function StockBadge({ stock, threshold }) {
  const status = getStockStatus(stock, threshold);

  const styles = {
    "In stock": "bg-emerald-50 text-emerald-700",
    "Low stock": "bg-amber-50 text-amber-700",
    "Out of stock": "bg-red-50 text-red-700"
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{title}</p>
        <div className="rounded-lg bg-stone-100 p-2 text-stone-600">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold text-stone-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-stone-400">
        {description}
      </p>
    </div>
  );
}

function StockAdjustmentModal({ item, onClose, onSave, saving }) {
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("increase");
  const [reason, setReason] = useState("Restock");

  useEffect(() => {
    if (!item) return;

    setQuantity("");
    setAction("increase");
    setReason("Restock");
  }, [item]);

  if (!item) return null;

  function submit(event) {
    event.preventDefault();

    const amount = Number(quantity);

    if (
      !Number.isInteger(amount) ||
      amount < (action === "set" ? 0 : 1)
    ) {
      return;
    }

    onSave({
      ...item,
      action,
      quantity: amount,
      reason
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Inventory adjustment
            </p>
            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              Update stock
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-stone-50 p-4">
          <p className="text-sm font-medium text-stone-900">
            {item.productName}
          </p>

          <p className="mt-1 text-xs text-stone-500">
            {item.color} / {item.size}
          </p>

          <p className="mt-3 text-sm text-stone-600">
            Current stock: <strong>{item.stock}</strong>
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-stone-600">
              Adjustment type
            </label>

            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-3 text-sm"
            >
              <option value="increase">Add stock</option>
              <option value="decrease">Remove stock</option>
              <option value="set">Set exact stock</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-stone-600">
              {action === "set" ? "New stock quantity" : "Quantity"}
            </label>

            <input
              type="number"
              min={action === "set" ? 0 : 1}
              step="1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Enter quantity"
              className="w-full rounded-lg border border-stone-200 px-3 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-stone-600">
              Reason
            </label>

            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-3 text-sm"
            >
              <option value="Restock">Restock</option>
              <option value="Damaged">Damaged goods</option>
              <option value="Correction">Stock correction</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              quantity === "" ||
              !Number.isInteger(Number(quantity)) ||
              Number(quantity) < (action === "set" ? 0 : 1)
            }
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {saving ? "Updating..." : "Save adjustment"}
          </button>
        </div>
      </form>
    </div>
  );
}

function HistoryTable({ logs, loading }) {
  if (loading) {
    return (
      <div className="px-5 py-12 text-center text-sm text-stone-500">
        Loading inventory history...
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="px-5 py-12 text-center text-sm text-stone-500">
        No stock adjustments recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left">
        <thead className="border-b border-stone-100 bg-stone-50">
          <tr className="text-xs uppercase tracking-wide text-stone-500">
            {[
              "Date",
              "Product",
              "Variant",
              "Change",
              "Previous",
              "New stock",
              "Reason"
            ].map((heading) => (
              <th key={heading} className="px-5 py-4 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-100">
          {logs.map((log) => (
            <tr key={log._id} className="text-sm text-stone-600">
              <td className="whitespace-nowrap px-5 py-4 text-xs">
                {log.createdAt
                  ? new Date(log.createdAt).toLocaleString()
                  : "—"}
              </td>

              <td className="px-5 py-4 font-medium text-stone-900">
                {log.productName || log.productId?.name || "Product"}
              </td>

              <td className="px-5 py-4">
                {log.color} / {log.size}
              </td>

              <td
                className={`px-5 py-4 ${
                  log.quantityChange >= 0
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {log.quantityChange > 0 ? "+" : ""}
                {log.quantityChange}
              </td>

              <td className="px-5 py-4">
                {log.previousStock}
              </td>

              <td className="px-5 py-4 font-semibold text-stone-900">
                {log.newStock}
              </td>

              <td className="px-5 py-4">
                {log.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [activeTab, setActiveTab] = useState("stock");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPages, setHistoryPages] = useState(1);

  const [lowStockThreshold, setLowStockThreshold] = useState(
    DEFAULT_LOW_STOCK_THRESHOLD
  );
  const [thresholdLoading, setThresholdLoading] = useState(true);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getInventoryProducts();
      setProducts(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load inventory"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThreshold = useCallback(async () => {
    try {
      setThresholdLoading(true);

      const response = await adminApi.get(
        "/settings/inventory.lowStockThreshold"
      );

      const value = Number(response.data?.data?.value);

      if (Number.isInteger(value) && value >= 1 && value <= 100000) {
        setLowStockThreshold(value);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load low-stock threshold. Using the default threshold of 5."
      );
    } finally {
      setThresholdLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (page) => {
    try {
      setHistoryLoading(true);

      const result = await getInventoryHistory({
        page,
        limit: 20
      });

      setHistory(result.logs);
      setHistoryPages(Math.max(1, result.pages));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load inventory history"
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
    loadThreshold();
  }, [loadInventory, loadThreshold]);

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory(historyPage);
    }
  }, [activeTab, historyPage, loadHistory]);

  const inventoryItems = useMemo(() => {
    return products.flatMap((product) =>
      (product.variants || []).flatMap((variant) =>
        (variant.sizes || []).map((size) => ({
          productId: product._id,
          variantId: variant._id,
          sizeOptionId: size._id,
          productName: product.name || "",
          color: variant.color || "",
          size: size.size || "",
          sku: size.sku || "",
          stock: Number(size.stock || 0),
          image: variant.images?.[0] || ""
        }))
      )
    );
  }, [products]);

  const stats = useMemo(() => ({
    totalStock: inventoryItems.reduce(
      (total, item) => total + item.stock,
      0
    ),

    lowStock: inventoryItems.filter(
      (item) =>
        item.stock > 0 &&
        item.stock <= lowStockThreshold
    ).length,

    outOfStock: inventoryItems.filter(
      (item) => item.stock === 0
    ).length,

    totalVariants: inventoryItems.length
  }), [inventoryItems, lowStockThreshold]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventoryItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.productName.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query) ||
        item.size.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query);

      const matchesFilter =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          item.stock > 0 &&
          item.stock <= lowStockThreshold) ||
        (stockFilter === "out" && item.stock === 0) ||
        (stockFilter === "available" &&
          item.stock > lowStockThreshold);

      return matchesSearch && matchesFilter;
    });
  }, [inventoryItems, search, stockFilter, lowStockThreshold]);

  async function handleAdjustment(adjustment) {
    try {
      setSaving(true);
      setError("");

      await adjustInventoryStock({
        variantId: adjustment.variantId,
        sizeOptionId: adjustment.sizeOptionId,
        action: adjustment.action,
        quantity: adjustment.quantity,
        reason: adjustment.reason
      });

      setSelectedItem(null);

      await loadInventory();

      setHistoryPage(1);

      if (activeTab === "history") {
        await loadHistory(1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to update stock"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            Product management
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-stone-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Monitor stock, make adjustments and review stock movement history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadInventory();
            loadThreshold();

            if (activeTab === "history") {
              loadHistory(historyPage);
            }
          }}
          disabled={loading || historyLoading || thresholdLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              loading || historyLoading || thresholdLoading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total stock"
          value={stats.totalStock}
          icon={Boxes}
          description="Units across all sizes"
        />

        <StatCard
          title="Tracked sizes"
          value={stats.totalVariants}
          icon={Package}
          description="Product size options"
        />

        <StatCard
          title="Low stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          description={
            thresholdLoading
              ? "Loading threshold..."
              : `Between 1 and ${lowStockThreshold} units`
          }
        />

        <StatCard
          title="Out of stock"
          value={stats.outOfStock}
          icon={Package}
          description="Size options unavailable"
        />
      </div>

      <div className="flex gap-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab("stock")}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
            activeTab === "stock"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-500"
          }`}
        >
          <Boxes size={16} />
          Current stock
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
            activeTab === "history"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-500"
          }`}
        >
          <History size={16} />
          Stock history
        </button>
      </div>

      {activeTab === "stock" ? (
        <>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product, colour, size or SKU..."
                  className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-stone-500"
                />
              </div>

              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm"
              >
                <option value="all">All stock</option>
                <option value="available">Available</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-stone-100 bg-stone-50">
                  <tr className="text-xs uppercase tracking-wide text-stone-500">
                    {[
                      "Product",
                      "Colour",
                      "Size",
                      "SKU",
                      "Stock",
                      "Status",
                      "Action"
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 font-medium"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {loading || thresholdLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center text-sm text-stone-500"
                      >
                        Loading inventory...
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center text-sm text-stone-500"
                      >
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={`${item.variantId}-${item.sizeOptionId}`}
                        className="transition hover:bg-stone-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-10 overflow-hidden rounded-lg bg-stone-100">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>

                            <span className="max-w-[220px] truncate text-sm font-medium text-stone-900">
                              {item.productName}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-600">
                          {item.color}
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-600">
                          {item.size}
                        </td>

                        <td className="px-5 py-4 text-xs text-stone-500">
                          {item.sku || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold tabular-nums text-stone-900">
                          {item.stock}
                        </td>

                        <td className="px-5 py-4">
                          <StockBadge
                            stock={item.stock}
                            threshold={lowStockThreshold}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                            >
                              <Plus size={14} />
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-stone-100 px-5 py-4 text-xs text-stone-500">
              Showing {filteredItems.length} of {inventoryItems.length} size options
              {!thresholdLoading && (
                <span className="ml-2">
                  · Low-stock threshold: {lowStockThreshold}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <HistoryTable
            logs={history}
            loading={historyLoading}
          />

          <div className="flex items-center justify-between border-t border-stone-100 px-5 py-4">
            <p className="text-xs text-stone-500">
              Page {historyPage} of {historyPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={historyPage <= 1 || historyLoading}
                onClick={() =>
                  setHistoryPage((page) => Math.max(1, page - 1))
                }
                className="rounded-lg border border-stone-200 px-3 py-2 text-xs disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={historyPage >= historyPages || historyLoading}
                onClick={() => setHistoryPage((page) => page + 1)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <StockAdjustmentModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSave={handleAdjustment}
        saving={saving}
      />
    </div>
  );
}
