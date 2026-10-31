import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Check,
} from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/address.service";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  addressType: "Home",
  isDefault: false,
};

const inputClass =
  "mt-1.5 min-h-11 w-full border border-[#B49A68]/40 bg-white/70 px-3 py-2.5 text-sm text-[#493829] outline-none transition focus:border-[#493829]";

const labelClass = "block text-xs font-medium text-[#493829]/75";

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await getAddresses();
      setAddresses(result);
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to load your saved addresses.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const openAddForm = () => {
    setEditingId("");
    setForm({
      ...EMPTY_FORM,
      isDefault: addresses.length === 0,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (address) => {
    setEditingId(address._id);
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      addressType: address.addressType || "Home",
      isDefault: Boolean(address.isDefault),
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setIsFormOpen(false);
    setEditingId("");
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
      addressType: form.addressType,
      isDefault: form.isDefault,
    };

    try {
      if (editingId) {
        await updateAddress(editingId, payload);
      } else {
        await createAddress(payload);
      }

      setIsFormOpen(false);
      setEditingId("");
      setForm(EMPTY_FORM);
      await loadAddresses();
    } catch (error) {
      setFormError(
        getErrorMessage(error, "Unable to save this address. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!addressId || deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setDeletingId(addressId);
    setPageError("");

    try {
      await deleteAddress(addressId);
      await loadAddresses();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to delete this address.")
      );
    } finally {
      setDeletingId("");
    }
  };

  const handleSetDefault = async (addressId) => {
    setPageError("");

    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to update the default address.")
      );
    }
  };

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
            Delivery details
          </p>
          <h2 className="mt-2 text-3xl font-display sm:text-4xl">
            Saved addresses
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#493829]/65">
            Manage the addresses where you would like your ADYA orders delivered.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#493829] px-5 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
        >
          <Plus size={16} />
          Add new address
        </button>
      </div>

      {pageError && (
        <div className="mt-5 border border-[#8C3A36]/25 bg-[#8C3A36]/5 px-4 py-3 text-sm text-[#8C3A36]">
          {pageError}
        </div>
      )}

      {loading ? (
        <div className="mt-6 border border-[#B49A68]/35 bg-white/35 px-5 py-16 text-center text-sm text-[#493829]/65">
          Loading your saved addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
            <MapPin size={27} strokeWidth={1.4} />
          </div>
          <h3 className="mt-5 text-2xl font-display">
            No saved addresses yet
          </h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
            Add your delivery address to make your next ADYA purchase easier.
          </p>
          <button
            type="button"
            onClick={openAddForm}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
          >
            <Plus size={16} />
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 mt-6 xl:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="border border-[#B49A68]/35 bg-white/40 p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D4BC98]/45">
                    <MapPin size={19} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-[#493829]">
                        {address.fullName}
                      </h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-[#D4BC98]/45 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#493829]">
                          <Star size={11} />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#8B7047]">
                      {address.addressType || "Other"} address
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-1 text-sm leading-6 text-[#493829]/75">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                <p className="pt-2">{address.phone}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#493829]/10 pt-4">
                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#493829] transition hover:text-[#8B7047]"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address._id)}
                  disabled={deletingId === address._id}
                  className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#8C3A36] transition hover:text-[#6F2926] disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  {deletingId === address._id ? "Removing..." : "Delete"}
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address._id)}
                    className="ml-auto inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#493829] transition hover:text-[#8B7047]"
                  >
                    <Star size={13} />
                    Set as default
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#211A15]/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-form-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#B49A68]/40 bg-[#F8F3E8] p-5 shadow-xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#B49A68]/30 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                  Delivery details
                </p>
                <h3
                  id="address-form-title"
                  className="mt-2 text-2xl font-display sm:text-3xl"
                >
                  {editingId ? "Edit address" : "Add a new address"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close address form"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#493829]/20 transition hover:bg-[#D4BC98]/30 disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Full name *
                  <input
                    className={inputClass}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Phone number *
                  <input
                    className={inputClass}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Address line 1 *
                  <input
                    className={inputClass}
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    autoComplete="address-line1"
                    required
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Address line 2
                  <input
                    className={inputClass}
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    autoComplete="address-line2"
                  />
                </label>

                <label className={labelClass}>
                  City *
                  <input
                    className={inputClass}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />
                </label>

                <label className={labelClass}>
                  State *
                  <input
                    className={inputClass}
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Postal code *
                  <input
                    className={inputClass}
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Country *
                  <input
                    className={inputClass}
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    autoComplete="country-name"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Address type
                  <select
                    className={inputClass}
                    name="addressType"
                    value={form.addressType}
                    onChange={handleChange}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="flex min-h-12 items-center gap-2 self-end text-sm text-[#493829]/80">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#493829]"
                  />
                  Set as default address
                </label>
              </div>

              {formError && (
                <p className="mt-4 border border-[#8C3A36]/25 bg-[#8C3A36]/5 px-3 py-2.5 text-sm text-[#8C3A36]">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#B49A68]/30 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="min-h-11 border border-[#493829]/35 px-5 py-3 text-sm font-medium text-[#493829] transition hover:bg-[#D4BC98]/25 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition hover:bg-[#5B4835] disabled:opacity-60"
                >
                  <Check size={16} />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Save address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}