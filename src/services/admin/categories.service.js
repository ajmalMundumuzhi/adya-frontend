
import adminApi from "./admin.api";

function unwrap(response) {
  const data = response?.data;

  if (data?.success === false) {
    throw new Error(data.message || "Category request failed");
  }

  return data?.data ?? data;
}

export async function getCategories(includeInactive = true) {
  const response = await adminApi.get("/categories", {
    params: {
      includeInactive
    }
  });

  const result = unwrap(response);
  return Array.isArray(result) ? result : [];
}

export async function getCategory(categoryId) {
  const response = await adminApi.get(`/categories/${categoryId}`);
  return unwrap(response);
}

export async function createCategory(payload) {
  const response = await adminApi.post("/categories", payload);
  return unwrap(response);
}

export async function updateCategory(categoryId, payload) {
  const response = await adminApi.patch(
    `/categories/${categoryId}`,
    payload
  );

  return unwrap(response);
}

export async function deleteCategory(categoryId) {
  const response = await adminApi.delete(`/categories/${categoryId}`);
  return unwrap(response);
}
