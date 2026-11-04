
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";

const DEFAULT_SETTINGS = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/adyabyanjana/",
    enabled: true,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "",
    enabled: false,
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "",
    enabled: false,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "",
    enabled: false,
  },
];

export default function SocialMediaSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await getSetting("site.socialMedia");
        const saved = response?.value;

        if (active && Array.isArray(saved)) {
          setSettings(
            DEFAULT_SETTINGS.map((defaultItem) => {
              const savedItem = saved.find(
                (item) => item.key === defaultItem.key
              );

              return savedItem
                ? { ...defaultItem, ...savedItem }
                : defaultItem;
            })
          );
        }
      } catch (err) {
        if (err?.response?.status !== 404 && active) {
          setError(
            err?.response?.data?.message ||
              "Unable to load social media settings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateItem(key, field, value) {
    setSettings((current) =>
      current.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );

    setError("");
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const invalidItem = settings.find(
      (item) =>
        item.enabled &&
        (!item.href.trim() || !/^https?:\/\/.+/i.test(item.href.trim()))
    );

    if (invalidItem) {
      setError(
        `Enter a valid URL for enabled ${invalidItem.label} profile.`
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.socialMedia", settings);
      setSuccess("Social media settings saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to save social media settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-sm text-gray-500">
        Loading social media settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Social Media Profiles
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage the social media links displayed across your website.
          </p>
        </div>

        <div className="space-y-5">
          {settings.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.enabled ? "Visible on website" : "Hidden on website"}
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) =>
                      updateItem(item.key, "enabled", event.target.checked)
                    }
                    className="h-4 w-4 accent-gray-900"
                  />
                  Enabled
                </label>
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profile URL
              </label>

              <input
                type="url"
                value={item.href}
                onChange={(event) =>
                  updateItem(item.key, "href", event.target.value)
                }
                placeholder={`Enter ${item.label} profile URL`}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Social Media Settings"}
        </button>
      </div>
    </form>
  );
}
