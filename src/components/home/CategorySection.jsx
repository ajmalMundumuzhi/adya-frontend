import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SAREE_CATEGORIES } from '../../data/homepage';
import CategoryCard from './CategoryCard';

export default function CategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const categories = SAREE_CATEGORIES || [];

  useEffect(() => {
    if (categories.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories.length]);

  if (!categories.length) return null;

  const activeCategory = categories[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? categories.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % categories.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    touchEndX.current = event.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  return (
    <section className="overflow-hidden bg-[#F8F3E8]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#493829]/75 sm:text-xs">
              Find your favourite drape
            </p>

            <h2 className="mt-4 max-w-md font-display text-4xl font-medium leading-tight tracking-tight text-[#493829] sm:text-5xl lg:text-6xl">
              Explore saree traditions
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#493829]/75 sm:text-base sm:leading-8">
              Discover textures, techniques and timeless silhouettes for every
              kind of occasion.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-4 border border-[#B49A68]/70 px-6 py-3 text-sm font-medium text-[#493829] transition-colors hover:bg-[#D4BC98] sm:mt-8"
            >
              View our collection
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-display text-lg text-[#493829]">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>

              <div className="h-px w-12 bg-[#B49A68]/50">
                <div
                  className="h-px bg-[#493829] transition-all duration-500"
                  style={{
                    width: `${((activeIndex + 1) / categories.length) * 100}%`,
                  }}
                />
              </div>

              <span className="text-xs text-[#493829]/55">
                {String(categories.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div
            className="relative min-w-0"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative overflow-hidden bg-[#EFE5D6]">
              <div className="relative aspect-[4/5] max-h-[620px] w-full">
                {categories.map((category, index) => (
                  <div
                    key={category.name}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeIndex
                        ? 'translate-x-0 scale-100 opacity-100'
                        : index < activeIndex
                          ? '-translate-x-8 scale-[0.98] opacity-0'
                          : 'translate-x-8 scale-[0.98] opacity-0'
                    }`}
                    aria-hidden={index !== activeIndex}
                  >
                    <CategoryCard
                      category={category}
                      featured
                      showDetails={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-xl text-[#493829] sm:text-2xl">
                  {activeCategory.name}
                </p>

                <p className="mt-1 truncate text-xs text-[#493829]/65 sm:text-sm">
                  {activeCategory.label}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous category"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B49A68]/50 text-[#493829] transition-colors hover:bg-[#D4BC98]"
                >
                  <ArrowLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next category"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B49A68]/50 text-[#493829] transition-colors hover:bg-[#D4BC98]"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${category.name}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-[#493829]'
                      : 'w-2 bg-[#B49A68]/50 hover:bg-[#B49A68]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-[#493829] sm:text-3xl">
                More ways to drape
              </h3>

              <Link
                to="/shop"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-[#493829] transition-colors hover:text-[#B49A68] sm:text-sm"
              >
                View all
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-5 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories
                .filter((_, index) => index !== activeIndex)
                .map((category) => (
                  <div
                    key={category.name}
                    className="w-[68%] min-w-[68%] shrink-0 snap-start sm:w-[36%] sm:min-w-[36%] md:w-[28%] md:min-w-[28%] lg:w-[22%] lg:min-w-[22%]"
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}