import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Save, RefreshCw, MapPin, Globe } from "lucide-react";
import {
  getShippingCountries,
  createShippingCountry,
  updateShippingCountry,
  deleteShippingCountry
} from "../../../../services/admin/shipping.service";

const emptySlab = () => ({
  label: "",
  minWeightGrams: 0,
  maxWeightGrams: 1000,
  rate: 0
});

const emptyCountry = () => ({
  country: "",
  countryCode: "",
  currency: "",
  locale: "",
  flag: "",
  isActive: true,
  weightSlabs: [emptySlab()],
  cityOverrides: []
});

const inputClass =
  "w-full rounded-lg border border-[#e8dfd2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#9b7950]";

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[#715d50]">{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  );
}

function WeightSlabs({ slabs, onChange }) {
  const update = (index, field, value) => {
    onChange(
      slabs.map((slab, i) =>
        i === index
          ? {
              ...slab,
              [field]: ["minWeightGrams", "maxWeightGrams", "rate"].includes(field)
                ? Number(value)
                : value
            }
          : slab
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-[#493829]">Weight slabs</h4>
        <button
          type="button"
          onClick={() => onChange([...slabs, emptySlab()])}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#795b35]"
        >
          <Plus size={15} /> Add slab
        </button>
      </div>

      {slabs.map((slab, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-lg border border-[#eee7dc] p-3 sm:grid-cols-5"
        >
          <Field
            label="Slab label"
            value={slab.label}
            placeholder="0–500g"
            onChange={value => update(index, "label", value)}
          />
          <Field
            label="Minimum (g)"
            type="number"
            value={slab.minWeightGrams}
            onChange={value => update(index, "minWeightGrams", value)}
          />
          <Field
            label="Maximum (g)"
            type="number"
            value={slab.maxWeightGrams}
            onChange={value => update(index, "maxWeightGrams", value)}
          />
          <Field
            label="Shipping rate (AUD)"
            type="number"
            value={slab.rate}
            onChange={value => update(index, "rate", value)}
          />
          <div className="flex items-end">
            <button
              type="button"
              disabled={slabs.length === 1}
              onClick={() => onChange(slabs.filter((_, i) => i !== index))}
              className="p-2 text-red-600 border border-red-100 rounded-lg disabled:opacity-30"
              aria-label="Remove weight slab"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CityOverrides({ cities, onChange }) {
  const updateCity = (index, changes) => {
    onChange(cities.map((city, i) =>
      i === index ? { ...city, ...changes } : city
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-[#493829]">City-specific rates</h4>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...cities,
              {
                city: "",
                isActive: true,
                weightSlabs: [emptySlab()]
              }
            ])
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#795b35]"
        >
          <Plus size={15} /> Add city
        </button>
      </div>

      {cities.map((city, index) => (
        <div key={index} className="rounded-xl border border-[#eee7dc] p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1">
              <Field
                label="City"
                value={city.city}
                placeholder="Enter city name"
                onChange={value => updateCity(index, { city: value })}
              />
            </div>

            <label className="flex items-center gap-2 pb-3 text-sm text-[#715d50]">
              <input
                type="checkbox"
                checked={city.isActive !== false}
                onChange={event =>
                  updateCity(index, { isActive: event.target.checked })
                }
              />
              Active
            </label>

            <button
              type="button"
              onClick={() => onChange(cities.filter((_, i) => i !== index))}
              className="p-2 mb-2 text-red-600 border border-red-100 rounded-lg"
              aria-label="Remove city override"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="mt-4">
            <WeightSlabs
              slabs={city.weightSlabs || []}
              onChange={weightSlabs => updateCity(index, { weightSlabs })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShippingSettings() {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState(emptyCountry());
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setCountries(await getShippingCountries());
    } catch (err) {
      setError(err.message || "Unable to load shipping countries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  const resetForm = () => {
    setForm(emptyCountry());
    setEditingId("");
    setError("");
    setSuccess("");
  };

  const editCountry = country => {
    setForm({
      country: country.country || "",
      countryCode: country.countryCode || "",
      currency: country.currency || "",
      locale: country.locale || "",
      flag: country.flag || "",
      isActive: country.isActive !== false,
      weightSlabs: country.weightSlabs || [emptySlab()],
      cityOverrides: country.cityOverrides || []
    });

    setEditingId(country._id);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCountry = async event => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        country: form.country.trim(),
        countryCode: form.countryCode.trim().toUpperCase(),
        currency: form.currency.trim().toUpperCase(),
        locale: form.locale.trim()
      };

      if (editingId) {
        await updateShippingCountry(editingId, payload);
        setSuccess("Shipping country updated successfully.");
      } else {
        await createShippingCountry(payload);
        setSuccess("Shipping country added successfully.");
      }

      resetForm();
      await loadCountries();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to save country");
    } finally {
      setSaving(false);
    }
  };

  const toggleCountry = async country => {
    try {
      await updateShippingCountry(country._id, {
        isActive: !country.isActive
      });
      await loadCountries();
    } catch (err) {
      setError(err.message || "Unable to update country");
    }
  };

  const removeCountry = async country => {
    if (!window.confirm(`Delete shipping configuration for ${country.country}?`)) {
      return;
    }

    try {
      await deleteShippingCountry(country._id);
      if (editingId === country._id) resetForm();
      await loadCountries();
      setSuccess("Country configuration deleted.");
    } catch (err) {
      setError(err.message || "Unable to delete country");
    }
  };

  return (
    <div className="p-4 space-y-6 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#493829]">
            Shipping configuration
          </h2>
          <p className="mt-1 text-sm text-[#927e6e]">
            Manage supported countries, currencies and weight-based delivery rates.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCountries}
          className="inline-flex items-center gap-2 rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && (
        <p className="p-3 text-sm text-red-700 rounded-lg bg-red-50">{error}</p>
      )}

      {success && (
        <p className="p-3 text-sm text-green-700 rounded-lg bg-green-50">{success}</p>
      )}

      <form onSubmit={saveCountry} className="space-y-6 rounded-xl border border-[#e8dfd2] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[#493829]">
            {editingId ? "Edit country configuration" : "Add shipping country"}
          </h3>

          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs underline">
              Cancel editing
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Country name"
            value={form.country}
            placeholder="Australia"
            onChange={value => setForm(current => ({ ...current, country: value }))}
          />
          <Field
            label="Country code"
            value={form.countryCode}
            placeholder="AU"
            onChange={value => setForm(current => ({ ...current, countryCode: value }))}
          />
          <Field
            label="Currency code"
            value={form.currency}
            placeholder="AUD"
            onChange={value => setForm(current => ({ ...current, currency: value }))}
          />
          <Field
            label="Locale"
            value={form.locale}
            placeholder="en-AU"
            onChange={value => setForm(current => ({ ...current, locale: value }))}
          />
          <Field
            label="Flag emoji"
            value={form.flag}
            placeholder="🇦🇺"
            onChange={value => setForm(current => ({ ...current, flag: value }))}
          />
          <label className="flex items-center gap-2 self-end pb-3 text-sm text-[#715d50]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={event =>
                setForm(current => ({ ...current, isActive: event.target.checked }))
              }
            />
            Available on website
          </label>
        </div>

        <div className="border-t border-[#eee7dc] pt-5">
          <WeightSlabs
            slabs={form.weightSlabs}
            onChange={weightSlabs => setForm(current => ({ ...current, weightSlabs }))}
          />
        </div>

        <div className="border-t border-[#eee7dc] pt-5">
          <CityOverrides
            cities={form.cityOverrides}
            onChange={cityOverrides => setForm(current => ({ ...current, cityOverrides }))}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#493829] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : editingId ? "Update country" : "Save country"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-[#e8dfd2] px-5 py-3 text-sm"
          >
            Clear form
          </button>
        </div>
      </form>

      <section className="overflow-hidden rounded-xl border border-[#e8dfd2] bg-white">
        <div className="border-b border-[#eee7dc] p-5">
          <h3 className="font-semibold text-[#493829]">Configured countries</h3>
          <p className="mt-1 text-xs text-[#927e6e]">
            Active countries appear in the website country and currency selector.
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-[#927e6e]">Loading countries...</p>
        ) : countries.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#927e6e]">
            No shipping countries configured yet.
          </p>
        ) : (
          <div className="divide-y divide-[#eee7dc]">
            {countries.map(country => (
              <div
                key={country._id}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center min-w-0 gap-3">
                  <span className="text-2xl">{country.flag || "🌍"}</span>
                  <div>
                    <p className="font-medium text-[#493829]">{country.country}</p>
                    <p className="text-xs text-[#927e6e]">
                      {country.countryCode} · {country.currency} ·{" "}
                      {country.weightSlabs?.length || 0} default slabs ·{" "}
                      {country.cityOverrides?.length || 0} city overrides
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs ${
                    country.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-stone-100 text-stone-500"
                  }`}>
                    {country.isActive ? "Active" : "Inactive"}
                  </span>

                  <button
                    type="button"
                    onClick={() => editCountry(country)}
                    className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCountry(country)}
                    className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-xs"
                  >
                    {country.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeCountry(country)}
                    className="p-2 text-red-600 border border-red-100 rounded-lg"
                    aria-label={`Delete ${country.country}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}