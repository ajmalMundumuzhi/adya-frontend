
import { useRef } from 'react';
import { SAREE_CATEGORIES } from '../../data/homepage';
import SectionHeading from './SectionHeading';
import CategoryCard from './CategoryCard';

export default function CategorySection() {
  const scrollRef = useRef(null);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <SectionHeading
        eyebrow="Find your drape"
        title="Explore saree traditions"
        description="Discover textures, techniques and timeless silhouettes for every kind of occasion."
        centered
      />

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-5 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SAREE_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="w-[72%] min-w-[72%] shrink-0 snap-start sm:w-[42%] sm:min-w-[42%] md:w-[30%] md:min-w-[30%] lg:w-[22%] lg:min-w-[22%]"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}
