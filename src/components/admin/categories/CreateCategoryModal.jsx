
import { useEffect, useRef, useState } from "react";
import { Plus, Upload, X, ImagePlus } from "lucide-react";

import { createCategory } from "../../../services/admin/categories.service";
import { uploadProductImages } from "../../../services/admin/products.service";

export default function CreateCategoryModal({ onClose, onCreated }) {
  const fileInputRef = useRef(null);
  const submittingRef = useRef(false);
  const previewRef = useRef("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subcategories, setSubcategories] = useState([""]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const preview = URL.createObjectURL(file);

    previewRef.current = preview;

    setImageFile(file);
    setImagePreview(preview);
    setImageUrl("");
    setError("");
  };

  const removeImage = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = "";
    }

    setImageFile(null);
    setImagePreview("");
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateSubcategory = (index, value) => {
    setSubcategories((current) =>
      current.map((item, i) => (i === index ? value : item))
    );
  };

  const addSubcategory = () => {
    setSubcategories((current) => [...current, ""]);
  };

  const removeSubcategory = (index) => {
    setSubcategories((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    submittingRef.current = true;
    setLoading(true);
    setError("");

    let mainCategoryCreated = false;
    let mainCategoryId = null;
    let createdSubcategories = 0;

    try {
      if (!name.trim()) {
        throw new Error("Main category name is required.");
      }

      const mainSlug = generateSlug(slug.trim() || name);

      if (!mainSlug) {
        throw new Error("Please enter a valid category name or slug.");
      }

      const validSubcategories = subcategories
        .map((item) => item.trim())
        .filter(Boolean);

      const uniqueNames = new Set(
        validSubcategories.map((item) => item.toLowerCase())
      );

      if (uniqueNames.size !== validSubcategories.length) {
        throw new Error("Duplicate subcategory names are not allowed.");
      }

      const uploadedImageUrl = imageFile
        ? await uploadProductImages([imageFile]).then((images) => {
            const url = images?.[0]?.imageUrl;

            if (!url) {
              throw new Error("Image upload did not return an image URL.");
            }

            return url;
          })
        : imageUrl.trim();

      const mainCategory = await createCategory({
        name: name.trim(),
        slug: mainSlug,
        parentId: null,
        imageUrl: uploadedImageUrl || undefined,
        isActive
      });

      mainCategoryId = mainCategory?._id;

      if (!mainCategoryId) {
        throw new Error(
          "Category response did not contain a category ID."
        );
      }

      mainCategoryCreated = true;

      for (const subcategoryName of validSubcategories) {
        await createCategory({
          name: subcategoryName,
          slug: `${mainSlug}-${generateSlug(subcategoryName)}`,
          parentId: mainCategoryId,
          isActive
        });

        createdSubcategories += 1;
      }

      onClose();

      Promise.resolve()
        .then(() => onCreated?.())
        .catch((refreshError) => {
          console.error("Category refresh failed:", refreshError);
        });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Unable to create category.";

      if (mainCategoryCreated) {
        onClose();

        Promise.resolve()
          .then(() => onCreated?.())
          .catch((refreshError) => {
            console.error("Category refresh failed:", refreshError);
          });

        window.alert(
          `Main category created successfully. ${createdSubcategories} of ${subcategories.filter((item) => item.trim()).length} subcategories were created. Remaining subcategories could not be created: ${message}`
        );
      } else {
        setError(message);
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              Create Category
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Add a main category and its subcategories.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Main category name *
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Sarees"
              required
              disabled={loading}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Slug
            </label>

            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="Automatically generated if empty"
              disabled={loading}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Category Image
            </label>

            {imagePreview || imageUrl ? (
              <div className="relative mt-2 overflow-hidden rounded-xl border border-stone-200">
                <img
                  src={imagePreview || imageUrl}
                  alt="Category preview"
                  className="h-48 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={loading}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow"
                  aria-label="Remove category image"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="mt-2 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center transition hover:border-stone-500 hover:bg-stone-100"
              >
                <ImagePlus size={28} className="text-stone-500" />

                <span className="mt-3 text-sm font-medium text-stone-800">
                  Upload Category Image
                </span>

                <span className="mt-1 text-xs text-stone-500">
                  Select an image from your device · Maximum 5MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={(event) => {
                selectImage(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
            >
              <Upload size={15} />
              {imagePreview || imageUrl ? "Change Image" : "Choose Image"}
            </button>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-stone-500">
                Or enter an image URL
              </label>

              <input
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);

                  if (previewRef.current) {
                    URL.revokeObjectURL(previewRef.current);
                    previewRef.current = "";
                  }

                  setImageFile(null);
                  setImagePreview("");
                }}
                placeholder="https://..."
                disabled={loading}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-800">
                Subcategories
              </label>

              <span className="text-xs text-stone-500">
                {subcategories.length} fields
              </span>
            </div>

            <div className="space-y-3">
              {subcategories.map((subcategory, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={subcategory}
                    onChange={(event) =>
                      updateSubcategory(index, event.target.value)
                    }
                    placeholder={`Subcategory ${index + 1}`}
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-500"
                  />

                  <button
                    type="button"
                    onClick={() => removeSubcategory(index)}
                    disabled={loading || subcategories.length === 1}
                    className="rounded-lg border border-stone-200 px-3 py-3 text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSubcategory}
              disabled={loading}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-stone-400 px-4 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-900 disabled:opacity-40"
            >
              <Plus size={17} />
              Add another subcategory
            </button>
          </div>

          <label className="flex items-center gap-3 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              disabled={loading}
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
            className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
