import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';

export default function Logo({ tone = 'dark', onClick }) {
  const light = tone === 'light';

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${SITE.name} home`}
      className="inline-flex items-center gap-2.5"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy font-display text-xl italic text-gold-light ring-1 ring-gold/60 sm:h-11 sm:w-11 sm:text-2xl">
        {SITE.name.charAt(0)}
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-2xl font-semibold tracking-wide sm:text-[2rem] ${
            light ? 'text-ivory-100' : 'text-burgundy'
          }`}
        >
          {SITE.name}
        </span>
        <span
          className={`mt-1 hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:flex ${
            light ? 'text-gold-light' : 'text-ink/70'
          }`}
        >
          <span aria-hidden="true" className="h-px w-5 bg-gold" />
          {SITE.tagline}
          <span aria-hidden="true" className="h-px w-5 bg-gold" />
        </span>
      </span>
    </Link>
  );
}