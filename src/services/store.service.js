import api from "./api";

export async function getProducts(params = {}) {
  const response = await api.get("/products", { params });
  return response.data.products ?? [];
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data.product;
}

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data ?? [];
}

export async function getOffers() {
  const response = await api.get("/offers");
  return response.data;
}

export async function getProductsPage(params = {}) {
  const response = await api.get("/products", { params });
  return response.data;
}