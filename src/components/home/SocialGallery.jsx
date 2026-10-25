import { InstagramIcon } from '../common/SocialIcons';
import { ArrowUpRight } from 'lucide-react';
import { SOCIAL_IMAGES } from '../../data/homepage';

export default function SocialGallery() {
  return (
    <section
      id="social-gallery"
      className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#B49A68]/15 blur-3xl" />

      <div className="relative mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-9 bg-[#B49A68]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#493829] sm:text-xs">
              The ADYA style journal
            </p>
          </div>

          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-[#493829] sm:text-5xl lg:text-6xl">
            A world of drape
            <span className="block italic text-[#B49A68]">
              and detail.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[#493829]/75 sm:text-base">
            Stories woven in silk, moments dressed in tradition, and the little
            details that make every drape unforgettable.
          </p>
        </div>

        <div className="flex items-center justify-between gap-5 border-y border-[#B49A68]/40 py-4 sm:min-w-[220px] sm:justify-start sm:border-y-0 sm:border-l sm:py-2 sm:pl-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B49A68]/50 bg-[#F8F3E8] text-[#493829]">
              <InstagramIcon size={19} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#493829]">
                ADYA style journal
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#493829]/65">
                Inspired by tradition
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={19}
            className="shrink-0 text-[#B49A68]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {SOCIAL_IMAGES.map((item, index) => (
          <a
            key={item.alt}
            href="#social-gallery"
            aria-label={`Explore the ADYA style journal: ${item.alt}`}
            className={`group relative block overflow-hidden rounded-sm bg-[#D4BC98] shadow-[0_4px_18px_rgba(73,56,41,0.08)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_35px_rgba(73,56,41,0.18)] ${
              index === 1 || index === 4 ? 'hidden sm:block' : ''
            }`}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#F8F3E8]/50 bg-[#F8F3E8]/95 text-[#493829] opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 sm:left-4 sm:top-4">
              <InstagramIcon size={16} aria-hidden="true" />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
              <p className="text-xs leading-5 text-[#F8F3E8] sm:text-sm">
                {item.alt}
              </p>
              <ArrowUpRight
                size={17}
                className="shrink-0 text-[#F8F3E8]"
                aria-hidden="true"
              />
            </div>

            <span className="absolute bottom-3 left-3 h-px w-7 origin-left scale-x-0 bg-[#D4BC98] transition-transform duration-500 group-hover:scale-x-100 sm:bottom-4 sm:left-4" />
          </a>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
        <span className="h-px w-10 bg-[#B49A68]/60" />
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#493829]/65 sm:text-xs">
          Tradition, told beautifully
        </p>
        <span className="h-px w-10 bg-[#B49A68]/60" />
      </div>
    </section>
  );
}