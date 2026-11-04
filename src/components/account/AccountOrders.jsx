
import { useCallback, useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Truck,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import useCurrency from "../../hooks/useCurrency";
import {
  getMyOrders,
  getMyOrderById
} from "../../services/orders.service";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
};

const formatOrderId = (order) => {
  if (!order) return "Unavailable";

  return order.orderNumber
    ? `#${order.orderNumber}`
    : `#${order._id?.slice(-8).toUpperCase() || "Unavailable"}`;
};

const getStatusStyle = (status) => {
  const value = String(status || "").toLowerCase();

  if (["delivered", "completed"].includes(value)) {
    return "bg-green-100 text-green-800";
  }

  if (["cancelled", "failed", "rejected"].includes(value)) {
    return "bg-red-100 text-red-800";
  }

  if (["shipped", "out_for_delivery"].includes(value)) {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-amber-100 text-amber-800";
};

const formatStatus = (status) => {
  return String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function OrderDetails({ order, formatPrice }) {
  const address = order.shippingAddress;
  const currency = order.currency || "AUD";

  return (
    <div className="border-t border-[#B49A68]/25 px-5 py-6 sm:px-6">
      <h4 className="text-xl font-display">Order items</h4>

      <div className="mt-5 space-y-5">
        {order.items?.map((item, index) => (
          <div
            key={item._id || `${item.productId}-${index}`}
            className="flex gap-4"
          >
            <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#F0E8DC]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productName || "ADYA product"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingBag size={22} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-medium">
                {item.productName || "ADYA product"}
              </h5>

              <p className="mt-1 text-xs text-[#493829]/65">
                {item.variantColor && `Colour: ${item.variantColor}`}
                {item.variantColor && item.selectedSize && " · "}
                {item.selectedSize && `Size: ${item.selectedSize}`}
              </p>

              <p className="mt-1 text-xs text-[#493829]/65">
                Quantity: {item.quantity}
              </p>

              <p className="mt-2 text-sm font-semibold">
                {formatPrice(
                  Number(item.unitPrice ?? 0) *
                  Number(item.quantity || 0),
                  currency
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-6 border-t border-[#B49A68]/25 pt-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={17} />
            <h4 className="font-medium">Delivery address</h4>
          </div>

          {address ? (
            <div className="mt-3 text-sm leading-6 text-[#493829]/70">
              {typeof address === "string" ? (
                <p>{address}</p>
              ) : (
                <>
                  <p>{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#493829]/60">
              Address unavailable.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <CreditCard size={17} />
            <h4 className="font-medium">Payment information</h4>
          </div>

          <div className="mt-3 space-y-2 text-sm text-[#493829]/70">
            <p>Method: {formatStatus(order.paymentMethod)}</p>
            <p>Payment status: {formatStatus(order.paymentStatus)}</p>
            <p>
              Subtotal: {formatPrice(order.subtotal ?? 0, currency)}
            </p>
            <p>
              Shipping: {formatPrice(order.shippingCharge ?? 0, currency)}
            </p>
            <p className="border-t border-[#B49A68]/25 pt-3 font-semibold text-[#493829]">
              Total: {formatPrice(order.totalAmount ?? 0, currency)}
            </p>
          </div>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-6 border-t border-[#B49A68]/25 pt-5">
          <div className="flex items-center gap-2">
            <Truck size={17} />
            <h4 className="font-medium">Tracking information</h4>
          </div>

          <p className="mt-2 text-sm text-[#493829]/70">
            {order.trackingProvider || "Delivery partner"}:{" "}
            {order.trackingNumber}
          </p>

          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-3 text-sm font-medium underline underline-offset-4"
            >
              Track shipment
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function AccountOrders() {
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState("");
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder("");
      return;
    }

    setExpandedOrder(orderId);

    if (detailCache[orderId]) return;

    try {
      setDetailLoading(orderId);

      const order = await getMyOrderById(orderId);

      setDetailCache((current) => ({
        ...current,
        [orderId]: order
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load order details."
      );
    } finally {
      setDetailLoading("");
    }
  };

  if (loading) {
    return (
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
          Your purchases
        </p>

        <h2 className="mt-2 text-3xl font-display sm:text-4xl">
          My orders
        </h2>

        <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-16 text-center">
          <RefreshCw className="mx-auto animate-spin" size={24} />
          <p className="mt-4 text-sm text-[#493829]/65">
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  if (error && orders.length === 0) {
    return (
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
          Your purchases
        </p>

        <h2 className="mt-2 text-3xl font-display sm:text-4xl">
          My orders
        </h2>

        <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center">
          <p className="text-sm text-[#8C3A36]">{error}</p>

          <button
            type="button"
            onClick={loadOrders}
            className="mt-5 bg-[#493829] px-6 py-3 text-sm text-white"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
            Your purchases
          </p>

          <h2 className="mt-2 text-3xl font-display sm:text-4xl">
            My orders
          </h2>

          <p className="mt-2 text-sm text-[#493829]/65">
            View your purchases and follow your deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#493829]/30 px-4 py-2 text-sm transition hover:bg-[#D4BC98]/20"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="mt-5 text-sm text-[#8C3A36]">{error}</p>
      )}

      {orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
            <Package size={27} strokeWidth={1.4} />
          </div>

          <h3 className="mt-5 text-2xl font-display">
            No orders yet
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
            Your purchases will appear here once you place your first order.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-11 items-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] hover:bg-[#5B4835]"
          >
            <ShoppingBag size={16} />
            Explore sarees
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {orders.map((order) => {
            const orderId = order._id;
            const isExpanded = expandedOrder === orderId;
            const details = detailCache[orderId] || order;

            return (
              <article
                key={orderId}
                className="overflow-hidden border border-[#B49A68]/35 bg-white/40"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs text-[#493829]/55">
                        Order number
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        {formatOrderId(order)}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#493829]/65">
                        <CalendarDays size={14} />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyle(order.status)}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 border-t border-[#B49A68]/20 pt-5 sm:flex-row sm:items-center">
                    <div className="flex -space-x-3">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          key={item._id || index}
                          className="h-14 w-12 overflow-hidden border-2 border-[#F8F3E8] bg-[#F0E8DC]"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName || "Product"}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package size={20} className="m-3" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {order.items?.length || 0} product
                        {order.items?.length === 1 ? "" : " items"}
                      </p>

                      <p className="mt-1 text-xs text-[#493829]/60">
                        {order.items
                          ?.slice(0, 2)
                          .map((item) => item.productName)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-[#493829]/55">
                        Order total
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {formatPrice(
                          order.totalAmount ?? 0,
                          order.currency || "AUD"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#B49A68]/20 pt-4">
                    <p className="text-xs text-[#493829]/65">
                      Payment: {formatStatus(order.paymentMethod)} ·{" "}
                      {formatStatus(order.paymentStatus)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/account/orders/${orderId}/invoice`}
                        className="inline-flex min-h-10 items-center gap-2 bg-[#51cfae] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#39b998]"
                      >
                        <FileText size={15} />
                        View Invoice
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleExpand(orderId)}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#493829]/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#D4BC98]/20"
                      >
                        {isExpanded ? "Hide details" : "View details"}
                        {isExpanded ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  detailLoading === orderId ? (
                    <div className="border-t border-[#B49A68]/25 px-5 py-8 text-center text-sm text-[#493829]/65">
                      Loading order details...
                    </div>
                  ) : (
                    <OrderDetails
                      order={details}
                      formatPrice={formatPrice}
                    />
                  )
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
