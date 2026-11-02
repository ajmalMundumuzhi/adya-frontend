
import adminApi from "./admin.api";

function getError(error, fallback) {
  return new Error(
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function getOrders() {
  try {
    const response = await adminApi.get("/orders");

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load orders");
    }

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    throw getError(error, "Unable to load orders");
  }
}

export async function getOrderById(id) {
  try {
    const response = await adminApi.get(`/orders/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load order");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to load order");
  }
}

export async function updateOrder(id, payload) {
  try {
    const response = await adminApi.patch(`/orders/${id}`, payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to update order");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to update order");
  }
}
