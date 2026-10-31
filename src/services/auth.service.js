
import api from "./api";

const TOKEN_KEY = "adya-customer-token";
const USER_KEY = "adya-customer-user";

function saveSession(data) {
  if (!data.token || !data.user) {
    throw new Error("Authentication response is incomplete");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  window.dispatchEvent(new Event("adya-auth-change"));

  return data.user;
}

export function logoutCustomer() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("adya-auth-change"));
}

export async function loginCustomer(credentials) {
  const response = await api.post("/users/login", credentials);
  return saveSession(response.data);
}

export async function registerCustomer(data) {
  const response = await api.post("/users/register", data);
  return saveSession(response.data);
}

export function getCurrentCustomer() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function getCustomerToken() {
  return localStorage.getItem(TOKEN_KEY);
}
