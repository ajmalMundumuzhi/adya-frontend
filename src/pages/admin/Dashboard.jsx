
import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/admin/dashboard/StatCard";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import { getDashboardStats } from "../../services/admin/dashboard.service";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();
      setDashboard(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: dashboard?.totalRevenue ?? 0,
      prefix: "A$",
      icon: IndianRupee,
      change: dashboard?.revenueChange ?? 0,
    },
    {
      title: "Total Orders",
      value: dashboard?.totalOrders ?? 0,
      icon: ShoppingBag,
      change: dashboard?.ordersChange ?? 0,
    },
    {
      title: "Total Customers",
      value: dashboard?.totalCustomers ?? 0,
      icon: Users,
      change: dashboard?.customersChange ?? 0,
    },
    {
      title: "Total Products",
      value: dashboard?.totalProducts ?? 0,
      icon: Package,
      change: dashboard?.productsChange ?? 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92764B]">
            Overview
          </p>

          <h1 className="mt-2 font-display text-3xl text-[#493829] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#493829]/60">
            Welcome back. Here's what's happening with your store.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#B49A68]/40 bg-white px-4 py-2 text-sm text-[#493829] transition hover:bg-[#D4BC98]/20 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex flex-col justify-between gap-3 border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="text-sm font-semibold text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={loading} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <SalesChart
          data={dashboard?.salesOverview || []}
          loading={loading}
        />

        <div className="border border-[#B49A68]/30 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#92764B]">
                Order overview
              </p>
              <h2 className="mt-2 font-display text-xl text-[#493829]">
                Order status
              </h2>
            </div>
            <CalendarDays size={20} className="text-[#92764B]" />
          </div>

          <div className="mt-7 space-y-5">
            {[
              ["Pending", dashboard?.pendingOrders ?? 0],
              ["Processing", dashboard?.processingOrders ?? 0],
              ["Shipped", dashboard?.shippedOrders ?? 0],
              ["Delivered", dashboard?.deliveredOrders ?? 0],
              ["Cancelled", dashboard?.cancelledOrders ?? 0],
            ].map(([label, value]) => {
              const total = Number(dashboard?.totalOrders || 0);
              const percentage = total
                ? Math.min((Number(value) / total) * 100, 100)
                : 0;

              return (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-[#493829]/70">{label}</span>
                    <span className="font-semibold text-[#493829]">
                      {value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden bg-[#F0E8DC]">
                    <div
                      className="h-full bg-[#9A8058] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#92764B]">
              Latest activity
            </p>
            <h2 className="mt-2 font-display text-2xl text-[#493829]">
              Recent orders
            </h2>
          </div>

          <TrendingUp size={21} className="text-[#92764B]" />
        </div>

        <RecentOrders
          orders={dashboard?.recentOrders || []}
          loading={loading}
        />
      </section>
    </div>
  );
}
