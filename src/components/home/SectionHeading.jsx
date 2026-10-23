import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, description, linkTo, linkLabel, centered = false }) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between ${centered ? 'text-center sm:flex-col sm:items-center' : ''}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-medium leading-tight text-burgundy sm:text-4xl lg:text-5xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-sm leading-7 text-ink/70 sm:text-base">{description}</p>}
      </div>
      {linkTo && linkLabel && <Link to={linkTo} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-gold pb-1 text-sm font-medium text-burgundy transition-colors hover:text-ink sm:self-auto">{linkLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
    </div>
  );
}
