
import api from "./api";

export async function getPublicCategories() {
  const response = await api.get("/categories", {
    params: {
      includeInactive: false
    }
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Unable to load categories"
    );
  }

  return Array.isArray(response.data.data)
    ? response.data.data.filter((category) => category.isActive)
    : [];
}

export function buildCategoryTree(categories) {
  const categoryMap = new Map();

  categories.forEach((category) => {
    categoryMap.set(String(category._id), {
      ...category,
      children: []
    });
  });

  const roots = [];

  categoryMap.forEach((category) => {
    const parentId = category.parentId?._id || category.parentId;

    if (parentId && categoryMap.has(String(parentId))) {
      categoryMap.get(String(parentId)).children.push(category);
    } else if (!parentId) {
      roots.push(category);
    }
  });

  const sortCategories = (items) => {
    items.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    items.forEach((item) => {
      sortCategories(item.children);
    });
  };

  sortCategories(roots);

  return roots;
}