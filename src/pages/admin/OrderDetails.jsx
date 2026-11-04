
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User,
  RefreshCw,
  Save,
  ExternalLink,
  FileText
} from "lucide-react";
import {
  getOrderById,
  updateOrder
} from "../../services/admin/orders.service";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
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
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

function StatusBadge({ status }) {
  const value = status || "pending";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
        statusStyles[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function addressLines(address) {
  if (!address) return [];

  if (typeof address === "string") {
    return [address];
  }

  return [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.postalCode]
      .filter(Boolean)
      .join(", "),
    address.country
  ].filter(Boolean);
}

function InfoCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} className="text-[#8b6257]" />
        <h2 className="font-semibold text-[#4b2927]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    status: "pending",
    trackingProvider: "",
    trackingNumber: "",
    trackingUrl: ""
  });

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrderById(id);

      setOrder(data);
      setForm({
        status: data.status || "pending",
        trackingProvider: data.trackingProvider || "",
        trackingNumber: data.trackingNumber || "",
        trackingUrl: data.trackingUrl || ""
      });
    } catch (err) {
      setError(err.message || "Unable to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      ["cancelled", "delivered"].includes(order.status) &&
      form.status !== order.status
    ) {
      setError("Delivered or cancelled orders cannot change status.");
      return;
    }

    if (form.status === "shipped" && !form.trackingNumber.trim()) {
      setError("Enter a tracking number before shipping this order.");
      return;
    }

    if (
      form.trackingUrl.trim() &&
      !/^https?:\/\/.+/i.test(form.trackingUrl.trim())
    ) {
      setError("Enter a valid tracking URL starting with http:// or https://");
      return;
    }

    const payload = {
      status: form.status,
      trackingProvider: form.trackingProvider.trim(),
      trackingNumber: form.trackingNumber.trim(),
      trackingUrl: form.trackingUrl.trim()
    };

    setSaving(true);

    try {
      const updated = await updateOrder(id, payload);
      setOrder(updated);
      setForm({
        status: updated.status || "pending",
        trackingProvider: updated.trackingProvider || "",
        trackingNumber: updated.trackingNumber || "",
        trackingUrl: updated.trackingUrl || ""
      });
      setSuccess("Order updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update order");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 text-sm text-[#4b2927] outline-none transition focus:border-[#8b6257]";

  const labelClass = "text-sm font-medium text-[#624b40]";

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#927e6e]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">
          {error || "Order not found"}
        </p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-[#79534a]"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>
      </div>
    );
  }

  const currency = order.currency || "AUD";
  const shippingAddress = addressLines(order.shippingAddress);

  const itemCount = (order.items || []).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const statusLocked = ["cancelled", "delivered"].includes(order.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="rounded-xl border border-[#eee8df] bg-white p-2.5 text-[#715d50] hover:bg-[#f5f0e9]"
            aria-label="Back to orders"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
              Order management
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4b2927]">
              Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-[#927e6e]">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/orders/${id}/invoice`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#51cfae] px-4 py-3 text-sm font-medium text-white hover:bg-[#39b998]"
          >
            <FileText size={16} />
            View Invoice
          </Link>

          <button
            type="button"
            onClick={loadOrder}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8df] bg-white px-4 py-3 text-sm text-[#715d50] hover:bg-[#faf8f4]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#eee8df] bg-white p-5">
        <div>
          <p className="text-xs text-[#927e6e]">Order status</p>
          <div className="mt-2">
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="mx-2 hidden h-10 w-px bg-[#eee8df] sm:block" />

        <div>
          <p className="text-xs text-[#927e6e]">Payment status</p>
          <div className="mt-2">
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="mx-2 hidden h-10 w-px bg-[#eee8df] sm:block" />

        <div>
          <p className="text-xs text-[#927e6e]">Order total</p>
          <p className="mt-2 font-semibold text-[#4b2927]">
            {formatMoney(order.totalAmount, currency)}
          </p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-3 text-sm text-green-700 border border-green-200 rounded-xl bg-green-50">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <InfoCard title="Ordered Products" icon={Package}>
            <div className="space-y-4">
              {(order.items || []).map((item, index) => (
                <div
                  key={`${item.productId || item.productName}-${index}`}
                  className="flex flex-col gap-4 border-b border-[#f0ebe4] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f0e9]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#a18c7c]">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#4b2927]">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs text-[#927e6e]">
                      {[
                        item.variantColor,
                        item.selectedSize,
                        item.sku
                      ].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="mt-2 text-sm text-[#715d50]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold text-[#4b2927]">
                      {formatMoney(item.subtotal, currency)}
                    </p>
                    <p className="mt-1 text-xs text-[#927e6e]">
                      {formatMoney(item.unitPrice, currency)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#eee8df] pt-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#715d50]">
                  <span>Items ({itemCount})</span>
                  <span>{formatMoney(order.subtotal, currency)}</span>
                </div>

                <div className="flex justify-between text-[#715d50]">
                  <span>Shipping</span>
                  <span>{formatMoney(order.shippingCharge, currency)}</span>
                </div>

                <div className="flex justify-between border-t border-[#eee8df] pt-3 text-base font-semibold text-[#4b2927]">
                  <span>Total</span>
                  <span>{formatMoney(order.totalAmount, currency)}</span>
                </div>

                <p className="text-xs text-[#a18c7c]">
                  Base AUD total: {formatMoney(order.totalAmountAUD, "AUD")}
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Customer Information" icon={User}>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[#a18c7c]">Customer name</p>
                <p className="mt-1 font-medium text-[#4b2927]">
                  {order.customerName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Email</p>
                <p className="mt-1 text-[#715d50]">
                  {order.customerEmail || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Phone</p>
                <p className="mt-1 text-[#715d50]">
                  {order.phone || "—"}
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Shipping Address" icon={MapPin}>
            <div className="space-y-1 text-sm text-[#715d50]">
              {shippingAddress.length ? (
                shippingAddress.map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              ) : (
                <p>Shipping address not available.</p>
              )}
            </div>
          </InfoCard>

          <InfoCard title="Payment Information" icon={CreditCard}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#a18c7c]">Payment method</p>
                <p className="mt-1 text-sm font-medium capitalize text-[#4b2927]">
                  {order.paymentMethod || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Payment status</p>
                <div className="mt-1">
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Currency</p>
                <p className="mt-1 text-sm text-[#4b2927]">{currency}</p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Exchange rate</p>
                <p className="mt-1 text-sm text-[#4b2927]">
                  {order.exchangeRate ?? "—"}
                </p>
              </div>

              <p className="text-xs text-[#927e6e] sm:col-span-2">
                Payment status is managed by the payment system and its webhook. It cannot be manually changed here.
              </p>
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <InfoCard title="Update Order & Delivery" icon={Truck}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className={labelClass}>
                Order Status
                <select
                  className={inputClass}
                  value={form.status}
                  disabled={statusLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value
                    }))
                  }
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/^\w/, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </label>

              {statusLocked && (
                <p className="text-xs text-[#927e6e]">
                  This order is {order.status}. Its status is locked.
                </p>
              )}

              <label className={labelClass}>
                Courier / Tracking Provider
                <input
                  className={inputClass}
                  value={form.trackingProvider}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      trackingProvider: event.target.value
                    }))
                  }
                  placeholder="Australia Post, DHL, FedEx..."
                />
              </label>

              <label className={labelClass}>
                Tracking Number
                <input
                  className={inputClass}
                  value={form.trackingNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      trackingNumber: event.target.value
                    }))
                  }
                  placeholder="Enter tracking number"
                />
              </label>

              <label className={labelClass}>
                Tracking URL
                <input
                  type="url"
                  className={inputClass}
                  value={form.trackingUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      trackingUrl: event.target.value
                    }))
                  }
                  placeholder="https://..."
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b302e] px-5 py-3 text-sm font-medium text-white hover:bg-[#442321] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Order Changes"}
              </button>
            </form>

            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#79534a] hover:underline"
              >
                Open tracking page
                <ExternalLink size={15} />
              </a>
            )}
          </InfoCard>

          <InfoCard title="Delivery Summary" icon={Truck}>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-[#a18c7c]">Courier</p>
                <p className="mt-1 text-[#4b2927]">
                  {order.trackingProvider || "Not assigned"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Tracking number</p>
                <p className="mt-1 break-all text-[#4b2927]">
                  {order.trackingNumber || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Order created</p>
                <p className="mt-1 text-[#4b2927]">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a18c7c]">Last updated</p>
                <p className="mt-1 text-[#4b2927]">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
