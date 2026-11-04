
import { useEffect, useState } from "react";
import { getSetting, saveSetting } from "../../../../services/admin/settings.service";
import { DEFAULT_HOMEPAGE_SETTINGS } from "../../../../hooks/useHomeSettings";

function Field({ label, value, onChange, multiline = false }) {
  const className = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#B49A68]";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
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

function ImageFields({ value, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Image URL" value={value.image} onChange={(image) => onChange("image", image)} />
      <Field label="Image alternative text" value={value.imageAlt} onChange={(imageAlt) => onChange("imageAlt", imageAlt)} />
      {value.image && (
        <div className="md:col-span-2">
          <img src={value.image} alt={value.imageAlt || ""} className="h-48 w-full rounded-lg object-cover" />
        </div>
      )}
    </div>
  );
}

export default function HomepageSettings() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const setting = await getSetting("site.homepage");

        if (active && setting?.value) {
          const saved = setting.value;

          setSettings({
            ...DEFAULT_HOMEPAGE_SETTINGS,
            ...saved,
            arrivals: { ...DEFAULT_HOMEPAGE_SETTINGS.arrivals, ...saved.arrivals },
            collection: { ...DEFAULT_HOMEPAGE_SETTINGS.collection, ...saved.collection },
            category: { ...DEFAULT_HOMEPAGE_SETTINGS.category, ...saved.category },
            brandStory: { ...DEFAULT_HOMEPAGE_SETTINGS.brandStory, ...saved.brandStory },
            seasonalBanner: { ...DEFAULT_HOMEPAGE_SETTINGS.seasonalBanner, ...saved.seasonalBanner },
            newsletter: { ...DEFAULT_HOMEPAGE_SETTINGS.newsletter, ...saved.newsletter },
            trustBenefits: Array.isArray(saved.trustBenefits)
              ? saved.trustBenefits
              : DEFAULT_HOMEPAGE_SETTINGS.trustBenefits,
          });
        }
      } catch (err) {
        if (err.response?.status !== 404 && active) {
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

  function updateSection(section, key, value) {
    setSettings((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  }

  function updateBenefit(index, key, value) {
    setSettings((current) => ({
      ...current,
      trustBenefits: current.trustBenefits.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.homepage", settings);
      setSuccess("Homepage settings saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save homepage settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading homepage settings...</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 rounded-xl border border-gray-200 bg-white p-6">
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">New Arrivals section</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "description", "linkLabel"].map((key) => (
            <Field key={key} label={key} multiline={key === "description"} value={settings.arrivals[key]} onChange={(value) => updateSection("arrivals", key, value)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Explore Our Sarees section</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "description", "linkLabel"].map((key) => (
            <Field key={key} label={key} multiline={key === "description"} value={settings.collection[key]} onChange={(value) => updateSection("collection", key, value)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Category section text</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "description", "linkLabel", "moreTitle", "moreLinkLabel"].map((key) => (
            <Field key={key} label={key} multiline={key === "description"} value={settings.category[key]} onChange={(value) => updateSection("category", key, value)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Brand Story section</h3>
        <ImageFields
          value={settings.brandStory}
          onChange={(key, value) => updateSection("brandStory", key, value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "paragraphOne", "paragraphTwo", "linkLabel"].map((key) => (
            <Field key={key} label={key} multiline={key.startsWith("paragraph")} value={settings.brandStory[key]} onChange={(value) => updateSection("brandStory", key, value)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Seasonal Banner section</h3>
        <ImageFields
          value={settings.seasonalBanner}
          onChange={(key, value) => updateSection("seasonalBanner", key, value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "description", "linkLabel"].map((key) => (
            <Field key={key} label={key} multiline={key === "description"} value={settings.seasonalBanner[key]} onChange={(value) => updateSection("seasonalBanner", key, value)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Trust Benefits</h3>
        {settings.trustBenefits.map((benefit, index) => (
          <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-800">Benefit {index + 1}</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={benefit.title} onChange={(value) => updateBenefit(index, "title", value)} />
              <Field label="Description" value={benefit.text} onChange={(value) => updateBenefit(index, "text", value)} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">Newsletter section</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {["eyebrow", "title", "description", "placeholder", "buttonLabel", "invalidMessage", "successMessage"].map((key) => (
            <Field key={key} label={key} multiline={["description", "invalidMessage", "successMessage"].includes(key)} value={settings.newsletter[key]} onChange={(value) => updateSection("newsletter", key, value)} />
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#493829] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Homepage Settings"}
      </button>
    </form>
  );
}
