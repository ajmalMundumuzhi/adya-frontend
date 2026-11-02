
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck
} from "lucide-react";

import {
  getCustomers,
  getCustomerById,
  updateCustomerStatus
} from "../../services/admin/customers.service";

const PAGE_SIZE = 10;

const getCustomerName = customer =>
  customer?.name ||
  customer?.fullName ||
  customer?.customerName ||
  "Unnamed customer";

const getInitials = name =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-stone-100 text-stone-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-stone-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CustomerDetailsModal({
  customer,
  loading,
  onClose,
  onStatusChange,
  updating
}) {
  if (!customer && !loading) return null;

  const name = getCustomerName(customer || {});
  const active = customer?.isActive !== false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
              Customer profile
            </p>
            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              Customer details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={19} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-stone-500">
            Loading customer details...
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-lg font-semibold text-stone-700">
                {getInitials(name)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-stone-900">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Customer ID: {customer?._id}
                </p>
              </div>

              <StatusBadge active={active} />
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Mail size={14} />
                  Email
                </div>
                <p className="mt-2 break-all text-sm font-medium text-stone-800">
                  {customer?.email || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Phone size={14} />
                  Phone
                </div>
                <p className="mt-2 text-sm font-medium text-stone-800">
                  {customer?.phone || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <CalendarDays size={14} />
                  Joined
                </div>
                <p className="mt-2 text-sm font-medium text-stone-800">
                  {formatDate(customer?.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <ShieldCheck size={14} />
                  Account status
                </div>
                <p className="mt-2 text-sm font-medium text-stone-800">
                  {active ? "Active account" : "Inactive account"}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => onStatusChange(customer._id, !active)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
                  active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-700 hover:bg-emerald-800"
                }`}
              >
                {updating
                  ? "Updating..."
                  : active
                    ? "Deactivate customer"
                    : "Activate customer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCustomers();
      setCustomers(result);
    } catch (err) {
      setError(err.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const stats = useMemo(() => {
    const active = customers.filter(
      customer => customer.isActive !== false
    ).length;

    return {
      total: customers.length,
      active,
      inactive: customers.length - active
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter(customer => {
      const matchesSearch =
        !query ||
        getCustomerName(customer).toLowerCase().includes(query) ||
        String(customer.email || "").toLowerCase().includes(query) ||
        String(customer.phone || "").toLowerCase().includes(query);

      const active = customer.isActive !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / PAGE_SIZE)
  );

  const visibleCustomers = filteredCustomers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const openCustomer = async customer => {
    setSelectedCustomer(customer);
    setLoadingDetails(true);

    try {
      const details = await getCustomerById(customer._id);
      setSelectedCustomer(details);
    } catch (err) {
      setError(err.message || "Unable to load customer details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleStatusChange = async (customerId, isActive) => {
    try {
      setUpdatingId(customerId);

      await updateCustomerStatus(customerId, isActive);

      setCustomers(current =>
        current.map(customer =>
          customer._id === customerId
            ? { ...customer, isActive }
            : customer
        )
      );

      setSelectedCustomer(current =>
        current?._id === customerId
          ? { ...current, isActive }
          : current
      );
    } catch (err) {
      setError(err.message || "Unable to update customer status");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            Customer management
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">
            Customers
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage customer accounts and account access.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total customers"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          title="Active customers"
          value={stats.active}
          icon={UserCheck}
        />
        <StatCard
          title="Inactive customers"
          value={stats.inactive}
          icon={UserX}
        />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-stone-500"
          >
            <option value="all">All customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr className="text-xs uppercase tracking-wide text-stone-500">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Joined</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center text-sm text-stone-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : visibleCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center text-sm text-stone-500"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                visibleCustomers.map(customer => {
                  const name = getCustomerName(customer);
                  const active = customer.isActive !== false;

                  return (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-stone-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                            {getInitials(name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-stone-900">
                              {name}
                            </p>
                            <p className="mt-1 truncate text-xs text-stone-500">
                              {customer.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-stone-600">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-stone-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge active={active} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openCustomer(customer)}
                            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-stone-500">
            Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            {" - "}
            {Math.min(currentPage * PAGE_SIZE, filteredCustomers.length)}
            {" of "}
            {filteredCustomers.length} customers
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(page => page - 1)}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-xs text-stone-600">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(page => page + 1)}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          loading={loadingDetails}
          onClose={() => setSelectedCustomer(null)}
          onStatusChange={handleStatusChange}
          updating={updatingId === selectedCustomer._id}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
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
    </div>
  );
}
