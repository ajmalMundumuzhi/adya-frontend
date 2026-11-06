import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Star, X } from "lucide-react";
import { getCustomerToken } from "../../services/auth.service";
import { submitProductReview } from "../../services/reviews.service";

export default function ReviewForm({ productId, onSubmitted }) {
  const fileInputRef = useRef(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isLoggedIn = Boolean(getCustomerToken());

  const imagePreviews = images.map((image) => ({
    file: image,
    url: URL.createObjectURL(image),
  }));

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  function handleImageSelection(event) {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = 5 - images.length;

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    if (selectedFiles.length > remainingSlots) {
      setError("You can upload a maximum of 5 images.");
    } else if (validFiles.length !== selectedFiles.length) {
      setError("Only images up to 5 MB each are allowed.");
    } else {
      setError("");
    }

    setImages((current) => [
      ...current,
      ...validFiles.slice(0, remainingSlots),
    ]);

    event.target.value = "";
  }

  function removeImage(index) {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isLoggedIn) {
      setError("Please log in to submit a review.");
      return;
    }

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    if (!text.trim()) {
      setError("Please write your review.");
      return;
    }

    setLoading(true);

    try {
      await submitProductReview({
        productId,
        rating,
        text,
        images,
      });

      setSuccess(true);
      setRating(0);
      setText("");
      setImages([]);

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (requestError) {
      setError(
        requestError.message || "Unable to submit your review."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-lg border border-[#E9E0D5] bg-white p-5">
        <h3 className="font-serif text-xl text-[#4B2927]">
          Write a review
        </h3>

        <p className="mt-2 text-sm text-[#82776E]">
          Please log in to share your experience with this product.
        </p>

        <Link
          to="/login"
          className="mt-4 inline-flex bg-[#792431] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#5E1B26]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div
        role="status"
        className="rounded-lg border border-[#D9E7D8] bg-[#F4F8F1] p-5"
      >
        <h3 className="font-serif text-xl text-[#416B45]">
          Thank you for your review!
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#61765D]">
          Your review has been submitted successfully and is waiting
          for admin approval. It will appear publicly after approval.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#E9E0D5] bg-white p-5 sm:p-6"
    >
      <h3 className="font-serif text-xl text-[#4B2927]">
        Write a review
      </h3>

      <p className="mt-1 text-sm text-[#82776E]">
        Share your experience with this product.
      </p>

      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#67594E]">
          Your rating
        </label>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} out of 5 stars`}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className="p-1 transition rounded hover:scale-110"
            >
              <Star
                size={25}
                strokeWidth={1.5}
                className={
                  value <= (hoverRating || rating)
                    ? "fill-[#B68B2E] text-[#B68B2E]"
                    : "text-[#CFC5B9]"
                }
              />
            </button>
          ))}

          <span className="ml-2 text-xs text-[#82776E]">
            {rating ? `${rating}/5` : "Select a rating"}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="review-text"
          className="text-xs font-semibold uppercase tracking-wider text-[#67594E]"
        >
          Your review
        </label>

        <textarea
          id="review-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Tell us what you liked about this product..."
          className="mt-2 w-full resize-y border border-[#DED4C8] bg-[#FFFEFC] p-3 text-sm text-[#4B2927] outline-none transition placeholder:text-[#A99D91] focus:border-[#A77B27]"
        />

        <p className="mt-1 text-right text-[11px] text-[#A09488]">
          {text.length}/2000
        </p>
      </div>

      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#67594E]">
          Product photos
        </label>

        <div className="flex flex-wrap gap-3 mt-3">
          {imagePreviews.map((image, index) => (
            <div
              key={`${image.file.name}-${index}`}
              className="relative h-20 w-20 overflow-hidden rounded border border-[#E9E0D5]"
            >
              <img
                src={image.url}
                alt={`Review upload ${index + 1}`}
                className="object-cover w-full h-full"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#792431] shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 border border-dashed border-[#CDBEAC] bg-[#FAF8F3] text-[#927E6E] transition hover:border-[#A77B27] hover:text-[#792431]"
            >
              <ImagePlus size={21} strokeWidth={1.5} />
              <span className="text-[10px]">Add photos</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelection}
          className="hidden"
        />

        <p className="mt-2 text-[11px] text-[#93877D]">
          Maximum 5 images, 5 MB per image.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded bg-[#FBEFED] px-3 py-2 text-xs text-[#A13A35]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex min-h-11 w-full items-center justify-center bg-[#792431] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5E1B26] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}