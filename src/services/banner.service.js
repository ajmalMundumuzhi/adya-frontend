
import api from "./api";

export async function getActiveBanners() {
  const response = await api.get("/banners");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to load homepage banners"
    );
  }

  return response.data.data || [];
}
