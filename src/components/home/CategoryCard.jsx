import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({
  category,
  featured = false,
  showDetails = true,
}) {
  if (featured) {
    return (
      <Link
        to={category.to}
        tabIndex={showDetails ? undefined : -1}
        className="group relative block h-full min-w-0 overflow-hidden bg-[#D4BC98]"
      >
        <img
          src={category.image}
          alt={category.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/65 via-[#493829]/10 to-transparent" />

        {showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-5 text-[#F8F3E8] sm:p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#F8F3E8]/85">
              Discover the collection
            </p>

            <h3 className="mt-2 font-display text-2xl sm:text-3xl">
              {category.name}
            </h3>

            <p className="mt-2 text-sm text-[#F8F3E8]/85">
              {category.label}
            </p>
          </div>
        )}

        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F3E8] text-[#493829] transition-colors group-hover:bg-[#D4BC98] sm:right-4 sm:top-4">
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={category.to}
      className="group block h-full min-w-0 transition-transform duration-300 ease-out hover:-translate-y-1.5 motion-reduce:transform-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#D4BC98]/30 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <img
          src={category.image}
          alt={category.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/65 via-transparent to-transparent" />

        <span className="absolute bottom-4 left-3 right-3 font-display text-lg leading-tight text-[#F8F3E8] sm:bottom-5 sm:text-2xl">
          {category.name}
        </span>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F3E8] text-[#493829] transition-colors group-hover:bg-[#D4BC98]">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-[#493829]/70 sm:text-sm">
        {category.label}
      </p>
    </Link>
  );
}