
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../data/homepage';

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [headerH, setHeaderH] = useState(165);
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
    const header = document.querySelector('header');
    if (!header) return undefined;
    const measure = () => setHeaderH(Math.round(header.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (hovered || reducedMotion || HERO_SLIDES.length < 2) return undefined;
    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timerRef.current);
  }, [hovered, reducedMotion]);

  const move = (direction) => {
    setActive((current) => (current + direction + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[active];

  return (
    <section
      aria-label="Featured saree collections"
      aria-roledescription="carousel"
      className="relative isolate w-full overflow-hidden bg-[#D4BC98]"
      style={{ '--header-h': `${headerH}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 55) move(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="relative h-[520px] w-full sm:h-[620px] lg:h-[calc(100svh-var(--header-h))] lg:min-h-[600px] lg:max-h-[780px]">
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.title}
            aria-hidden={index !== active}
            className={`absolute inset-0 ${index === active ? 'opacity-100' : 'pointer-events-none opacity-0'} ${reducedMotion ? 'transition-none' : 'transition-opacity duration-700'}`}
          >
            <picture className="absolute inset-0 block h-full w-full">
              <img
                src={item.image}
                alt={item.alt}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 block h-full w-full object-cover"
                style={{ objectPosition: item.position || 'center 20%' }}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-[#493829]/75 via-[#493829]/40 to-transparent sm:from-[#493829]/80 sm:via-[#493829]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#493829]/25 via-transparent to-[#493829]/10" />
          </div>
        ))}

        <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1440px] items-start px-6 pb-24 pt-14 sm:items-center sm:px-10 sm:pb-16 sm:pt-0 lg:px-[7.5%]">
          <div key={slide.title} className="max-w-[660px] text-[#F8F3E8]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D4BC98] sm:text-sm sm:tracking-[0.3em]">
              {slide.eyebrow || 'A celebration of craft'}
            </p>
            <h1 className="max-w-[650px] font-display text-[42px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[clamp(64px,5vw,88px)]">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-[570px] text-base font-medium leading-7 text-[#F8F3E8] sm:mt-7 sm:text-lg sm:leading-9">
              {slide.description}
            </p>
            <Link
              to={slide.to}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-5 border border-[#B49A68] bg-[#F8F3E8] px-6 py-3 text-base font-semibold text-[#493829] transition-colors hover:bg-[#D4BC98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A68] sm:mt-9 sm:min-w-[245px] sm:justify-between sm:px-8"
            >
              {slide.cta || 'Shop new arrivals'}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {HERO_SLIDES.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 pb-5 sm:px-10 sm:pb-7 lg:px-[7.5%]">
            <div className="flex items-center gap-2" role="group" aria-label="Choose featured slide">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={active === index ? 'true' : undefined}
                  className={`h-2 rounded-full ${reducedMotion ? '' : 'transition-all'} ${active === index ? 'w-8 bg-[#F8F3E8]' : 'w-2 bg-[#F8F3E8]/60 hover:bg-[#F8F3E8]'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F8F3E8]/70 text-[#F8F3E8] transition-colors hover:bg-[#F8F3E8]/15 sm:h-11 sm:w-11"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F8F3E8]/70 text-[#F8F3E8] transition-colors hover:bg-[#F8F3E8]/15 sm:h-11 sm:w-11"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          Slide {active + 1} of {HERO_SLIDES.length}: {slide.title}
        </p>
      </div>
    </section>
  );
}