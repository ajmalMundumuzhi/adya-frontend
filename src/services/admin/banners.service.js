
import adminApi from "./admin.api";

function getError(error, fallback) {
  return new Error(
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function getBanners() {
  try {
    const response = await adminApi.get("/banners/admin");

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load banners");
    }

    return response.data.data || [];
  } catch (error) {
    throw getError(error, "Unable to load banners");
  }
}

export async function getBannerById(id) {
  try {
    const response = await adminApi.get(`/banners/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load banner");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to load banner");
  }
}

export async function createBanner(payload) {
  try {
    const response = await adminApi.post("/banners", payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to create banner");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to create banner");
  }
}

export async function updateBanner(id, payload) {
  try {
    const response = await adminApi.patch(`/banners/${id}`, payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to update banner");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to update banner");
  }
}

export async function deactivateBanner(id) {
  try {
    const response = await adminApi.delete(`/banners/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to deactivate banner");
    }

    return response.data.data;
  } catch (error) {
    throw getError(error, "Unable to deactivate banner");
  }
}

export async function uploadBannerImages(files) {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await adminApi.post(
      "/banners/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Image upload failed");
    }

    return response.data.images || [];
  } catch (error) {
    throw getError(error, "Unable to upload banner images");
  }
}
