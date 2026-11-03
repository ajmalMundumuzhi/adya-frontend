
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Save, X } from "lucide-react";
import {
  createBanner,
  getBannerById,
  updateBanner,
  uploadBannerImages
} from "../../services/admin/banners.service";

const initialForm = {
  eyebrow: "",
  title: "",
  description: "",
  imageUrl: "",
  mobileImageUrl: "",
  altText: "",
  ctaText: "Shop new arrivals",
  ctaLink: "/shop",
  imagePosition: "center 20%",
  displayOrder: 0,
  isActive: true
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 text-sm text-[#4b2927] outline-none transition focus:border-[#8b6257]";

const labelClass = "text-sm font-medium text-[#624b40]";

export default function AddBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return undefined;

    let active = true;

    async function loadBanner() {
      try {
        const banner = await getBannerById(id);

        if (!active) return;

        setForm({
          ...initialForm,
          ...banner
        });

        setDesktopPreview(banner.imageUrl || "");
        setMobilePreview(banner.mobileImageUrl || "");
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load banner");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBanner();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  useEffect(() => {
    if (!desktopFile) return undefined;

    const url = URL.createObjectURL(desktopFile);
    setDesktopPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [desktopFile]);

  useEffect(() => {
    if (!mobileFile) return undefined;

    const url = URL.createObjectURL(mobileFile);
    setMobilePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [mobileFile]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function selectDesktopImage(file) {
    if (!file) return;
    setDesktopFile(file);
  }

  function selectMobileImage(file) {
    if (!file) return;
    setMobileFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Banner title is required");
      return;
    }

    if (!form.imageUrl && !desktopFile) {
      setError("Please select a desktop banner image");
      return;
    }

    if (!form.ctaLink.trim()) {
      setError("CTA destination is required");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let mobileImageUrl = form.mobileImageUrl;

      const filesToUpload = [];
      const fileTypes = [];

      if (desktopFile) {
        filesToUpload.push(desktopFile);
        fileTypes.push("desktop");
      }

      if (mobileFile) {
        filesToUpload.push(mobileFile);
        fileTypes.push("mobile");
      }

      if (filesToUpload.length) {
        const uploaded = await uploadBannerImages(filesToUpload);

        if (uploaded.length !== filesToUpload.length) {
          throw new Error("Not all banner images were uploaded");
        }

        uploaded.forEach((item, index) => {
          if (fileTypes[index] === "desktop") {
            imageUrl = item.imageUrl;
          } else {
            mobileImageUrl = item.imageUrl;
          }
        });
      }

      const payload = {
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl,
        mobileImageUrl,
        altText: form.altText.trim(),
        ctaText: form.ctaText.trim(),
        ctaLink: form.ctaLink.trim(),
        imagePosition: form.imagePosition.trim() || "center 20%",
        displayOrder: Number(form.displayOrder),
        isActive: form.isActive
      };

      if (isEditing) {
        await updateBanner(id, payload);
      } else {
        await createBanner(payload);
      }

      navigate("/admin/banners", {
        replace: true,
        state: {
          message: isEditing
            ? "Banner updated successfully"
            : "Banner created successfully"
        }
      });
    } catch (err) {
      setError(err.message || "Unable to save banner");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#927e6e]">
        Loading banner...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <Link
          to="/admin/banners"
          className="rounded-xl border border-[#eee8df] bg-white p-2.5 text-[#715d50] hover:bg-[#f5f0e9]"
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
            Homepage content
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4b2927]">
            {isEditing ? "Edit Banner" : "Add New Banner"}
          </h1>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-[#4b2927]">
          Banner Content
        </h2>

        <div className="grid gap-5 mt-5 sm:grid-cols-2">
          <label className={labelClass}>
            Small Heading
            <input
              className={inputClass}
              value={form.eyebrow}
              onChange={(event) => updateField("eyebrow", event.target.value)}
              placeholder="A celebration of craft"
            />
          </label>

          <label className={labelClass}>
            Main Heading *
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Discover timeless elegance"
              required
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Description
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Write your banner description..."
            />
          </label>

          <label className={labelClass}>
            Button Text
            <input
              className={inputClass}
              value={form.ctaText}
              onChange={(event) => updateField("ctaText", event.target.value)}
              placeholder="Shop new arrivals"
            />
          </label>

          <label className={labelClass}>
            Button Destination
            <input
              className={inputClass}
              value={form.ctaLink}
              onChange={(event) => updateField("ctaLink", event.target.value)}
              placeholder="/shop"
              required
            />
          </label>

          <label className={labelClass}>
            Image Position
            <select
              className={inputClass}
              value={form.imagePosition}
              onChange={(event) => updateField("imagePosition", event.target.value)}
            >
              <option value="center 20%">Center</option>
              <option value="center top">Top</option>
              <option value="center bottom">Bottom</option>
              <option value="left center">Left</option>
              <option value="right center">Right</option>
            </select>
          </label>

          <label className={labelClass}>
            Display Order
            <input
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={form.displayOrder}
              onChange={(event) => updateField("displayOrder", event.target.value)}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Image Alt Text
            <input
              className={inputClass}
              value={form.altText}
              onChange={(event) => updateField("altText", event.target.value)}
              placeholder="Model wearing an ADYA silk saree"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-[#624b40] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
              className="h-4 w-4 accent-[#5b302e]"
            />
            Publish this banner
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#eee8df] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-[#4b2927]">
          Banner Images
        </h2>
        <p className="mt-1 text-sm text-[#927e6e]">
          JPG, PNG or WEBP. Maximum 5 MB per image.
        </p>

        <div className="grid gap-6 mt-5 md:grid-cols-2">
          <div>
            <p className={labelClass}>Desktop Image *</p>

            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5d9cc] bg-[#fffdf9] px-4 py-7 text-center hover:bg-[#f8f3ec]">
              <ImagePlus size={24} className="text-[#8b6257]" />
              <span className="mt-2 text-sm font-medium text-[#5b302e]">
                Select desktop image
              </span>
              <span className="mt-1 text-xs text-[#a18c7c]">
                Recommended wide landscape image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  selectDesktopImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>

            {desktopPreview && (
              <div className="relative mt-4">
                <img
                  src={desktopPreview}
                  alt="Desktop banner preview"
                  className="object-cover w-full h-44 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDesktopFile(null);
                    setDesktopPreview("");
                    updateField("imageUrl", "");
                  }}
                  className="absolute p-2 text-red-600 bg-white rounded-full shadow right-2 top-2"
                  aria-label="Remove desktop image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <p className={labelClass}>Mobile Image (Optional)</p>

            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5d9cc] bg-[#fffdf9] px-4 py-7 text-center hover:bg-[#f8f3ec]">
              <ImagePlus size={24} className="text-[#8b6257]" />
              <span className="mt-2 text-sm font-medium text-[#5b302e]">
                Select mobile image
              </span>
              <span className="mt-1 text-xs text-[#a18c7c]">
                Optional portrait image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  selectMobileImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>

            {mobilePreview && (
              <div className="relative mt-4">
                <img
                  src={mobilePreview}
                  alt="Mobile banner preview"
                  className="object-cover w-full h-44 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileFile(null);
                    setMobilePreview("");
                    updateField("mobileImageUrl", "");
                  }}
                  className="absolute p-2 text-red-600 bg-white rounded-full shadow right-2 top-2"
                  aria-label="Remove mobile image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Link
          to="/admin/banners"
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
              ? "Update Banner"
              : "Create Banner"}
        </button>
      </div>
    </form>
  );
}
