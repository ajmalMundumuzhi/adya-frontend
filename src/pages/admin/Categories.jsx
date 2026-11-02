
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tags,
  X,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../services/admin/categories.service";

const emptyForm = {
  name: "",
  slug: "",
  parentId: "",
  imageUrl: ""
};

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [form, setForm] = useState(emptyForm);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Unable to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categoryTree = useMemo(() => {
    const parents = categories.filter(
      (category) => !category.parentId
    );

    return parents.map((parent) => ({
      ...parent,
      children: categories.filter(
        (category) =>
          String(category.parentId?._id || category.parentId) ===
          String(parent._id)
      )
    }));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categoryTree;

    return categoryTree
      .map((parent) => {
        const parentMatches = parent.name.toLowerCase().includes(term);

        const children = parent.children.filter((child) =>
          child.name.toLowerCase().includes(term)
        );

        if (parentMatches || children.length) {
          return {
            ...parent,
            children: parentMatches ? parent.children : children
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [categoryTree, search]);

  function openCreate(parentId = "") {
    setEditingId(null);
    setForm({ ...emptyForm, parentId });
    setError("");
    setModalOpen(true);
  }

  function openEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      parentId: category.parentId?._id || category.parentId || "",
      imageUrl: category.imageUrl || ""
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }

    if (editingId && form.parentId === editingId) {
      setError("A category cannot be its own parent");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || makeSlug(form.name),
      parentId: form.parentId || null,
      imageUrl: form.imageUrl.trim(),
      isActive: true
    };

    setSaving(true);

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      closeModal();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteCategory(category._id);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to delete category");
    }
  }

  function toggleExpanded(id) {
    setExpanded((current) => ({
      ...current,
      [id]: !current[id]
    }));
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 text-sm text-[#4b2927] outline-none focus:border-[#8b6257]";

  const labelClass = "text-sm font-medium text-[#624b40]";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
            Store management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#4b2927]">
            Categories
          </h1>
          <p className="mt-1 text-sm text-[#927e6e]">
            Organise your products into categories and subcategories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b302e] px-5 py-3 text-sm font-medium text-white hover:bg-[#442321]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eee8df] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#927e6e]">Parent categories</p>
            <Tags size={20} className="text-[#9b806b]" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#4b2927]">
            {categoryTree.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#eee8df] bg-white p-5">
          <p className="text-sm text-[#927e6e]">Subcategories</p>
          <p className="mt-3 text-2xl font-semibold text-[#4b2927]">
            {categories.filter((category) => category.parentId).length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#eee8df] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eee8df] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a18c7c]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-[#eee8df] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8b6257]"
            />
          </div>

          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8df] px-4 py-3 text-sm text-[#715d50] hover:bg-[#faf8f4]"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#927e6e]">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#927e6e]">
              No categories found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="overflow-hidden rounded-xl border border-[#eee8df]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffdf9] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(category._id)}
                        className="rounded-lg p-1 text-[#927e6e] hover:bg-[#f2ece4]"
                        aria-label="Toggle subcategories"
                      >
                        {expanded[category._id] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>

                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f1e9df] text-[#79534a]">
                          <Tags size={19} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#4b2927]">
                          {category.name}
                        </p>
                        <p className="mt-1 text-xs text-[#a18c7c]">
                          {category.children.length} subcategories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openCreate(category._id)}
                        className="rounded-lg border border-[#e9e1d7] px-3 py-2 text-xs font-medium text-[#715d50] hover:bg-[#f5f0e9]"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Plus size={14} />
                          Subcategory
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="rounded-lg border border-[#e9e1d7] p-2 text-[#715d50] hover:bg-[#f5f0e9]"
                        aria-label="Edit category"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                        aria-label="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {expanded[category._id] &&
                    category.children.map((child) => (
                      <div
                        key={child._id}
                        className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee8df] bg-white py-3 pl-12 pr-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-[#b89a7c]" />
                          <div>
                            <p className="text-sm font-medium text-[#624b40]">
                              {child.name}
                            </p>
                            <p className="mt-1 text-xs text-[#a18c7c]">
                              Subcategory
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(child)}
                            className="rounded-lg border border-[#e9e1d7] p-2 text-[#715d50] hover:bg-[#f5f0e9]"
                            aria-label="Edit subcategory"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(child)}
                            className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                            aria-label="Delete subcategory"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eee8df] px-6 py-5">
              <h2 className="text-lg font-semibold text-[#4b2927]">
                {editingId ? "Edit Category" : "Create Category"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#927e6e] hover:bg-[#f5f0e9]"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <label className={labelClass}>
                Category Name *
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                      slug: editingId
                        ? current.slug
                        : makeSlug(event.target.value)
                    }))
                  }
                  placeholder="Silk Sarees"
                  required
                />
              </label>

              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: event.target.value
                    }))
                  }
                  placeholder="silk-sarees"
                />
              </label>

              <label className={labelClass}>
                Parent Category
                <select
                  className={inputClass}
                  value={form.parentId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      parentId: event.target.value
                    }))
                  }
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter(
                      (category) =>
                        !category.parentId &&
                        category._id !== editingId
                    )
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className={labelClass}>
                Image URL
                <input
                  className={inputClass}
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imageUrl: event.target.value
                    }))
                  }
                  placeholder="https://..."
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#e9e1d7] px-5 py-3 text-sm text-[#715d50]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#5b302e] px-6 py-3 text-sm font-medium text-white hover:bg-[#442321] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
