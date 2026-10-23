import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category, featured = false }) {
  return (
    <Link
      to={category.to}
      className={`group block ${
        featured ? 'sm:translate-y-3' : ''
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#e9dfd0]">
        <img
          src={category.image}
          alt={category.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#21070e]/75 via-transparent to-transparent" />

        <span className="absolute bottom-4 left-3 right-3 text-center font-display text-xl leading-tight text-white sm:bottom-5 sm:text-2xl">
          {category.name}
        </span>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory-50/90 text-burgundy transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-ink/65 sm:text-sm">
        {category.label}
      </p>
    </Link>
  );
}