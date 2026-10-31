import api from "./api";

function unwrapCart(response) {
  const data = response?.data;

  if (data?.success === false) {
    throw new Error(data.message || "Cart request failed");
  }

  return data?.data ?? data?.cart ?? data;
}

export async function getCart() {
  const response = await api.get("/cart");
  return unwrapCart(response);
}

export async function addCartItem(payload) {
  const response = await api.post("/cart/items", payload);
  return unwrapCart(response);
}

export async function updateCartItem(itemId, quantity) {
  const response = await api.patch(`/cart/items/${itemId}`, {
    quantity,
  });

  return unwrapCart(response);
}

export async function removeCartItem(itemId) {
  const response = await api.delete(`/cart/items/${itemId}`);
  return unwrapCart(response);
}

export async function clearCustomerCart() {
  const response = await api.delete("/cart");
  return unwrapCart(response);
}