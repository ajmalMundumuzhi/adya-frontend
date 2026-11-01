
import adminApi from "./admin.api";

const TOKEN_KEY = "adya-admin-token";
const USER_KEY = "adya-admin-user";

export async function adminLogin(credentials) {
  const response = await adminApi.post("/auth/login", credentials);
  const data = response.data;

  if (!data?.success || !data?.token || !data?.admin) {
    throw new Error(
      data?.message || "Invalid admin authentication response"
    );
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.admin));

  window.dispatchEvent(new Event("adya-admin-auth-change"));

  return data.admin;
}

export function getAdminUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken() && getAdminUser());
}

export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("adya-admin-auth-change"));
}
