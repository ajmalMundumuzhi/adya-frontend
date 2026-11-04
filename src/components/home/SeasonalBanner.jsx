
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useHomepageSettings from "../../hooks/useHomeSettings";

export default function SeasonalBanner() {
  const { seasonalBanner } = useHomepageSettings();

  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#493829]">
        <img
          src={seasonalBanner.image}
          alt={seasonalBanner.imageAlt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#493829]/95 via-[#493829]/75 to-[#493829]/25" />

        <div className="relative max-w-2xl px-6 py-14 text-[#F8F3E8] sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4BC98]">
            {seasonalBanner.eyebrow}
          </p>

          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-[#F8F3E8] sm:text-5xl lg:text-6xl">
            {seasonalBanner.title}
          </h2>

          <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#F8F3E8]/90 sm:text-lg">
            {seasonalBanner.description}
          </p>

          <Link
            to="/collections/festive-edit"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full border border-[#B49A68] bg-[#F8F3E8] px-6 py-3 text-base font-semibold text-[#493829] transition-colors hover:bg-[#D4BC98] sm:text-lg"
          >
            {seasonalBanner.linkLabel}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
