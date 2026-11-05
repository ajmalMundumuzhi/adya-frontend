import adminApi from "./admin.api";

function unwrap(response) {
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Shipping request failed");
  }

  return response.data.data;
}

export async function getShippingCountries() {
  const response = await adminApi.get("/shipping");
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.countries || [];
}

export async function createShippingCountry(payload) {
  return unwrap(await adminApi.post("/shipping", payload));
}

export async function updateShippingCountry(id, payload) {
  return unwrap(await adminApi.patch(`/shipping/${id}`, payload));
}

export async function deleteShippingCountry(id) {
  return unwrap(await adminApi.delete(`/shipping/${id}`));
}