
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";
import {
  COMPANY_LINKS,
  SERVICE_LINKS,
  SHOP_LINKS,
} from "../../../../config/navigation";
import { SITE } from "../../../../config/site";

const DEFAULT_SETTINGS = {
  description: SITE.description,
  shopTitle: "Shop",
  serviceTitle: "Customer Service",
  companyTitle: "Company",
  shopLinks: SHOP_LINKS,
  serviceLinks: SERVICE_LINKS.filter((link) => link.to !== "/faqs"),
  companyLinks: COMPANY_LINKS,
  copyrightText: "All rights reserved.",
  designerText: "Designed by",
  designerName: "RDR Technologies",
  designerUrl: "https://www.instagram.com/rdr.technology/",
};

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  const className =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </div>
  );
}

function LinkEditor({ title, links, onChange }) {
  function updateLink(index, field, value) {
    onChange(
      links.map((link, currentIndex) =>
        currentIndex === index
          ? { ...link, [field]: value }
          : link
      )
    );
  }

  function addLink() {
    onChange([...links, { label: "", to: "" }]);
  }

  function removeLink(index) {
    onChange(links.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={addLink}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Add Link
        </button>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <div
            key={`${title}-${index}`}
            className="grid gap-3 rounded-lg border border-gray-100 p-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <Field
              label="Link Label"
              value={link.label}
              onChange={(value) => updateLink(index, "label", value)}
            />
            <Field
              label="Destination"
              value={link.to}
              onChange={(value) => updateLink(index, "to", value)}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="w-full rounded-lg border border-red-200 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 md:w-auto"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <p className="text-sm text-gray-500">No links added yet.</p>
        )}
      </div>
    </div>
  );
}

export default function FooterSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await getSetting("site.footer");

        if (active && response?.value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.value,
            shopLinks: response.value.shopLinks || DEFAULT_SETTINGS.shopLinks,
            serviceLinks:
              response.value.serviceLinks || DEFAULT_SETTINGS.serviceLinks,
            companyLinks:
              response.value.companyLinks || DEFAULT_SETTINGS.companyLinks,
          });
        }
      } catch (err) {
        if (err?.response?.status !== 404 && active) {
          setError(
            err?.response?.data?.message ||
              "Unable to load footer settings."
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

  function updateField(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const allLinks = [
      ...settings.shopLinks,
      ...settings.serviceLinks,
      ...settings.companyLinks,
    ];

    if (allLinks.some((link) => !link.label.trim() || !link.to.trim())) {
      setError("Every footer link must have a label and destination.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.footer", settings);
      setSuccess("Footer settings saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to save footer settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-sm text-gray-500">
        Loading footer settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Footer Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage the description and text displayed in your website footer.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Footer Description"
            value={settings.description}
            onChange={(value) => updateField("description", value)}
            multiline
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Copyright Text"
              value={settings.copyrightText}
              onChange={(value) => updateField("copyrightText", value)}
            />
            <Field
              label="Designer Credit Heading"
              value={settings.designerText}
              onChange={(value) => updateField("designerText", value)}
            />
            <Field
              label="Designer Name"
              value={settings.designerName}
              onChange={(value) => updateField("designerName", value)}
            />
            <Field
              label="Designer URL"
              value={settings.designerUrl}
              onChange={(value) => updateField("designerUrl", value)}
              type="url"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-5 text-base font-semibold text-gray-900">
          Footer Section Headings
        </h3>

        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="Shop Heading"
            value={settings.shopTitle}
            onChange={(value) => updateField("shopTitle", value)}
          />
          <Field
            label="Customer Service Heading"
            value={settings.serviceTitle}
            onChange={(value) => updateField("serviceTitle", value)}
          />
          <Field
            label="Company Heading"
            value={settings.companyTitle}
            onChange={(value) => updateField("companyTitle", value)}
          />
        </div>
      </div>

      <LinkEditor
        title="Shop Links"
        links={settings.shopLinks}
        onChange={(value) => updateField("shopLinks", value)}
      />

      <LinkEditor
        title="Customer Service Links"
        links={settings.serviceLinks}
        onChange={(value) => updateField("serviceLinks", value)}
      />

      <LinkEditor
        title="Company Links"
        links={settings.companyLinks}
        onChange={(value) => updateField("companyLinks", value)}
      />

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
          {saving ? "Saving..." : "Save Footer Settings"}
        </button>
      </div>
    </form>
  );
}
