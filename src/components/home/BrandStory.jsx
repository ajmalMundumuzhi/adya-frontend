
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import useHomepageSettings from "../../hooks/useHomeSettings";

export default function BrandStory() {
  const { brandStory } = useHomepageSettings();

  return (
    <section className="overflow-hidden bg-[#D4BC98] text-[#493829]">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="relative min-h-[360px] md:min-h-[570px]">
          <img
            src={brandStory.image}
            alt={brandStory.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/25 to-transparent" />
        </div>

        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#493829]/75">
            {brandStory.eyebrow}
          </p>

          <h2 className="mt-4 max-w-lg font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            {brandStory.title}
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#493829]/85 sm:text-base sm:leading-8">
            {brandStory.paragraphOne}
          </p>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#493829]/85 sm:text-base sm:leading-8">
            {brandStory.paragraphTwo}
          </p>

          <Link
            to="/our-story"
            className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-[#493829]/50 px-6 py-3 text-sm font-semibold text-[#493829] transition-colors hover:border-[#B49A68] hover:bg-[#F8F3E8]"
          >
            {brandStory.linkLabel}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
