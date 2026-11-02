import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Folder,
  FolderOpen,
  RefreshCw,
  X,
  Save,
  Layers3,
  CheckCircle2,
  CircleSlash,
  Tag
} from "lucide-react";

import {
  getCategories,
  updateCategory,
  deleteCategory
} from "../../services/admin/categories.service";

import CreateCategoryModal from "../../components/admin/categories/CreateCategoryModal";

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-500";

function getParentId(category) {
  return category?.parentId?._id || category?.parentId || null;
}

function EditCategoryModal({ category, categories, onClose, onUpdated }) {
  const [name, setName] = useState(category.name || "");
  const [slug, setSlug] = useState(category.slug || "");
  const [imageUrl, setImageUrl] = useState(category.imageUrl || "");
  const [parentId, setParentId] = useState(getParentId(category) || "");
  const [isActive, setIsActive] = useState(category.isActive !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableParents = categories.filter(
    (item) => item._id !== category._id
  );

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (parentId === category._id) {
      setError("A category cannot be its own parent.");
      return;
    }

    setLoading(true);

    try {
      await updateCategory(category._id, {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        imageUrl: imageUrl.trim(),
        parentId: parentId || null,
        isActive
      });

      await onUpdated();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to update category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              Edit Category
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Update category information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-medium text-stone-700">
            Category name *
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Slug
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="Automatically generated if empty"
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Image URL
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Parent category
            <select
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
              className={`${inputClass} mt-2`}
            >
              <option value="">Main category</option>
              {availableParents.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 accent-stone-900"
            />
            Active category
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <div className="rounded-xl bg-stone-100 p-2.5 text-stone-600">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{description}</p>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories(false);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categoryMap = useMemo(() => {
    const map = new Map();

    categories.forEach((category) => {
      map.set(category._id, {
        ...category,
        children: []
      });
    });

    categories.forEach((category) => {
      const parentId = getParentId(category);

      if (parentId && map.has(parentId)) {
        map.get(parentId).children.push(map.get(category._id));
      }
    });

    return map;
  }, [categories]);

  const categoryTree = useMemo(
    () =>
      categories
        .filter((category) => !getParentId(category))
        .map((category) => categoryMap.get(category._id))
        .filter(Boolean),
    [categories, categoryMap]
  );

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name?.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive !== false) ||
        (statusFilter === "inactive" && category.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const filteredIds = useMemo(
    () => new Set(filteredCategories.map((category) => category._id)),
    [filteredCategories]
  );

  const totalCategories = categories.length;
  const mainCategories = categories.filter(
    (category) => !getParentId(category)
  ).length;
  const activeCategories = categories.filter(
    (category) => category.isActive !== false
  ).length;
  const inactiveCategories = totalCategories - activeCategories;

  const toggleExpanded = (id) => {
    setExpandedCategories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleDelete = async (category) => {
    const hasChildren = categories.some(
      (item) => getParentId(item) === category._id && item.isActive !== false
    );

    if (hasChildren) {
      window.alert(
        "This category has active subcategories. Remove or deactivate those first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This operation permanently deletes the category.`
    );

    if (!confirmed) return;

    setDeletingId(category._id);

    try {
      await deleteCategory(category._id);
      await loadCategories();
    } catch (err) {
      window.alert(
        err?.response?.data?.message ||
          err.message ||
          "Unable to delete category."
      );
    } finally {
      setDeletingId("");
    }
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children?.length > 0;
    const isExpanded = expandedCategories.includes(category._id);
    const isVisible = filteredIds.has(category._id);

    if (!isVisible && !hasChildren) return null;

    const visibleChildren = category.children?.filter(
      (child) =>
        filteredIds.has(child._id) ||
        child.children?.some((nested) => filteredIds.has(nested._id))
    );

    if (!isVisible && visibleChildren?.length === 0) return null;

    return (
      <div key={category._id}>
        {isVisible && (
          <div
            className="grid grid-cols-[minmax(0,1fr)_100px_110px] items-center gap-3 border-b border-stone-100 px-4 py-4 transition hover:bg-stone-50 sm:grid-cols-[minmax(0,1fr)_130px_120px_120px]"
          >
            <div
              className="flex min-w-0 items-center gap-3"
              style={{ paddingLeft: `${level * 22}px` }}
            >
              <button
                type="button"
                onClick={() => toggleExpanded(category._id)}
                disabled={!hasChildren}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 disabled:opacity-30"
                aria-label={
                  isExpanded ? "Collapse category" : "Expand category"
                }
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                )}
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                {hasChildren ? (
                  <FolderOpen size={19} />
                ) : (
                  <Folder size={19} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-800">
                  {category.name}
                </p>
                <p className="mt-1 truncate text-xs text-stone-400">
                  {category.slug || "No slug"}
                </p>
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600">
                {level === 0 ? "Main category" : "Subcategory"}
              </span>
            </div>

            <div>
              {category.isActive !== false ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-500">
                  <CircleSlash size={13} />
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setEditingCategory(category)}
                title="Edit category"
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(category)}
                disabled={deletingId === category._id}
                title="Delete category"
                className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}

        {hasChildren && (isExpanded || search.trim()) && (
          <div>
            {visibleChildren?.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-6 bg-stone-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Catalogue management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Organise your products into main categories and subcategories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Plus size={17} />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total categories"
          value={totalCategories}
          icon={Layers3}
          description="All categories and subcategories"
        />

        <StatCard
          title="Main categories"
          value={mainCategories}
          icon={FolderOpen}
          description="Top-level categories"
        />

        <StatCard
          title="Active categories"
          value={activeCategories}
          icon={CheckCircle2}
          description="Available categories"
        />

        <StatCard
          title="Inactive categories"
          value={inactiveCategories}
          icon={CircleSlash}
          description="Currently disabled"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-semibold text-stone-900">
              Category directory
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Expand main categories to view their subcategories.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-stone-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_100px_110px] gap-3 bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 sm:grid-cols-[minmax(0,1fr)_130px_120px_120px]">
          <span>Category</span>
          <span className="hidden sm:block">Type</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-stone-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={loadCategories}
              className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-2xl bg-stone-100 p-4 text-stone-500">
              <Tag size={25} />
            </div>
            <h3 className="mt-4 font-semibold text-stone-800">
              No categories found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-stone-500">
              Try another search or create a new category.
            </p>
          </div>
        ) : (
          <div>
            {categoryTree.map((category) =>
              renderCategory(category)
            )}
          </div>
        )}

        <div className="border-t border-stone-100 px-4 py-3 text-xs text-stone-500">
          Showing {filteredCategories.length} of {totalCategories} categories
        </div>
      </section>

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadCategories}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          categories={categories}
          onClose={() => setEditingCategory(null)}
          onUpdated={loadCategories}
        />
      )}
    </div>
  );
}