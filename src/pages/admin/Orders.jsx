
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getOrders } from "../../services/admin/orders.service";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

const paymentStatuses = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded"
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
  partially_refunded: "bg-orange-50 text-orange-700"
};

function formatMoney(amount, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency || "AUD"
    }).format(Number(amount || 0));
  } catch {
    return `${currency || "AUD"} ${Number(amount || 0).toFixed(2)}`;
  }
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function StatusBadge({ status }) {
  const value = status || "pending";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
        statusStyles[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        String(order.orderNumber || order._id).toLowerCase().includes(term) ||
        String(order.customerName || "").toLowerCase().includes(term) ||
        String(order.customerEmail || "").toLowerCase().includes(term) ||
        String(order.phone || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      processing: orders.filter(
        (order) => order.status === "processing"
      ).length,
      delivered: orders.filter(
        (order) => order.status === "delivered"
      ).length
    }),
    [orders]
  );

  function resetPage() {
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
            Orders
          </h1>
          <p className="mt-1 text-sm text-[#927e6e]">
            Manage customer orders, payments and deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8df] bg-white px-4 py-3 text-sm text-[#715d50] hover:bg-[#faf8f4] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Orders
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Orders", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Processing", value: counts.processing },
          { label: "Delivered", value: counts.delivered }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#eee8df] bg-white p-5"
          >
            <p className="text-sm text-[#927e6e]">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-[#4b2927]">
              {loading ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#eee8df] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eee8df] p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c7c]"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              placeholder="Search order, customer or email..."
              className="w-full rounded-xl border border-[#eee8df] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8b6257]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetPage();
              }}
              className="rounded-xl border border-[#eee8df] bg-white px-3 py-3 text-sm text-[#715d50] outline-none focus:border-[#8b6257]"
            >
              <option value="all">All order statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => {
                setPaymentFilter(event.target.value);
                resetPage();
              }}
              className="rounded-xl border border-[#eee8df] bg-white px-3 py-3 text-sm text-[#715d50] outline-none focus:border-[#8b6257]"
            >
              <option value="all">All payment statuses</option>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf8f4] text-xs uppercase tracking-wider text-[#927e6e]">
              <tr>
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Order Status</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0ebe4]">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center text-sm text-[#927e6e]"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <ShoppingBag
                      size={28}
                      className="mx-auto text-[#b9a99a]"
                    />
                    <p className="mt-3 text-sm text-[#927e6e]">
                      No orders found.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#fffdf9]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#4b2927]">
                        #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-[#a18c7c]">
                        {order.items?.length || 0} product types
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#4b2927]">
                        {order.customerName || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-[#927e6e]">
                        {order.customerEmail || order.phone || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#715d50]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#4b2927]">
                      {formatMoney(order.totalAmount, order.currency)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <p className="text-xs capitalize text-[#715d50]">
                          {order.paymentMethod || "—"}
                        </p>
                        <StatusBadge status={order.paymentStatus} />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#eee8df] px-3 py-2 text-sm text-[#715d50] hover:bg-[#f5f0e9]"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eee8df] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#927e6e]">
            Showing {filteredOrders.length === 0 ? 0 : (page - 1) * pageSize + 1}
            {" "}to{" "}
            {Math.min(page * pageSize, filteredOrders.length)}
            {" "}of {filteredOrders.length} orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-[#eee8df] p-2 text-[#715d50] disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-xs text-[#715d50]">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages || loading}
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
