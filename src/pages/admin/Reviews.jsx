import { useEffect, useMemo, useState } from "react";
import {
  Star,
  RefreshCw,
  Check,
  X,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  UserRound,
  CalendarDays,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import {
  getAdminReviews,
  updateAdminReviewStatus,
  deleteAdminReview,
} from "../../services/admin/reviews.service";

const filters = ["All", "Pending", "Approved", "Rejected"];

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status) {
  switch (status) {
    case "Approved":
      return "bg-green-50 text-green-700 border-green-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function ReviewStars({ rating }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < Number(rating)
              ? "fill-[#B8923A] text-[#B8923A]"
              : "text-[#D8CBB5]"
          }
        />
      ))}
      <span className="ml-2 text-xs font-medium text-[#493829]/60">
        {rating}/5
      </span>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="border border-[#B49A68]/30 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#92764B]">
          {title}
        </p>
        <Icon size={20} className="text-[#92764B]" />
      </div>

      <p className="mt-4 font-display text-3xl text-[#493829]">
        {value}
      </p>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminReviews();

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const counts = useMemo(
    () => ({
      All: reviews.length,
      Pending: reviews.filter(
        (review) => review.status === "Pending"
      ).length,
      Approved: reviews.filter(
        (review) => review.status === "Approved"
      ).length,
      Rejected: reviews.filter(
        (review) => review.status === "Rejected"
      ).length,
    }),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    if (activeFilter === "All") return reviews;

    return reviews.filter(
      (review) => review.status === activeFilter
    );
  }, [reviews, activeFilter]);

  const handleStatusUpdate = async (reviewId, status) => {
    if (!reviewId || processingId) return;

    try {
      setProcessingId(reviewId);
      setActionError("");

      await updateAdminReviewStatus(reviewId, status);

      await loadReviews();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update review."
      );
    } finally {
      setProcessingId("");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!reviewId || processingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(reviewId);
      setActionError("");

      await deleteAdminReview(reviewId);

      setReviews((current) =>
        current.filter((review) => review._id !== reviewId)
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete review."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92764B]">
            Customer feedback
          </p>

          <h1 className="mt-2 font-display text-3xl text-[#493829] sm:text-4xl">
            Product Reviews
          </h1>

          <p className="mt-2 text-sm text-[#493829]/60">
            Manage, review and moderate customer feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={counts.All}
          icon={MessageSquare}
        />

        <StatCard
          title="Pending"
          value={counts.Pending}
          icon={AlertCircle}
        />

        <StatCard
          title="Approved"
          value={counts.Approved}
          icon={Check}
        />

        <StatCard
          title="Rejected"
          value={counts.Rejected}
          icon={X}
        />
      </section>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadReviews}
            className="mt-2 text-sm font-semibold text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 border border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}

      <section className="border border-[#B49A68]/30 bg-white">
        <div className="border-b border-[#eee8df] p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium transition ${
                  activeFilter === filter
                    ? "border-[#5b302e] bg-[#5b302e] text-white"
                    : "border-[#e8dfd3] bg-white text-[#715d50] hover:bg-[#f5f0e9]"
                }`}
              >
                {filter}
                <span
                  className={`text-[10px] ${
                    activeFilter === filter
                      ? "text-white/75"
                      : "text-[#927e6e]"
                  }`}
                >
                  {counts[filter]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-20 text-center text-sm text-[#927e6e]">
            <RefreshCw
              size={22}
              className="mx-auto mb-3 animate-spin"
            />
            Loading customer reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <MessageSquare
              size={30}
              className="mx-auto text-[#B49A68]"
            />

            <h3 className="mt-4 font-display text-2xl text-[#493829]">
              No reviews found
            </h3>

            <p className="mt-2 text-sm text-[#493829]/60">
              {activeFilter === "All"
                ? "Customer reviews will appear here when submitted."
                : `There are no ${activeFilter.toLowerCase()} reviews.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eee8df]">
            {filteredReviews.map((review) => {
              const customer = review.customerId || {};
              const product = review.productId || {};
              const order = review.orderId || {};
              const images = Array.isArray(review.images)
                ? review.images
                : [];
              const busy = processingId === review._id;

              return (
                <article
                  key={review._id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                            review.status
                          )}`}
                        >
                          {review.status || "Pending"}
                        </span>

                        <span className="text-xs text-[#927e6e]">
                          <CalendarDays
                            size={13}
                            className="inline mr-1"
                          />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-2xl text-[#493829]">
                        {product.name || "Product"}
                      </h2>

                      <div className="mt-2">
                        <ReviewStars rating={review.rating} />
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#493829]/80">
                        {review.text}
                      </p>
                    </div>

                    <div className="w-full shrink-0 border border-[#eee8df] bg-[#fffdf9] p-4 lg:w-64">
                      <div className="flex items-center gap-2 text-[#92764B]">
                        <UserRound size={16} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          Customer
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-[#493829]">
                        {customer.name || review.name || "Customer"}
                      </p>

                      {customer.email && (
                        <p className="mt-1 break-all text-xs text-[#927e6e]">
                          {customer.email}
                        </p>
                      )}

                      <div className="mt-4 border-t border-[#eee8df] pt-3">
                        <div className="flex items-center gap-2 text-[#92764B]">
                          <ShoppingBag size={15} />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                            Order
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-[#493829]">
                          {order.orderNumber || "Order information unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-5 border-t border-[#eee8df] pt-4">
                      <div className="mb-3 flex items-center gap-2 text-[#92764B]">
                        <ImageIcon size={15} />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                          Customer photos ({images.length})
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {images.map((image, index) =>
                          image?.url ? (
                            <a
                              key={
                                image._id ||
                                image.publicId ||
                                image.url ||
                                index
                              }
                              href={image.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block h-24 w-24 overflow-hidden border border-[#B49A68]/30 bg-[#F0E8DC]"
                            >
                              <img
                                src={image.url}
                                alt={`Customer review photo ${index + 1}`}
                                loading="lazy"
                                className="object-cover w-full h-full transition-transform hover:scale-105"
                              />
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-[#eee8df] pt-4">
                    {review.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(review._id, "Approved")
                        }
                        disabled={busy || Boolean(processingId)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#496A43] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#3d5938] disabled:opacity-50"
                      >
                        <Check size={15} />
                        Approve
                      </button>
                    )}

                    {review.status !== "Rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(review._id, "Rejected")
                        }
                        disabled={busy || Boolean(processingId)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#C77B73]/40 bg-white px-4 py-2 text-xs font-medium text-[#98443E] transition hover:bg-[#F6E8E5] disabled:opacity-50"
                      >
                        <X size={15} />
                        Reject
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(review._id)}
                      disabled={busy || Boolean(processingId)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#e4d6d2] bg-white px-4 py-2 text-xs font-medium text-[#98443E] transition hover:bg-[#F6E8E5] disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>

                  {busy && (
                    <p className="mt-3 text-right text-xs text-[#927e6e]">
                      Updating review...
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}