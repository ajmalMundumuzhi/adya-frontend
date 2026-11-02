
import { useState } from "react";
import { createAddress } from "../../services/address.service";

const COUNTRIES = [
  "Australia",
  "New Zealand",
  "United States",
  "Canada",
  "United Kingdom",
  "Malaysia",
  "Singapore"
];

const initialForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Australia",
  addressType: "Home",
  isDefault: false
};

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-stone-700";

export default function CheckoutAddress({
  addresses = [],
  selectedAddressId,
  onSelect,
  onAddressesChange
}) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);

      const address = await createAddress({
        ...form,
        country: form.country
      });

      const newAddress = address?.address || address?.data || address;

      if (!newAddress?._id) {
        throw new Error("Address was saved, but the returned address is invalid. Please refresh your addresses.");
      }

      onAddressesChange([...addresses, newAddress]);
      onSelect(newAddress._id);
      setShowForm(false);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Step 1
          </p>
          <h2 className="mt-1 text-xl font-semibold text-stone-900">
            Delivery address
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(value => !value)}
          className="text-sm font-medium text-stone-700 underline underline-offset-4"
        >
          {showForm ? "Choose saved address" : "Add new address"}
        </button>
      </div>

      {!showForm && (
        <div className="space-y-3">
          {addresses.map(address => (
            <button
              key={address._id}
              type="button"
              onClick={() => onSelect(address._id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedAddressId === address._id
                  ? "border-stone-900 bg-stone-50"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                    selectedAddressId === address._id
                      ? "border-stone-900 bg-stone-900 shadow-[inset_0_0_0_3px_white]"
                      : "border-stone-400"
                  }`}
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-medium text-stone-900">
                    {address.fullName}
                    {address.isDefault && (
                      <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] uppercase tracking-wide text-stone-600">
                        Default
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-stone-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                    <br />
                    {address.phone}
                  </span>
                </span>
              </div>
            </button>
          ))}

          {addresses.length === 0 && (
            <p className="text-sm text-stone-500">
              You haven't saved a delivery address yet.
            </p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Full name"
              value={form.fullName}
              onChange={event => updateField("fullName", event.target.value)}
              required
            />
            <input
              className={inputClass}
              placeholder="Phone number"
              value={form.phone}
              onChange={event => updateField("phone", event.target.value)}
              required
            />
          </div>

          <input
            className={inputClass}
            placeholder="Address line 1"
            value={form.addressLine1}
            onChange={event => updateField("addressLine1", event.target.value)}
            required
          />

          <input
            className={inputClass}
            placeholder="Apartment, suite, landmark (optional)"
            value={form.addressLine2}
            onChange={event => updateField("addressLine2", event.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="City"
              value={form.city}
              onChange={event => updateField("city", event.target.value)}
              required
            />
            <input
              className={inputClass}
              placeholder="State / Province"
              value={form.state}
              onChange={event => updateField("state", event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Postal code"
              value={form.postalCode}
              onChange={event => updateField("postalCode", event.target.value)}
              required
            />

            <select
              className={inputClass}
              value={form.country}
              onChange={event => updateField("country", event.target.value)}
              required
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className={inputClass}
              value={form.addressType}
              onChange={event => updateField("addressType", event.target.value)}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={event => updateField("isDefault", event.target.checked)}
                className="h-4 w-4 accent-stone-900"
              />
              Set as default address
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving address..." : "Save address"}
          </button>
        </form>
      )}
    </section>
  );
}
