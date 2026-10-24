
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={category.to}
      className="group block h-full min-w-0 transition-transform duration-300 ease-out hover:-translate-y-2 motion-reduce:transform-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F5E6C8] shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        <img
          src={category.image}
          alt={category.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />

        <span className="absolute bottom-4 left-3 right-3 text-center font-display text-xl leading-tight text-white sm:bottom-5 sm:text-2xl">
          {category.name}
        </span>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF9ED]/95 text-[#75633D] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#C4B382]">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-ink/65 transition-colors duration-300 group-hover:text-[#75633D] sm:text-sm">
        {category.label}
      </p>
    </Link>
  );
}
