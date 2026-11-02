
import adminApi from "./admin.api";

function unwrap(response) {
  const data = response?.data;

  if (data?.success === false) {
    throw new Error(data.message || "Customer request failed");
  }

  return data?.data ?? data;
}

export async function getCustomers() {
  const response = await adminApi.get("/users");
  const result = unwrap(response);

  return Array.isArray(result) ? result : [];
}

export async function getCustomerById(customerId) {
  if (!customerId) throw new Error("Customer ID is required");

  const response = await adminApi.get(`/users/${customerId}`);
  return unwrap(response);
}

export async function updateCustomerStatus(customerId, isActive) {
  if (!customerId) throw new Error("Customer ID is required");

  const response = await adminApi.patch(`/users/${customerId}/status`, {
    isActive
  });

  return unwrap(response);
}
