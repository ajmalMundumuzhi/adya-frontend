import { SITE } from '../../config/site';

export default function HeaderContact() {
  return (
    <div className="hidden items-start gap-8 xl:flex">
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-semibold leading-tight text-ink">Call Us</span>
        <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="text-sm text-ink/70 hover:text-burgundy">
          {SITE.phone}
        </a>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-semibold leading-tight text-ink">Any questions</span>
        <a href={`mailto:${SITE.email}`} className="text-sm text-ink/70 hover:text-burgundy">
          {SITE.email}
        </a>
      </div>
    </div>
  );
}