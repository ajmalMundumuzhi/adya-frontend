import CurrencyPreview from '../components/demo/CurrencyPreview';

export default function PlaceholderPage({ title, showPreview = false }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold capitalize text-burgundy sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/70">
        This page is under work.
      </p>
      {showPreview && (
        <div className="mt-10">
          <CurrencyPreview />
        </div>
      )}
    </div>
  );
}