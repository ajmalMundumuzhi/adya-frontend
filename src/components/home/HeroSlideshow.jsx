import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../data/homepage';

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (hovered || reducedMotion || HERO_SLIDES.length < 2) {
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timerRef.current);
  }, [hovered, reducedMotion]);

  const move = (direction) => {
    setActive(
      (current) =>
        (current + direction + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const slide = HERO_SLIDES[active];

  return (
    <section
      aria-label="Featured saree collections"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-burgundy-900"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;

        const delta =
          event.changedTouches[0].clientX - touchStart.current;

        if (Math.abs(delta) > 55) {
          move(delta < 0 ? 1 : -1);
        }

        touchStart.current = null;
      }}
    >
      <div className="relative z-10 mx-auto flex min-h-[480px] max-w-7xl items-center px-5 pb-24 pt-12 sm:min-h-[540px] sm:px-8 sm:pt-16 lg:min-h-[min(680px,calc(100svh-225px))] lg:px-12">
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.title}
            aria-hidden={index !== active}
            className={`absolute inset-0 ${
              index === active ? 'opacity-100' : 'opacity-0'
            } ${
              reducedMotion
                ? 'transition-none'
                : 'transition-opacity duration-700'
            }`}
          >
            <img
              src={item.image}
              alt={item.alt}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: item.position }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#20070d]/80 via-[#20070d]/45 to-[#20070d]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20070d]/45 via-transparent to-[#20070d]/10" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-5 pb-24 pt-16 sm:min-h-[640px] sm:px-8 lg:min-h-[min(720px,calc(100svh-120px))] lg:px-12">
          <div key={slide.title} className="max-w-2xl text-ivory-50">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light sm:text-sm">
              {slide.eyebrow}
            </p>

            <h1 className="max-w-xl font-display text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              {slide.title}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-ivory-50/90 sm:text-lg sm:leading-8">
              {slide.description}
            </p>

            <Link
              to={slide.to}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-ivory-50 px-7 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {slide.cta}
              <ArrowRight size={17} className="ml-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-6 sm:px-8 sm:pb-8 lg:px-12">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Choose featured slide"
        >
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1}: ${item.title}`}
              aria-current={active === index ? 'true' : undefined}
              className={`h-2.5 rounded-full ${
                reducedMotion ? '' : 'transition-all'
              } ${
                active === index
                  ? 'w-9 bg-gold-light'
                  : 'w-2.5 bg-ivory-50/65 hover:bg-ivory-50'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory-50/40 text-ivory-50 transition-colors hover:bg-ivory-50/15"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory-50/40 text-ivory-50 transition-colors hover:bg-ivory-50/15"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {active + 1} of {HERO_SLIDES.length}: {slide.title}
      </p>
    </section>
  );
}