import adminApi from "./admin.api";

function unwrap(response) {
  const body = response?.data;

  if (body?.success === false) {
    throw new Error(body.message || "Inventory request failed");
  }

  return body?.data ?? body;
}

export async function getInventoryProducts() {
  const response = await adminApi.get("/products", {
    params: { page: 1, limit: 100 },
  });

  const result = unwrap(response);
  const products = Array.isArray(result)
    ? result
    : result?.products || [];

  const pages = Number(result?.pages || 1);

  if (pages <= 1) return products;

  const responses = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      adminApi.get("/products", {
        params: { page: index + 2, limit: 100 },
      })
    )
  );

  return products.concat(
    ...responses.map((item) => {
      const data = unwrap(item);
      return Array.isArray(data) ? data : data?.products || [];
    })
  );
}

export async function adjustInventoryStock({
  variantId,
  sizeOptionId,
  action,
  quantity,
  reason,
}) {
  const response = await adminApi.patch(
    `/inventory/${variantId}/${sizeOptionId}/adjust`,
    {
      action,
      quantity,
      reason,
    }
  );

  return unwrap(response);
}

export async function getInventoryHistory(params = {}) {
  const response = await adminApi.get("/inventory/history", {
    params,
  });

  const data = unwrap(response);

  return {
    logs: data?.logs || [],
    page: data?.page || 1,
    limit: data?.limit || 20,
    total: data?.total || 0,
    pages: data?.pages || 0,
  };
}