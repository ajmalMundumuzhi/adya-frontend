import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="overflow-hidden bg-[#493829] text-[#F8F3E8]">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="relative min-h-[360px] md:min-h-[570px]">
          <img
            src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1300&q=85"
            alt="Detail of richly textured traditional Indian fabric"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/60 to-transparent" />
        </div>

        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4BC98]">
            The ADYA point of view
          </p>

          <h2 className="mt-4 max-w-lg font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            A story of texture, colour and belonging.
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#F8F3E8]/85 sm:text-base sm:leading-8">
            A saree can hold a memory, mark a new beginning or simply make an
            ordinary day feel special. ADYA brings together a considered edit
            of Indian-inspired drapes for the moments you make your own.
          </p>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#F8F3E8]/85 sm:text-base sm:leading-8">
            Our story is still being written. Explore the collection and find
            the pieces that speak to your personal style.
          </p>

          <Link
            to="/our-story"
            className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-[#D4BC98]/70 px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#D4BC98] hover:text-[#493829]"
          >
            Discover our story
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}