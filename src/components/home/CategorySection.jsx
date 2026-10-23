import { SAREE_CATEGORIES } from '../../data/homepage';
import SectionHeading from './SectionHeading';
import CategoryCard from './CategoryCard';

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <SectionHeading
        eyebrow="Find your drape"
        title="Explore saree traditions"
        description="Discover textures, techniques and timeless silhouettes for every kind of occasion."
        centered
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {SAREE_CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.name}
            category={category}
            featured={index === 0 || index === 5}
          />
        ))}
      </div>
    </section>
  );
}
