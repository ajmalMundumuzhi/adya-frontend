
import api from "./api";

export async function getWishlist() {
  const response = await api.get("/wishlist");
  const data = response.data;

  return data.data ?? data.wishlist ?? data.items ?? data;
}

export async function addWishlistItem(payload) {
  const response = await api.post("/wishlist", payload);
  const data = response.data;

  return data.data ?? data.wishlist ?? data.item ?? data;
}

export async function removeWishlistItem(id) {
  const response = await api.delete(`/wishlist/${id}`);
  return response.data;
}