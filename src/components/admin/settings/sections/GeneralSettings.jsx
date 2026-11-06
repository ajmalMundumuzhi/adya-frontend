
import { useEffect, useRef, useState } from "react";
import {
  getSetting,
  saveSetting,
  uploadSiteImage,
} from "../../../../services/admin/settings.service";

const DEFAULT_SETTINGS = {
  name: "ADYA",
  tagline: "Sarees for Every Story",
  description:
    "A considered edit of Indian-inspired sarees for celebrations, everyday elegance and meaningful moments.",
  phone: "+91 98765 43210",
  email: "support@houseofadya.com",
  logoUrl: "",
  faviconUrl: "",
};

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
}) {
  const className =
    "w-full px-4 py-3 text-sm transition bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  );
}

function ImageUploader({
  label,
  imageUrl,
  assetType,
  onUpload,
  uploading,
}) {
  const inputRef = useRef(null);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    onUpload(file, assetType);
    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center justify-center w-40 h-24 p-3 overflow-hidden border border-gray-300 border-dashed rounded-lg bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${label} preview`}
              className="object-contain max-w-full max-h-full"
            />
          ) : (
            <span className="text-xs text-gray-400">
              No image uploaded
            </span>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image"}
          </button>

          <p className="text-xs text-gray-500">
            JPG, PNG, WEBP or AVIF. Maximum 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}


export default function GeneralSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await getSetting("site.general");

        if (response?.value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.value,
          });
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          setError(
            err?.response?.data?.message ||
              "Unable to load general settings."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateField(field, value) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  }

  async function handleImageUpload(file, assetType) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP or AVIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setUploadingAsset(assetType);
    setError("");
    setSuccess("");

    try {
      const result = await uploadSiteImage(file, assetType);

      const field = assetType === "logo" ? "logoUrl" : "faviconUrl";

      updateField(field, result.url);
      setSuccess(
        `${assetType === "logo" ? "Logo" : "Favicon"} uploaded successfully. Save General Settings to apply it.`
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Image upload failed. Please try again."
      );
    } finally {
      setUploadingAsset("");
    }
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.general", settings);
      setSuccess("General settings saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to save general settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl">
        Loading general settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Website Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's name and general website information.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Website Name"
            value={settings.name}
            onChange={(value) => updateField("name", value)}
            placeholder="ADYA"
          />

          <FormField
            label="Website Tagline"
            value={settings.tagline}
            onChange={(value) => updateField("tagline", value)}
            placeholder="Sarees for Every Story"
          />

          <div className="md:col-span-2">
            <FormField
              label="Website Description"
              value={settings.description}
              onChange={(value) => updateField("description", value)}
              placeholder="Enter your website description"
              multiline
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Contact Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage the contact details displayed on your website.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Contact Phone"
            value={settings.phone}
            onChange={(value) => updateField("phone", value)}
            placeholder="+91 98765 43210"
          />

          <FormField
            label="Contact Email"
            type="email"
            value={settings.email}
            onChange={(value) => updateField("email", value)}
            placeholder="support@houseofadya.com"
          />
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Brand Assets
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your website logo and browser favicon.
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader
            label="Website Logo"
            imageUrl={settings.logoUrl}
            assetType="logo"
            onUpload={handleImageUpload}
            uploading={uploadingAsset === "logo"}
          />

          <div className="border-t border-gray-100" />

          <ImageUploader
            label="Website Favicon"
            imageUrl={settings.faviconUrl}
            assetType="favicon"
            onUpload={handleImageUpload}
            uploading={uploadingAsset === "favicon"}
          />
        </div>
      </div>

      {error && (
        <p className="px-4 py-3 text-sm text-red-600 rounded-lg bg-red-50">
          {error}
        </p>
      )}

      {success && (
        <p className="px-4 py-3 text-sm text-green-700 rounded-lg bg-green-50">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || Boolean(uploadingAsset)}
          className="px-6 py-3 text-sm font-medium text-white transition bg-gray-900 rounded-lg hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save General Settings"}
        </button>
      </div>
    </form>
  );
}
