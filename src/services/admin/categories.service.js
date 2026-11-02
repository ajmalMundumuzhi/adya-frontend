
import adminApi from "./admin.api";

function getError(error, fallback) {
  return new Error(
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function getCategories(includeInactive = false) {
  try {
    const response = await adminApi.get("/categories", {
      params: includeInactive ? { includeInactive: true } : {}
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load categories");
    }

    return response.data.data || [];
  } catch (error) {
    throw getError(error, "Unable to load categories");
  }
}

export async function getCategoryById(id) {
  try {
    const response = await adminApi.get(`/categories/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load category");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to load category");
  }
}

export async function createCategory(payload) {
  try {
    const response = await adminApi.post("/categories", payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to create category");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to create category");
  }
}

export async function updateCategory(id, payload) {
  try {
    const response = await adminApi.patch(`/categories/${id}`, payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to update category");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to update category");
  }
}

export async function deleteCategory(id) {
  try {
    const response = await adminApi.delete(`/categories/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to delete category");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to delete category");
  }
}
