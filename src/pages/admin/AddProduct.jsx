import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
  ChevronDown,
  Check
} from "lucide-react";
import {
  createProduct,
  getProductById,
  updateProduct,
  uploadProductImages
} from "../../services/admin/products.service";
import { getCategories } from "../../services/admin/categories.service";
function createSize() {
  return {
    size: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    stock: 0,
    weightGrams: "",
    isActive: true
  };
}
function createVariant() {
  return {
    color: "",
    images: [],
    imageFiles: [],
    sizes: [createSize()],
    isActive: true
  };
}
function createDetail() {
  return {
    key: "",
    value: ""
  };
}
const initialForm = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  subcategoryIds: [],
  offerId: "",
  isActive: true,
  details: [createDetail()],
  variants: [createVariant()]
};
const standardDetails = [
  { key: "fabric", label: "Fabric", placeholder: "Pure Silk" },
  { key: "occasion", label: "Occasion", placeholder: "Wedding" },
  { key: "blouse", label: "Blouse", placeholder: "Unstitched" },
  { key: "work", label: "Work", placeholder: "Zari Work" },
  { key: "pattern", label: "Pattern", placeholder: "Traditional" },
  {
    key: "careInstructions",
    label: "Care Instructions",
    placeholder: "Dry Clean Only"
  },
  {
    key: "countryOfOrigin",
    label: "Country of Origin",
    placeholder: "India"
  }
];
export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (active) {
          setCategories(data);
        }
      } catch (err) {
        if (active) {
          setCategoriesError(err.message || "Unable to load categories");
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    }
    loadCategories();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadProduct() {
      try {
        const product = await getProductById(id);
        if (!active) return;
        const existingDetails = Object.entries(product.details || {}).map(
          ([key, value]) => ({
            key,
            value: String(value ?? "")
          })
        );
        setForm({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          categoryId: product.categoryId?._id || product.categoryId || "",
          subcategoryIds: (product.subcategoryIds || []).map(
            (item) => item?._id || item
          ),
          offerId: product.offerId?._id || product.offerId || "",
          isActive: product.isActive !== false,
          details: existingDetails.length
            ? existingDetails
            : [createDetail()],
          variants: (product.variants || []).map((variant) => ({
            color: variant.color || "",
            images: variant.images || [],
            imageFiles: [],
            isActive: variant.isActive !== false,
            sizes: (variant.sizes || []).map((size) => ({
              size: size.size || "",
              sku: size.sku || "",
              price: size.price ?? "",
              compareAtPrice: size.compareAtPrice ?? "",
              stock: size.stock ?? 0,
              weightGrams: size.weightGrams ?? "",
              isActive: size.isActive !== false
            }))
          }))
        });
      } catch (err) {
        setError(err.message || "Unable to load product");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      active = false;
    };
  }, [id, isEditing]);
  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }
  function updateDetail(index, field, value) {
    setForm((current) => ({
      ...current,
      details: current.details.map((detail, detailIndex) =>
        detailIndex === index
          ? { ...detail, [field]: value }
          : detail
      )
    }));
  }
  function addDetail() {
    setForm((current) => ({
      ...current,
      details: [...current.details, createDetail()]
    }));
  }
  function removeDetail(index) {
    setForm((current) => ({
      ...current,
      details: current.details.filter((_, i) => i !== index)
    }));
  }
  function addStandardDetail(detail) {
    const exists = form.details.some(
      (item) => item.key.toLowerCase() === detail.key.toLowerCase()
    );
    if (exists) return;
    setForm((current) => ({
      ...current,
      details: [
        ...current.details.filter((item) => item.key || item.value),
        {
          key: detail.key,
          value: ""
        }
      ]
    }));
  }
  function updateVariant(index, field, value) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, [field]: value }
          : variant
      )
    }));
  }
  function updateSize(variantIndex, sizeIndex, field, value) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) => {
        if (index !== variantIndex) return variant;
        return {
          ...variant,
          sizes: variant.sizes.map((size, index) =>
            index === sizeIndex ? { ...size, [field]: value } : size
          )
        };
      })
    }));
  }
  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [...current.variants, createVariant()]
    }));
  }
  function removeVariant(index) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index)
    }));
  }
  function addSize(variantIndex) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, sizes: [...variant.sizes, createSize()] }
          : variant
      )
    }));
  }
  function removeSize(variantIndex, sizeIndex) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.filter((_, i) => i !== sizeIndex)
            }
          : variant
      )
    }));
  }
  function selectImages(variantIndex, files) {
    const selectedFiles = Array.from(files || []);
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              imageFiles: [...variant.imageFiles, ...selectedFiles]
            }
          : variant
      )
    }));
  }
  function removeExistingImage(variantIndex, imageIndex) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              images: variant.images.filter((_, i) => i !== imageIndex)
            }
          : variant
      )
    }));
  }
  function removeNewImage(variantIndex, imageIndex) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              imageFiles: variant.imageFiles.filter((_, i) => i !== imageIndex)
            }
          : variant
      )
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }
    if (!form.variants.length) {
      setError("Add at least one product variant");
      return;
    }
    for (const variant of form.variants) {
      if (!variant.color.trim()) {
        setError("Every variant must have a colour");
        return;
      }
      if (!variant.sizes.length) {
        setError(`Add at least one size for ${variant.color}`);
        return;
      }
      for (const size of variant.sizes) {
        if (!size.size.trim() || size.price === "") {
          setError(`Enter the size and price for ${variant.color}`);
          return;
        }
        if (Number(size.price) < 0 || Number(size.stock) < 0) {
          setError("Price and stock cannot be negative");
          return;
        }

        if (!Number.isFinite(Number(size.weightGrams)) || Number(size.weightGrams) <= 0) {
          setError(`Enter a valid weight in grams for ${variant.color} - ${size.size}`);
          return;
        }
      }
    }
    const details = {};
    for (const detail of form.details) {
      const key = detail.key.trim();
      const value = detail.value.trim();
      if (!key && !value) continue;
      if (!key || !value) {
        setError("Complete or remove every additional detail field");
        return;
      }
      if (Object.prototype.hasOwnProperty.call(details, key)) {
        setError(`Duplicate product detail: ${key}`);
        return;
      }
      details[key] = value;
    }
    setSaving(true);
    try {
      const variants = await Promise.all(
        form.variants.map(async (variant) => {
          let images = [...variant.images];
          if (variant.imageFiles.length) {
            const uploaded = await uploadProductImages(
              variant.imageFiles
            );
            images = [
              ...images,
              ...uploaded.map((image) => image.imageUrl)
            ];
          }
          return {
            color: variant.color.trim(),
            images,
            isActive: variant.isActive,
            sizes: variant.sizes.map((size) => ({
              size: size.size.trim(),
              sku: size.sku.trim() || undefined,
              price: Number(size.price),
              compareAtPrice:
                size.compareAtPrice === ""
                  ? null
                  : Number(size.compareAtPrice),
              stock: Number(size.stock),
              weightGrams: Number(size.weightGrams),
              isActive: size.isActive
            }))
          };
        })
      );
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description,
        categoryId: form.categoryId || null,
        subcategoryIds: form.subcategoryIds,
        offerId: form.offerId.trim() || null,
        isActive: form.isActive,
        details,
        variants
      };
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products", {
        replace: true,
        state: {
          message: isEditing
            ? "Product updated successfully"
            : "Product created successfully"
        }
      });
    } catch (err) {
      setError(err.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  }
  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 text-sm text-[#4b2927] outline-none transition focus:border-[#8b6257]";
  const labelClass = "text-sm font-medium text-[#624b40]";
  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#927e6e]">
        Loading product...
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="rounded-xl border border-[#eee8df] bg-white p-2.5 text-[#715d50] hover:bg-[#f5f0e9]"
        >
          <ArrowLeft size={19} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
            Product management
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4b2927]">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <section className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-[#4b2927]">
          Basic Information
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Product Name *
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="ADYA Heritage Silk Saree"
              required
            />
          </label>
          <label className={labelClass}>
            Product Slug
            <input
              className={inputClass}
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="adya-heritage-silk-saree"
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Description
            <textarea
              rows={5}
              className={inputClass}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the product..."
            />
          </label>
          <label className={labelClass}>
            Category *
            <select
              className={inputClass}
              value={form.categoryId}
              disabled={categoriesLoading}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  categoryId: event.target.value,
                  subcategoryIds: []
                }));
              }}
              required
            >
              <option value="">
                {categoriesLoading ? "Loading categories..." : "Select category"}
              </option>
              {categories
                .filter((category) => !category.parentId)
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>
          <div className={labelClass}>
            Subcategories
            <div className="relative mt-2">
              <button
                type="button"
                className={`${inputClass} mt-0 flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:bg-[#f8f5f0] disabled:opacity-60`}
                disabled={!form.categoryId}
                aria-expanded={subcategoryDropdownOpen}
                onClick={() =>
                  setSubcategoryDropdownOpen((current) => !current)
                }
              >
                <span className="truncate font-normal">
                  {!form.categoryId
                    ? "Select a category first"
                    : form.subcategoryIds.length
                      ? `${form.subcategoryIds.length} selected`
                      : "Select subcategories"}
                </span>
                <ChevronDown
                  size={17}
                  className={`shrink-0 text-[#927e6e] transition-transform ${subcategoryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {subcategoryDropdownOpen && form.categoryId && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#e9e1d7] bg-white p-2 shadow-lg">
                  {categories
                    .filter(
                      (category) =>
                        String(category.parentId?._id || category.parentId) ===
                        String(form.categoryId)
                    )
                    .map((category) => {
                      const selected = form.subcategoryIds.includes(category._id);

                      return (
                        <button
                          key={category._id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-[#624b40] transition hover:bg-[#f8f3ec]"
                          onClick={() => {
                            const nextSelected = selected
                              ? form.subcategoryIds.filter(
                                  (id) => id !== category._id
                                )
                              : [...form.subcategoryIds, category._id];
                            updateField("subcategoryIds", nextSelected);
                          }}
                        >
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-[#5b302e] bg-[#5b302e] text-white" : "border-[#d8cbbd] bg-white"}`}>
                            {selected && <Check size={12} />}
                          </span>
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  {categories.filter(
                    (category) =>
                      String(category.parentId?._id || category.parentId) ===
                      String(form.categoryId)
                  ).length === 0 && (
                    <p className="px-3 py-2 text-sm font-normal text-[#a18c7c]">
                      No subcategories available for this category.
                    </p>
                  )}
                </div>
              )}
            </div>
            {form.subcategoryIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {categories
                  .filter((category) =>
                    form.subcategoryIds.includes(category._id)
                  )
                  .map((category) => (
                    <span
                      key={category._id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e1d7] bg-[#fffdf9] px-2.5 py-1 text-xs font-normal text-[#715d50]"
                    >
                      {category.name}
                      <button
                        type="button"
                        aria-label={`Remove ${category.name}`}
                        className="text-[#927e6e] hover:text-red-600"
                        onClick={() =>
                          updateField(
                            "subcategoryIds",
                            form.subcategoryIds.filter(
                              (id) => id !== category._id
                            )
                          )
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 self-end pb-3 text-sm text-[#624b40]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
              className="h-4 w-4 accent-[#5b302e]"
            />
            Product is active
          </label>
        </div>
        {categoriesError && (
          <p className="mt-3 text-sm text-red-600">{categoriesError}</p>
        )}
      </section>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#4b2927]">
              Variants and Sizes
            </h2>
            <p className="mt-1 text-sm text-[#927e6e]">
              Add different colours, images and size options.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9c9b9] px-4 py-2.5 text-sm font-medium text-[#5b302e] hover:bg-[#f5f0e9]"
          >
            <Plus size={17} />
            Add Colour
          </button>
        </div>
        {form.variants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[#4b2927]">
                Colour Variant {variantIndex + 1}
              </h3>
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(variantIndex)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label="Remove colour variant"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Colour *
                <input
                  className={inputClass}
                  value={variant.color}
                  onChange={(event) =>
                    updateVariant(variantIndex, "color", event.target.value)
                  }
                  placeholder="Maroon"
                  required
                />
              </label>
              <label className="flex items-center gap-3 self-end pb-3 text-sm text-[#624b40]">
                <input
                  type="checkbox"
                  checked={variant.isActive}
                  onChange={(event) =>
                    updateVariant(variantIndex, "isActive", event.target.checked)
                  }
                  className="h-4 w-4 accent-[#5b302e]"
                />
                Variant is active
              </label>
            </div>
            <div className="mt-6">
              <p className={labelClass}>Product Images</p>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5d9cc] bg-[#fffdf9] px-4 py-7 text-center transition hover:bg-[#f8f3ec]">
                <Upload size={23} className="text-[#8b6257]" />
                <span className="mt-2 text-sm font-medium text-[#5b302e]">
                  Select images
                </span>
                <span className="mt-1 text-xs text-[#a18c7c]">
                  Choose multiple images for this colour
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    selectImages(variantIndex, event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
              {(variant.images.length > 0 ||
                variant.imageFiles.length > 0) && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {variant.images.map((image, imageIndex) => (
                    <div key={`existing-${imageIndex}`} className="relative">
                      <img
                        src={image}
                        alt={`${variant.color} product`}
                        className="h-28 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(variantIndex, imageIndex)
                        }
                        className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-600 shadow"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {variant.imageFiles.map((file, imageIndex) => (
                    <div key={`new-${imageIndex}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-28 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(variantIndex, imageIndex)
                        }
                        className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-600 shadow"
                        aria-label="Remove selected image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-medium text-[#4b2927]">Size Options</h4>
              <button
                type="button"
                onClick={() => addSize(variantIndex)}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#79534a] hover:text-[#4b2927]"
              >
                <Plus size={16} />
                Add Size
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {variant.sizes.map((size, sizeIndex) => (
                <div
                  key={sizeIndex}
                  className="rounded-xl border border-[#eee8df] bg-[#fffdf9] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#715d50]">
                      Size {sizeIndex + 1}
                    </p>
                    {variant.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(variantIndex, sizeIndex)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Remove size"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <label className={labelClass}>
                      Size *
                      <input
                        className={inputClass}
                        value={size.size}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "size",
                            event.target.value
                          )
                        }
                        placeholder="Free Size"
                        required
                      />
                    </label>
                    <label className={labelClass}>
                      SKU
                      <input
                        className={inputClass}
                        value={size.sku}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "sku",
                            event.target.value
                          )
                        }
                        placeholder="ADYA-MAR-FS"
                      />
                    </label>
                    <label className={labelClass}>
                      Price (AUD) *
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        value={size.price}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "price",
                            event.target.value
                          )
                        }
                        required
                      />
                    </label>
                    <label className={labelClass}>
                      Compare-at Price (AUD)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        value={size.compareAtPrice}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "compareAtPrice",
                            event.target.value
                          )
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Stock Quantity
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={inputClass}
                        value={size.stock}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "stock",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label className={labelClass}>
                      Weight (grams) *
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className={inputClass}
                        value={size.weightGrams}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "weightGrams",
                            event.target.value
                          )
                        }
                        placeholder="Example: 850"
                        required
                      />
                    </label>
                    <label className="flex items-center gap-3 self-end pb-3 text-sm text-[#624b40]">
                      <input
                        type="checkbox"
                        checked={size.isActive}
                        onChange={(event) =>
                          updateSize(
                            variantIndex,
                            sizeIndex,
                            "isActive",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 accent-[#5b302e]"
                      />
                      Size is active
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#4b2927]">
              Additional Product Details
            </h2>
            <p className="mt-1 text-sm text-[#927e6e]">
              Add specifications that customers can see on the product page.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#a18c7c]">
            Suggested attributes
          </p>
          <div className="flex flex-wrap gap-2">
            {standardDetails.map((detail) => {
              const exists = form.details.some(
                (item) =>
                  item.key.toLowerCase() === detail.key.toLowerCase()
              );
              return (
                <button
                  key={detail.key}
                  type="button"
                  disabled={exists}
                  onClick={() => addStandardDetail(detail)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e1d7] px-3 py-2 text-xs font-medium text-[#715d50] transition hover:border-[#9b806b] hover:bg-[#f8f3ec] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={13} />
                  {detail.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {form.details.map((detail, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-[#eee8df] bg-[#fffdf9] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            >
              <label className={labelClass}>
                Attribute Name
                <input
                  className={inputClass}
                  value={detail.key}
                  onChange={(event) =>
                    updateDetail(index, "key", event.target.value)
                  }
                  placeholder="Fabric"
                />
              </label>
              <label className={labelClass}>
                Attribute Value
                <input
                  className={inputClass}
                  value={detail.value}
                  onChange={(event) =>
                    updateDetail(index, "value", event.target.value)
                  }
                  placeholder="Pure Silk"
                />
              </label>
              <button
                type="button"
                onClick={() => removeDetail(index)}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-red-100 px-3 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                <span className="sm:hidden">Remove attribute</span>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDetail}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#d9c9b9] px-4 py-3 text-sm font-medium text-[#5b302e] transition hover:bg-[#f5f0e9]"
        >
          <Plus size={17} />
          Add Custom Attribute
        </button>
      </section>
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Link
          to="/admin/products"
          className="rounded-xl border border-[#e9e1d7] bg-white px-6 py-3 text-center text-sm font-medium text-[#715d50] hover:bg-[#f5f0e9]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b302e] px-7 py-3 text-sm font-medium text-white hover:bg-[#442321] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
