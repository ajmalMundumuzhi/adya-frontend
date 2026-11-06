
import { useEffect, useState } from "react";
import { getSetting, saveSetting } from "../../../../services/admin/settings.service";

const DEFAULT_SETTINGS = {
  questionsHeading: "Any questions",
  email: "support@houseofadya.com",
  navigation: {
    home: "Home",
    shop: "Shop All",
    sarees: "Sarees",
    story: "Our Story",
  },
  accountLabel: "Login / Register",
  wishlistLabel: "Wishlist",
  cartLabel: "Shopping cart",
};

const NAVIGATION_FIELDS = [
  { key: "home", label: "Home" },
  { key: "shop", label: "Shop All" },
  { key: "sarees", label: "Sarees" },
  { key: "story", label: "Our Story" },
];

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#B49A68]"
      />
    </label>
  );
}

export default function HeaderSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const setting = await getSetting("site.header");

        if (active && setting?.value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...setting.value,
            navigation: {
              ...DEFAULT_SETTINGS.navigation,
              ...setting.value.navigation,
            },
          });
        }
      } catch (err) {
        if (err.response?.status !== 404 && active) {
          setError("Unable to load header settings.");
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
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updateNavigation(key, value) {
    setSettings((current) => ({
      ...current,
      navigation: {
        ...current.navigation,
        [key]: value,
      },
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.header", settings);
      setSuccess("Header settings saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save header settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading header settings...</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 rounded-xl border border-gray-200 bg-white p-6">
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Contact information</h3>
          <p className="text-sm text-gray-500">Edit the contact details displayed in your header.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone section heading" value={settings.callHeading} onChange={(value) => updateField("callHeading", value)} />
          <Field label="Questions section heading" value={settings.questionsHeading} onChange={(value) => updateField("questionsHeading", value)} />
          <Field label="Phone number" value={settings.phone} onChange={(value) => updateField("phone", value)} />
          <Field label="Email address" type="email" value={settings.email} onChange={(value) => updateField("email", value)} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Main navigation</h3>
          <p className="text-sm text-gray-500">Change the labels shown on desktop and mobile navigation.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {NAVIGATION_FIELDS.map((field) => (
            <Field
              key={field.key}
              label={`${field.label} label`}
              value={settings.navigation[field.key]}
              onChange={(value) => updateNavigation(field.key, value)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Mobile menu labels</h3>
          <p className="text-sm text-gray-500">Edit the utility labels displayed in the mobile menu.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Account" value={settings.accountLabel} onChange={(value) => updateField("accountLabel", value)} />
          <Field label="Wishlist" value={settings.wishlistLabel} onChange={(value) => updateField("wishlistLabel", value)} />
          <Field label="Shopping cart" value={settings.cartLabel} onChange={(value) => updateField("cartLabel", value)} />
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#493829] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Header Settings"}
      </button>
    </form>
  );
}
