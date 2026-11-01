
import adminApi from "./admin.api";

function getError(error, fallback) {
  return new Error(
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function getProducts(params = {}) {
  try {
    const response = await adminApi.get("/products", { params });
    const data = response.data;

    if (!data?.success) {
      throw new Error(data?.message || "Unable to load products");
    }

    return {
      products: data.products || [],
      page: data.page || 1,
      limit: data.limit || 12,
      total: data.total || 0,
      pages: data.pages || 0
    };
  } catch (error) {
    throw getError(error, "Unable to load products");
  }
}

export async function getProductById(id) {
  try {
    const response = await adminApi.get(`/products/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load product");
    }

    return response.data.product;
  } catch (error) {
    throw getError(error, "Unable to load product");
  }
}

export async function createProduct(payload) {
  try {
    const response = await adminApi.post("/products", payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to create product");
    }

    return response.data.product;
  } catch (error) {
    throw getError(error, "Unable to create product");
  }
}

export async function updateProduct(id, payload) {
  try {
    const response = await adminApi.patch(`/products/${id}`, payload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to update product");
    }

    return response.data.product;
  } catch (error) {
    throw getError(error, "Unable to update product");
  }
}

export async function deactivateProduct(id) {
  try {
    const response = await adminApi.delete(`/products/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to deactivate product");
    }

    return response.data.product;
  } catch (error) {
    throw getError(error, "Unable to deactivate product");
  }
}

export async function uploadProductImages(files) {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await adminApi.post(
      "/products/upload-image",
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
    throw getError(error, "Unable to upload product images");
  }
}
