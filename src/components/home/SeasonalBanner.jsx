
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeasonalBanner() {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#493829]">
        <img
          src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1800&q=85"
          alt="Festive Indian occasion-wear inspiration"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#493829]/95 via-[#493829]/75 to-[#493829]/25" />
        <div className="relative max-w-2xl px-6 py-14 text-[#F8F3E8] sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4BC98]">
            The seasonal edit
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-[#F8F3E8] sm:text-5xl lg:text-6xl">
            Seasonal elegance, your way.
          </h2>
          <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#F8F3E8]/90 sm:text-lg">
            A considered selection of rich colours, delicate textures and celebratory drapes for the season ahead.
          </p>
          <Link
            to="/collections/festive-edit"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full border border-[#B49A68] bg-[#F8F3E8] px-6 py-3 text-base font-semibold text-[#493829] transition-colors hover:bg-[#D4BC98] sm:text-lg"
          >
            Explore the seasonal edit
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
