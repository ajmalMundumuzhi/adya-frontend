import { useEffect, useState } from "react";
import { Save, RefreshCw, Settings as SettingsIcon, Package } from "lucide-react";
import adminApi from "../../services/admin/admin.api";

export default function Settings() {
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.get(
        "/settings/inventory.lowStockThreshold"
      );

      setThreshold(response.data.data.value);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load inventory settings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSave(event) {
    event.preventDefault();

    const value = Number(threshold);

    if (!Number.isInteger(value) || value < 1 || value > 100000) {
      setError("Enter a whole number between 1 and 100000.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await adminApi.put("/settings/inventory.lowStockThreshold", {
        value
      });

      setThreshold(value);
      setMessage("Inventory settings saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save inventory settings"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          Store configuration
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-stone-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Manage your store's inventory preferences.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="max-w-2xl overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
          <div className="rounded-lg bg-stone-100 p-2 text-stone-700">
            <SettingsIcon size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-stone-900">
              Inventory Management
            </h2>
            <p className="text-xs text-stone-500">
              Configure stock notification preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 p-5">
          <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
            <Package size={20} className="mt-0.5 text-stone-600" />

            <div>
              <p className="text-sm font-medium text-stone-800">
                Low-stock threshold
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                Product sizes with stock at or below this quantity will be
                classified as low stock. Zero stock is classified separately.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Low-stock quantity
            </label>

            <input
              type="number"
              min="1"
              max="100000"
              step="1"
              required
              disabled={loading}
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-500 disabled:bg-stone-50"
              placeholder="Enter quantity"
            />

            <p className="mt-2 text-xs text-stone-400">
              Example: If you enter 10, stock from 1 to 10 will be classified
              as low stock.
            </p>
          </div>

          <div className="rounded-lg border border-stone-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Preview
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-red-50 px-3 py-2 text-red-700">
                0 — Out of stock
              </span>

              <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-700">
                1–{Number(threshold) || 0} — Low stock
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                Above {Number(threshold) || 0} — In stock
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={loadSettings}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-700 disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Reload
            </button>

            <button
              type="submit"
              disabled={loading || saving}
              className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}   