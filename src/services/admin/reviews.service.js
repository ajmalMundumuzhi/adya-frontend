import adminApi from "./admin.api";

export async function getAdminReviews() {
  const response = await adminApi.get("/reviews/admin");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to load reviews."
    );
  }

  return response.data.data;
}

export async function updateAdminReviewStatus(id, status) {
  const response = await adminApi.patch(`/reviews/admin/${id}`, {
    status,
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to update review."
    );
  }

  return response.data.data;
}

export async function deleteAdminReview(id) {
  const response = await adminApi.delete(`/reviews/admin/${id}`);

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to delete review."
    );
  }

  return response.data;
}