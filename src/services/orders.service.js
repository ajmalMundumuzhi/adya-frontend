
import api from "./api";

export async function getMyOrders() {
  const response = await api.get("/orders/mine");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to load your orders"
    );
  }

  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
}

export async function getMyOrderById(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const response = await api.get(`/orders/mine/${orderId}`);

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to load order details"
    );
  }

  return response.data.data;
}
