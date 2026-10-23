import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAREE_CATEGORIES } from '../../data/homepage';
import SectionHeading from './SectionHeading';

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <SectionHeading eyebrow="Find your drape" title="Explore saree traditions" description="Discover textures, techniques and timeless silhouettes for every kind of occasion." centered />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">{SAREE_CATEGORIES.map((category, index) => <Link to={category.to} key={category.name} className={`group ${index === 0 || index === 5 ? 'sm:translate-y-3' : ''}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#e9dfd0]"><img src={category.image} alt={category.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#21070e]/75 via-transparent to-transparent" /><span className="absolute bottom-4 left-3 right-3 text-center font-display text-xl leading-tight text-white sm:bottom-5 sm:text-2xl">{category.name}</span><span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory-50/90 text-burgundy transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight size={16} aria-hidden="true" /></span></div>
        <p className="mt-3 text-center text-xs leading-5 text-ink/65 sm:text-sm">{category.label}</p>
      </Link>)}</div>
    </section>
  );
}
