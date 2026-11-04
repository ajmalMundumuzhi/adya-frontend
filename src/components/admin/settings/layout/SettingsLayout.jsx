
export default function SettingsLayout({ children }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
          Store configuration
        </p>
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
          Site Settings
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-stone-500">
          Manage your website content, brand information and store preferences
          from one place.
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 xl:flex-row">
        {children}
      </div>
    </div>
  );
}
