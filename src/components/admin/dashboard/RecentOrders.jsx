
import { Link } from "react-router-dom";
import { ArrowUpRight, Package } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function RecentOrders({ orders = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-16 animate-pulse border border-[#B49A68]/20 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="overflow-hidden border border-[#B49A68]/30 bg-white">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <Package size={28} className="text-[#92764B]" />
          <h3 className="mt-4 font-display text-xl text-[#493829]">
            No recent orders
          </h3>
          <p className="mt-2 text-sm text-[#493829]/55">
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 border-b border-[#B49A68]/25 bg-[#F8F3E8]/60 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#493829]/60 md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-[#B49A68]/20">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
              >
                <div>
                  <p className="text-xs text-[#493829]/50 md:hidden">
                    Order
                  </p>
                  <p className="text-sm font-semibold text-[#493829]">
                    #{String(order._id || "").slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#493829]/50 md:hidden">
                    Customer
                  </p>
                  <p className="text-sm text-[#493829]">
                    {order.customerName || "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#493829]/50 md:hidden">
                    Date
                  </p>
                  <p className="text-sm text-[#493829]/65">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#493829]/50 md:hidden">
                    Amount
                  </p>
                  <p className="text-sm font-semibold text-[#493829]">
                    A${Number(
                      order.totalAmountAUD ?? order.totalAmount ?? 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <span className="inline-flex bg-[#D4BC98]/30 px-3 py-1 text-xs font-medium capitalize text-[#493829]">
                    {String(order.status || "pending").replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end border-t border-[#B49A68]/20 px-5 py-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#493829] hover:text-[#92764B]"
        >
          View all orders
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
