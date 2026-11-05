
import api from "./api";

function formatStorefrontProduct(product) {
  if (!product || product.isActive !== true) {
    return null;
  }

  const activeVariants = (product.variants || []).filter(
    (variant) =>
      variant.isActive !== false &&
      Array.isArray(variant.sizes)
  );

  const availableSizes = activeVariants.flatMap((variant) =>
    (variant.sizes || [])
      .filter(
        (size) =>
          size.isActive !== false &&
          Number.isFinite(Number(size.price))
      )
      .map((size) => ({
        ...size,
        variantId: variant._id,
      }))
  );

  const lowestPricedSize = availableSizes.reduce((lowest, size) => {
    if (!lowest || Number(size.price) < Number(lowest.price)) {
      return size;
    }

    return lowest;
  }, null);

  const activeVariantsWithImages = activeVariants.filter(
    (variant) =>
      Array.isArray(variant.images) &&
      variant.images.some(
        (image) => typeof image === "string" && image.trim()
      )
  );

  const images = activeVariantsWithImages.flatMap((variant) =>
    variant.images.filter(
      (image) => typeof image === "string" && image.trim()
    )
  );

  const stock = availableSizes.reduce(
    (total, size) => total + Math.max(0, Number(size.stock) || 0),
    0
  );

  if (!lowestPricedSize || images.length === 0) {
    return null;
  }

  return {
    ...product,
    id: product._id,
    price: Number(lowestPricedSize.price),
    compareAtPrice:
      lowestPricedSize.compareAtPrice != null
        ? Number(lowestPricedSize.compareAtPrice)
        : null,
    imagePath: images[0],
    images,
    stock,
    variants: activeVariants,
    to: `/product/${product.slug || product._id}`,
  };
}

function formatProductList(products = []) {
  return products
    .map(formatStorefrontProduct)
    .filter(Boolean);
}

export async function getProducts(params = {}) {
  const response = await api.get("/products", {
    params: {
      ...params,
      isActive: true,
    },
  });

  return formatProductList(response.data.products || []);
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data.product;
}

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data ?? [];
}

export async function getOffers() {
  const response = await api.get("/offers");
  return response.data;
}

export async function getProductsPage(params = {}) {
  const response = await api.get("/products", {
    params: {
      ...params,
      isActive: true,
    },
  });

  const pagination = response.data.pagination || {};

  const products = formatProductList(response.data.products || []);

  return {
    ...response.data,
    products,
    total: pagination.total ?? products.length,
    pages: pagination.totalPages ?? 1,
  };
}
