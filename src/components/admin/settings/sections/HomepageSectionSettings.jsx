
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";
import { DEFAULT_HOMEPAGE_SETTINGS } from "../../../../hooks/useHomeSettings";

const SECTION_CONFIG = {
  brandStory: {
    title: "Brand Story Settings",
    description: "Manage the brand story section displayed on your homepage.",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Heading" },
      { key: "paragraphOne", label: "First Paragraph", multiline: true },
      { key: "paragraphTwo", label: "Second Paragraph", multiline: true },
      { key: "linkLabel", label: "Button Text" },
    ],
    image: true,
  },
  seasonalBanner: {
    title: "Seasonal Banner Settings",
    description: "Manage the promotional banner displayed on your homepage.",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Heading" },
      { key: "description", label: "Description", multiline: true },
      { key: "linkLabel", label: "Button Text" },
    ],
    image: true,
  },
  trustBenefits: {
    title: "Trust Benefits Settings",
    description: "Manage the benefits displayed on your homepage.",
    benefits: true,
  },
  newsletter: {
    title: "Newsletter Settings",
    description: "Manage the newsletter section content.",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Heading" },
      { key: "description", label: "Description", multiline: true },
      { key: "placeholder", label: "Email Placeholder" },
      { key: "buttonLabel", label: "Button Text" },
      { key: "invalidMessage", label: "Invalid Email Message", multiline: true },
      { key: "successMessage", label: "Success Message", multiline: true },
    ],
  },
};

function Field({ label, value, onChange, multiline = false }) {
  const className =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#B49A68]";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {multiline ? (
        <textarea
          rows={4}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function ImageEditor({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Image URL"
          value={value.image}
          onChange={(image) => onChange("image", image)}
        />

        <Field
          label="Image Alternative Text"
          value={value.imageAlt}
          onChange={(imageAlt) => onChange("imageAlt", imageAlt)}
        />
      </div>

      {value.image && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <img
            src={value.image}
            alt={value.imageAlt || ""}
            className="h-52 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default function HomepageSectionSettings({ sectionKey }) {
  const config = SECTION_CONFIG[sectionKey];

  const [homepageSettings, setHomepageSettings] = useState(
    DEFAULT_HOMEPAGE_SETTINGS
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const setting = await getSetting("site.homepage");

        if (!active || !setting?.value) return;

        const saved = setting.value;

        setHomepageSettings({
          ...DEFAULT_HOMEPAGE_SETTINGS,
          ...saved,
          arrivals: {
            ...DEFAULT_HOMEPAGE_SETTINGS.arrivals,
            ...saved.arrivals,
          },
          collection: {
            ...DEFAULT_HOMEPAGE_SETTINGS.collection,
            ...saved.collection,
          },
          category: {
            ...DEFAULT_HOMEPAGE_SETTINGS.category,
            ...saved.category,
          },
          brandStory: {
            ...DEFAULT_HOMEPAGE_SETTINGS.brandStory,
            ...saved.brandStory,
          },
          seasonalBanner: {
            ...DEFAULT_HOMEPAGE_SETTINGS.seasonalBanner,
            ...saved.seasonalBanner,
          },
          newsletter: {
            ...DEFAULT_HOMEPAGE_SETTINGS.newsletter,
            ...saved.newsletter,
          },
          trustBenefits: Array.isArray(saved.trustBenefits)
            ? saved.trustBenefits
            : DEFAULT_HOMEPAGE_SETTINGS.trustBenefits,
        });
      } catch (err) {
        if (active && err.response?.status !== 404) {
          setError("Unable to load homepage settings.");
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

  function updateSection(key, value) {
    setHomepageSettings((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [key]: value,
      },
    }));

    setError("");
    setSuccess("");
  }

  function updateBenefit(index, key, value) {
    setHomepageSettings((current) => ({
      ...current,
      trustBenefits: current.trustBenefits.map((benefit, itemIndex) =>
        itemIndex === index
          ? { ...benefit, [key]: value }
          : benefit
      ),
    }));

    setError("");
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.homepage", homepageSettings);
      setSuccess(`${config.title} saved successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save homepage settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!config) {
    return <p className="text-sm text-red-600">Invalid homepage section.</p>;
  }

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading {config.title.toLowerCase()}...
      </p>
    );
  }

  const sectionValue = homepageSettings[sectionKey];

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {config.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {config.description}
        </p>
      </div>

      {config.image && (
        <ImageEditor
          value={sectionValue}
          onChange={updateSection}
        />
      )}

      {config.fields && (
        <div className="grid gap-5 md:grid-cols-2">
          {config.fields.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              value={sectionValue[field.key]}
              multiline={field.multiline}
              onChange={(value) => updateSection(field.key, value)}
            />
          ))}
        </div>
      )}

      {config.benefits && (
        <div className="space-y-4">
          {homepageSettings.trustBenefits.map((benefit, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border border-gray-200 p-5"
            >
              <h4 className="text-sm font-semibold text-gray-800">
                Benefit {index + 1}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Title"
                  value={benefit.title}
                  onChange={(value) =>
                    updateBenefit(index, "title", value)
                  }
                />

                <Field
                  label="Description"
                  value={benefit.text}
                  onChange={(value) =>
                    updateBenefit(index, "text", value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#493829] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5B4835] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
