
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";

const DEFAULT_SETTINGS = {
  eyebrow: "Our Story",
  title: "Welcome to Adya by Anjana",
  subtitle:
    "Every woman is unique. Her saree should feel just as special.",
  image: "/images/about image.webp",
  imageAlt: "Beautifully embroidered Indian saree in soft pastel tones",
  introductionOne:
    "I’m Anjana Karun—a civil engineer, a mother, and the founder of Adya by Anjana.",
  introductionTwo:
    "My love for sarees began in a small village in Kerala, where I grew up admiring the colours, textures and intricate details that give each saree its character. I was fascinated by how a woman could make a saree her own through the way she wore and styled it.",
  introductionThree:
    "As I built my life in Australia, that love remained close to me. Alongside my engineering career and motherhood, sharing styling ideas through YouTube and Instagram gave me a way to express my creativity—and eventually inspired Adya by Anjana.",
  introductionFour:
    "Adya is a personal expression of everything I love about sarees: soft colours, thoughtful details and the joy of finding a piece that feels uniquely yours. Every saree is handpicked by me, with the hope that it helps you express your individuality with elegance and confidence.",
  quote: "Personally handpicked. Chosen for its character.",
  selectionOne:
    "I personally select every saree in our collection, looking for something distinctive—a delicate pastel shade, an unexpected detail, a beautiful texture or a graceful drape.",
  selectionTwo:
    "Each piece is chosen with care, creating a thoughtfully curated collection that celebrates understated elegance and your own sense of style.",
  selectionThree:
    "My hope is that you discover a saree that feels unmistakably yours.",
  signature: "With love, Anjana",
  founderTitle: "Founder, Adya by Anjana",
  missionTitle: "Our Mission",
  missionDescription:
    "To celebrate every woman’s individuality through personally handpicked sarees, chosen for distinctive colours, beautiful details and graceful drapes.",
  visionTitle: "Our Vision",
  visionDescription:
    "To become a cherished boutique where women discover sarees that express their individuality, known for soft colours, refined elegance and personal care.",
  ctaLabel: "Explore the collection",
  ctaLink: "/shop",
};

const INTRODUCTION_FIELDS = [
  ["introductionOne", "Introduction Paragraph 1"],
  ["introductionTwo", "Introduction Paragraph 2"],
  ["introductionThree", "Introduction Paragraph 3"],
  ["introductionFour", "Introduction Paragraph 4"],
];

const SELECTION_FIELDS = [
  ["selectionOne", "Selection Paragraph 1"],
  ["selectionTwo", "Selection Paragraph 2"],
  ["selectionThree", "Selection Paragraph 3"],
];

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}) {
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
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function SettingsCard({ title, description, children }) {
  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function OurStorySettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await getSetting("site.ourStory");

        if (active && response?.value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.value,
          });
        }
      } catch (err) {
        if (active && err.response?.status !== 404) {
          setError(
            err.response?.data?.message ||
              "Unable to load Our Story settings."
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

  function updateField(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
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
      await saveSetting("site.ourStory", settings);
      setSuccess("Our Story settings saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save Our Story settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading Our Story settings...
      </p>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SettingsCard title="Page Introduction">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={settings.eyebrow}
            onChange={(value) => updateField("eyebrow", value)}
          />
          <Field
            label="Page Heading"
            value={settings.title}
            onChange={(value) => updateField("title", value)}
          />
        </div>

        <Field
          label="Subtitle"
          value={settings.subtitle}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </SettingsCard>

      <SettingsCard title="Main Image">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Image URL"
            value={settings.image}
            onChange={(value) => updateField("image", value)}
          />
          <Field
            label="Image Alternative Text"
            value={settings.imageAlt}
            onChange={(value) => updateField("imageAlt", value)}
          />
        </div>

        {settings.image && (
          <img
            src={settings.image}
            alt={settings.imageAlt || ""}
            className="h-56 w-full rounded-lg border border-gray-200 object-cover"
          />
        )}
      </SettingsCard>

      <SettingsCard title="Founder Introduction">
        <div className="space-y-5">
          {INTRODUCTION_FIELDS.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={settings[key]}
              onChange={(value) => updateField(key, value)}
              multiline
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Featured Quote">
        <Field
          label="Quote"
          value={settings.quote}
          onChange={(value) => updateField("quote", value)}
          multiline
        />
      </SettingsCard>

      <SettingsCard title="Our Saree Selection">
        <div className="space-y-5">
          {SELECTION_FIELDS.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={settings[key]}
              onChange={(value) => updateField(key, value)}
              multiline
            />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Founder Signature"
            value={settings.signature}
            onChange={(value) => updateField("signature", value)}
          />
          <Field
            label="Founder Designation"
            value={settings.founderTitle}
            onChange={(value) => updateField("founderTitle", value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Mission">
        <Field
          label="Mission Heading"
          value={settings.missionTitle}
          onChange={(value) => updateField("missionTitle", value)}
        />
        <Field
          label="Mission Description"
          value={settings.missionDescription}
          onChange={(value) => updateField("missionDescription", value)}
          multiline
        />
      </SettingsCard>

      <SettingsCard title="Vision">
        <Field
          label="Vision Heading"
          value={settings.visionTitle}
          onChange={(value) => updateField("visionTitle", value)}
        />
        <Field
          label="Vision Description"
          value={settings.visionDescription}
          onChange={(value) => updateField("visionDescription", value)}
          multiline
        />
      </SettingsCard>

      <SettingsCard title="Final Collection Button">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Button Text"
            value={settings.ctaLabel}
            onChange={(value) => updateField("ctaLabel", value)}
          />
          <Field
            label="Button Destination"
            value={settings.ctaLink}
            onChange={(value) => updateField("ctaLink", value)}
          />
        </div>
      </SettingsCard>

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
          className="rounded-lg bg-[#493829] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5B4835] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Our Story"}
        </button>
      </div>
    </form>
  );
}
