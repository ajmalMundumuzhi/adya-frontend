
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Image as ImageIcon, RefreshCw } from "lucide-react";
import {
  getBanners,
  deactivateBanner
} from "../../services/admin/banners.service";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadBanners = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBanners();
      setBanners(data);
    } catch (err) {
      setError(err.message || "Unable to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  async function handleDeactivate(id) {
    if (!window.confirm("Deactivate this banner? It will no longer appear on the homepage.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await deactivateBanner(id);
      await loadBanners();
    } catch (err) {
      setError(err.message || "Unable to deactivate banner");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7c]">
            Store content
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4b2927]">
            Hero Banners
          </h1>
          <p className="mt-1 text-sm text-[#927e6e]">
            Manage the banners displayed on your homepage.
          </p>
        </div>

        <Link
          to="/admin/banners/add"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5b302e] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#442321]"
        >
          <Plus size={17} />
          Add Banner
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#927e6e]">
          Loading banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#dfd3c6] bg-white px-6 py-16 text-center">
          <ImageIcon size={32} className="mx-auto text-[#a18c7c]" />
          <h2 className="mt-4 font-semibold text-[#4b2927]">
            No banners yet
          </h2>
          <p className="mt-2 text-sm text-[#927e6e]">
            Add your first homepage banner.
          </p>
          <Link
            to="/admin/banners/add"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5b302e] px-4 py-3 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Create Banner
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#eee8df] bg-white">
          <div className="flex items-center justify-between border-b border-[#eee8df] px-5 py-4">
            <p className="text-sm font-medium text-[#624b40]">
              {banners.length} banner{banners.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={loadBanners}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#715d50] hover:bg-[#f5f0e9]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="divide-y divide-[#eee8df]">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="grid gap-4 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:p-5"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || banner.title}
                  className="h-28 w-full rounded-xl bg-[#f5f0e9] object-cover sm:h-24"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-[#4b2927]">
                      {banner.title}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        banner.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-[#f1eee9] text-[#927e6e]"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[#927e6e]">
                    {banner.description || "No description"}
                  </p>
                  <p className="mt-2 text-xs text-[#a18c7c]">
                    Display order: {banner.displayOrder}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/banners/${banner._id}/edit`}
                    aria-label={`Edit ${banner.title}`}
                    className="rounded-lg border border-[#e9e1d7] p-2.5 text-[#715d50] hover:bg-[#f5f0e9]"
                  >
                    <Pencil size={17} />
                  </Link>

                  {banner.isActive && (
                    <button
                      type="button"
                      onClick={() => handleDeactivate(banner._id)}
                      disabled={deletingId === banner._id}
                      aria-label={`Deactivate ${banner.title}`}
                      className="rounded-lg border border-red-100 p-2.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
