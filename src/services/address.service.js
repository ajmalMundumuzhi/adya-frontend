import api from "./api";

function unwrapAddressResponse(response) {
  const data = response?.data;

  if (data?.success === false) {
    throw new Error(data.message || "Address request failed");
  }

  return data?.data ?? data?.addresses ?? data;
}

export async function getAddresses() {
  const response = await api.get("/addresses");
  const result = unwrapAddressResponse(response);

  return Array.isArray(result) ? result : [];
}

export async function createAddress(payload) {
  const response = await api.post("/addresses", payload);
  return unwrapAddressResponse(response);
}

export async function updateAddress(addressId, payload) {
  const response = await api.put(`/addresses/${addressId}`, payload);
  return unwrapAddressResponse(response);
}

export async function deleteAddress(addressId) {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data;
}

export async function setDefaultAddress(addressId) {
  const response = await api.patch(`/addresses/${addressId}/default`);
  return unwrapAddressResponse(response);
}