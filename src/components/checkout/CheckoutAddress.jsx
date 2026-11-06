import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import {
  createAddress,
  updateAddress,
  deleteAddress
} from "../../services/address.service";

const createInitialForm = (country = "") => ({
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country,
  addressType: "Home",
  isDefault: false
});

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-stone-700";

export default function CheckoutAddress({
  addresses = [],
  selectedAddressId,
  onSelect,
  onAddressesChange,
  countries = []
}) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [form, setForm] = useState(() =>
    createInitialForm(countries[0]?.name || countries[0]?.country || "")
  );
  const [saving, setSaving] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!countries.length || editingAddressId) return;

    setForm(current => {
      const available = countries.some(
        country => (country.name || country.country) === current.country
      );

      if (available) return current;

      return {
        ...current,
        country: countries[0].name || countries[0].country
      };
    });
  }, [countries, editingAddressId]);

  const updateField = (field, value) => {
    setForm(current => ({
      ...current,
      [field]: value
    }));
  };

  const resetForm = () => {
    setEditingAddressId("");
    setForm(createInitialForm(countries[0]?.name || countries[0]?.country || ""));
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = address => {
    setEditingAddressId(address._id);
    setForm({
      ...createInitialForm(address.country),
      ...address,
      isDefault: Boolean(address.isDefault)
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");

    if (
      !countries.some(
        country => (country.name || country.country) === form.country
      )
    ) {
      setError("Please select a supported delivery country.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
        addressType: form.addressType,
        isDefault: Boolean(form.isDefault)
      };

      const response = editingAddressId
        ? await updateAddress(editingAddressId, payload)
        : await createAddress(payload);

      const savedAddress =
        response?.address ||
        response?.data?.address ||
        response?.data ||
        response;

      if (!savedAddress?._id) {
        throw new Error(
          "Address was saved, but the returned address is invalid. Please refresh your addresses."
        );
      }

      const updatedAddresses = editingAddressId
        ? addresses.map(address =>
            String(address._id) === String(editingAddressId)
              ? savedAddress
              : address
          )
        : [...addresses, savedAddress];

      onAddressesChange(updatedAddresses);
      onSelect(savedAddress._id);
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async address => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the address for ${address.fullName}?`
    );

    if (!confirmed) return;

    setError("");

    try {
      setDeletingAddressId(address._id);
      await deleteAddress(address._id);

      const updatedAddresses = addresses.filter(
        item => String(item._id) !== String(address._id)
      );

      onAddressesChange(updatedAddresses);

      if (String(selectedAddressId) === String(address._id)) {
        const nextAddress =
          updatedAddresses.find(item => item.isDefault) ||
          updatedAddresses[0];

        onSelect(nextAddress?._id || "");
      }

      if (String(editingAddressId) === String(address._id)) {
        resetForm();
        setShowForm(updatedAddresses.length === 0);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete address"
      );
    } finally {
      setDeletingAddressId("");
    }
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <section className="p-5 bg-white border rounded-2xl border-stone-200 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
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
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              openAddForm();
            }
          }}
          className="text-sm font-medium underline text-stone-700 underline-offset-4"
        >
          {showForm ? "Choose saved address" : "Add new address"}
        </button>
      </div>

      {!showForm && (
        <div className="space-y-3">
          {addresses.map(address => {
            const isSelected =
              String(selectedAddressId) === String(address._id);

            return (
              <div
                key={address._id}
                className={`rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-stone-900 bg-stone-50"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(address._id)}
                    aria-label={`Select address for ${address.fullName}`}
                    aria-pressed={isSelected}
                    className="mt-1 shrink-0"
                  >
                    <span
                      className={`block h-4 w-4 rounded-full border ${
                        isSelected
                          ? "border-stone-900 bg-stone-900 shadow-[inset_0_0_0_3px_white]"
                          : "border-stone-400"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelect(address._id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2 font-medium text-stone-900">
                      {address.fullName}
                      {address.isDefault && (
                        <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] uppercase tracking-wide text-stone-600">
                          Default
                        </span>
                      )}
                    </span>

                    <span className="block mt-1 text-sm leading-6 text-stone-600">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.country}
                      <br />
                      {address.phone}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-4 pt-3 mt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => openEditForm(address)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 transition hover:text-stone-950"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    disabled={deletingAddressId === address._id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deletingAddressId === address._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}

          {addresses.length === 0 && (
            <p className="text-sm text-stone-500">
              You haven't saved a delivery address yet.
            </p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-800">
              {editingAddressId ? "Edit address" : "Add a new address"}
            </h3>
            {editingAddressId && (
              <button
                type="button"
                onClick={handleCancelForm}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900"
              >
                <X size={14} />
                Cancel editing
              </button>
            )}
          </div>

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
              type="tel"
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
              disabled={!countries.length}
            >
              {!countries.length && (
                <option value="">Loading countries...</option>
              )}

              {countries.map(country => {
                const name = country.name || country.country;

                return (
                  <option
                    key={country.code || country.countryCode || name}
                    value={name}
                  >
                    {country.flag ? `${country.flag} ` : ""}
                    {name}
                  </option>
                );
              })}
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
                onChange={event =>
                  updateField("isDefault", event.target.checked)
                }
                className="w-4 h-4 accent-stone-900"
              />
              Set as default address
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || !countries.length}
              className="px-5 py-3 text-sm font-medium text-white transition rounded-lg bg-stone-900 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving address..."
                : editingAddressId
                  ? "Update address"
                  : "Save address"}
            </button>

            {editingAddressId && (
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={saving}
                className="px-5 py-3 text-sm font-medium transition border rounded-lg border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && !showForm && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </section>
  );
}
