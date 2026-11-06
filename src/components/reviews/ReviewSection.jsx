import { useCallback, useEffect, useState } from "react";
import { Star, MessageSquare, LoaderCircle } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { getProductReviews } from "../../services/reviews.service";

function getCustomerName(review) {
  if (review.customerId && typeof review.customerId === "object") {
    return review.customerId.name || review.name || "Customer";
  }

  return review.name || "Customer";
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setError("");

      const data = await getProductReviews(productId);

      setReviews(
        data.filter((review) => review.status === "Approved")
      );
    } catch (requestError) {
      setError(
        requestError.message || "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    loadReviews();
  }, [loadReviews]);

  const totalReviews = reviews.length;

  const averageRating = totalReviews
    ? reviews.reduce(
        (total, review) => total + Number(review.rating || 0),
        0
      ) / totalReviews
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter(
      (review) => Number(review.rating) === rating
    ).length,
  }));

  return (
    <section
      id="product-reviews"
      className="mt-14 scroll-mt-24 border-t border-[#E7DED2] pt-10 sm:mt-16 sm:pt-12"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A77B27]">
            Customer experiences
          </p>

          <h2 className="mt-2 font-serif text-3xl text-[#38261F]">
            Customer Reviews
          </h2>

          <p className="mt-2 text-sm text-[#82776E]">
            Real experiences shared by our customers.
          </p>
        </div>

        <span className="text-xs text-[#82776E]">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-[#82776E]">
          <LoaderCircle size={19} className="animate-spin" />
          Loading customer reviews...
        </div>
      ) : (
        <>
          <div className="mt-7 grid gap-6 rounded-lg border border-[#E9E0D5] bg-white p-5 sm:grid-cols-[180px_1fr] sm:p-7">
            <div className="flex flex-col items-center justify-center border-b border-[#EEE7DE] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
              <span className="font-serif text-5xl text-[#4B2927]">
                {averageRating.toFixed(1)}
              </span>

              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className={
                      star <= Math.round(averageRating)
                        ? "fill-[#B68B2E] text-[#B68B2E]"
                        : "text-[#D8CFC4]"
                    }
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-[#82776E]">
                Based on {totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {ratingCounts.map(({ rating, count }) => (
                <div
                  key={rating}
                  className="grid grid-cols-[34px_1fr_30px] items-center gap-3"
                >
                  <span className="flex items-center gap-1 text-xs text-[#67594E]">
                    {rating}
                    <Star
                      size={12}
                      className="fill-[#B68B2E] text-[#B68B2E]"
                    />
                  </span>

                  <div className="h-2 overflow-hidden rounded-full bg-[#EEE8DF]">
                    <div
                      className="h-full rounded-full bg-[#B68B2E] transition-all"
                      style={{
                        width: `${
                          totalReviews
                            ? (count / totalReviews) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-xs text-[#82776E]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-[#FBEFED] p-4 text-sm text-[#A13A35]"
            >
              {error}
            </p>
          )}

          <div className="mt-8">
            {totalReviews > 0 ? (
              <div className="divide-y divide-[#E9E0D5]">
                {reviews.map((review) => (
                  <article
                    key={review._id}
                    className="py-6 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#4B2927]">
                          {getCustomerName(review)}
                        </h3>

                        <p className="mt-1 text-[11px] text-[#93877D]">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>

                      <div
                        className="flex gap-1"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= Number(review.rating)
                                ? "fill-[#B68B2E] text-[#B68B2E]"
                                : "text-[#D8CFC4]"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {review.text && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#71645A]">
                        {review.text}
                      </p>
                    )}

                    {Array.isArray(review.images) &&
                      review.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {review.images.map((image, index) =>
                            image?.url ? (
                              <a
                                key={image._id || image.publicId || index}
                                href={image.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block h-20 w-20 overflow-hidden rounded border border-[#E9E0D5] sm:h-24 sm:w-24"
                              >
                                <img
                                  src={image.url}
                                  alt={`Customer review photo ${index + 1}`}
                                  loading="lazy"
                                  className="object-cover w-full h-full transition duration-300 hover:scale-105"
                                />
                              </a>
                            ) : null
                          )}
                        </div>
                      )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-lg border border-dashed border-[#D9CFC2] bg-white/60 px-5 py-12 text-center">
                <MessageSquare
                  size={28}
                  strokeWidth={1.3}
                  className="text-[#B68B2E]"
                />

                <h3 className="mt-4 font-serif text-xl text-[#4B2927]">
                  No reviews yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#82776E]">
                  Be the first to share your experience with this product.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-10 border-t border-[#E9E0D5] pt-8">
        <ReviewForm
          productId={productId}
          onSubmitted={loadReviews}
        />
      </div>
    </section>
  );
}