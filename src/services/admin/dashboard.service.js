
import adminApi from "./admin.api";

export async function getDashboardStats() {
  const response = await adminApi.get("/analytics/dashboard");

  if (response.data?.success === false) {
    throw new Error(
      response.data.message || "Unable to fetch dashboard statistics"
    );
  }

  return response.data?.data ?? response.data;
}
