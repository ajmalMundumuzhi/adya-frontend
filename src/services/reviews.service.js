import api from "./api";

function getError(error, fallback) {
  return new Error(
    error.response?.data?.message ||
      error.message ||
      fallback
  );
}

export async function getProductReviews(productId) {
  try {
    const response = await api.get("/reviews", {
      params: { productId },
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Unable to load reviews."
      );
    }

    return Array.isArray(response.data.data)
      ? response.data.data
      : [];
  } catch (error) {
    throw getError(error, "Unable to load reviews.");
  }
}

export async function submitProductReview({
  productId,
  rating,
  text,
  images = [],
}) {
  try {
    const formData = new FormData();

    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("text", text.trim());

    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post("/reviews", formData);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Unable to submit review."
      );
    }

    return response.data;
  } catch (error) {
    throw getError(error, "Unable to submit review.");
  }
}