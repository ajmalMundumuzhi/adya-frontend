
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";

const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMs: 5000,
  messages: [
    {
      id: "promo",
      text: "Discover thoughtful drapes for every kind of occasion.",
    },
    {
      id: "shipping",
      text: "Explore international delivery options at checkout.",
    },
  ],
};

export default function AnnouncementSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await getSetting("site.announcement");

        if (response?.value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.value,
          });
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load announcement settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateSettings(field, value) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setSuccess("");
    setError("");
  }

  function updateMessage(index, field, value) {
    setSettings((current) => ({
      ...current,
      messages: current.messages.map((message, i) =>
        i === index ? { ...message, [field]: value } : message
      ),
    }));

    setSuccess("");
  }

  function addMessage() {
    setSettings((current) => ({
      ...current,
      messages: [
        ...current.messages,
        {
          id: `announcement-${Date.now()}`,
          text: "",
        },
      ],
    }));

    setSuccess("");
  }

  function removeMessage(index) {
    setSettings((current) => ({
      ...current,
      messages: current.messages.filter((_, i) => i !== index),
    }));

    setSuccess("");
  }

  function moveMessage(index, direction) {
    setSettings((current) => {
      const messages = [...current.messages];
      const target = index + direction;

      if (target < 0 || target >= messages.length) {
        return current;
      }

      [messages[index], messages[target]] = [
        messages[target],
        messages[index],
      ];

      return {
        ...current,
        messages,
      };
    });

    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const hasEmptyMessage = settings.messages.some(
      (message) => !message.text.trim()
    );

    if (hasEmptyMessage) {
      setError("Please enter text for every announcement.");
      return;
    }

    if (
      !Number.isInteger(Number(settings.intervalMs)) ||
      Number(settings.intervalMs) < 1000
    ) {
      setError("Rotation interval must be at least 1000 milliseconds.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...settings,
        intervalMs: Number(settings.intervalMs),
      };

      await saveSetting("site.announcement", payload);

      setSettings(payload);
      setSuccess("Announcement settings saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to save announcement settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-sm text-gray-500">
        Loading announcement settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <section className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Announcement Bar
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Control the announcement bar displayed at the top of your website.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(event) =>
                updateSettings("enabled", event.target.checked)
              }
              className="h-4 w-4 accent-stone-900"
            />
            Enabled
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="font-semibold text-gray-900">
          Message Rotation
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Set how frequently the announcement changes.
        </p>

        <div className="mt-5 max-w-xs space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Rotation interval
          </label>

          <select
            value={settings.intervalMs}
            onChange={(event) =>
              updateSettings("intervalMs", Number(event.target.value))
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
          >
            <option value={3000}>3 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={7000}>7 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={15000}>15 seconds</option>
          </select>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              Announcement Messages
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add and organize the messages displayed to customers.
            </p>
          </div>

          <button
            type="button"
            onClick={addMessage}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            + Add Message
          </button>
        </div>

        <div className="space-y-4">
          {settings.messages.map((message, index) => (
            <div
              key={message.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Message {index + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveMessage(index, -1)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === settings.messages.length - 1}
                    onClick={() => moveMessage(index, 1)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-30"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMessage(index)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Message Text
                  </label>

                  <input
                    type="text"
                    value={message.text}
                    onChange={(event) =>
                      updateMessage(index, "text", event.target.value)
                    }
                    placeholder="Enter announcement message"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Optional Amount (INR)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={message.amountInr ?? ""}
                    onChange={(event) =>
                      updateMessage(
                        index,
                        "amountInr",
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value)
                      )
                    }
                    placeholder="Leave empty if not required"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          ))}

          {settings.messages.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No announcement messages. Add your first message.
            </div>
          )}
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Announcement Settings"}
        </button>
      </div>
    </form>
  );
}
