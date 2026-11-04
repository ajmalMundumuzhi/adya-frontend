export default function SettingsHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-stone-500">
        {description}
      </p>
    </div>
  );
}
