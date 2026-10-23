import { useCallback, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import useCurrency from '../../hooks/useCurrency';
import CountryModal from './CountryModal';

const TRIGGER_STYLES = {
  header:
    'h-10 gap-1.5 rounded-full border border-burgundy/25 bg-white/40 px-3 text-xs font-semibold tracking-wide text-ink hover:bg-white/70',
  drawer:
    'w-full justify-between gap-3 rounded-xl border border-burgundy/20 bg-white/50 px-4 py-3 text-sm font-medium text-ink hover:bg-white/80',
  footer:
    'gap-2 rounded-full border border-ivory-100/30 bg-ivory-100/10 px-4 py-3 text-sm text-ivory-100 hover:bg-ivory-100/20',
};

export default function CountrySelector({ variant = 'header' }) {
  const { country } = useCurrency();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Change destination and currency. Current: ${country.name}, ${country.currency}`}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center transition-colors ${TRIGGER_STYLES[variant]}`}
      >
        <span className="inline-flex items-center gap-2">
          <Globe size={16} aria-hidden="true" />
          {variant === 'header' ? (
            <span>
              {country.code}
              <span className="hidden text-ink/60 sm:inline"> &middot; {country.currency}</span>
            </span>
          ) : (
            <span>
              {country.name} ({country.currency})
            </span>
          )}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && <CountryModal onClose={close} />}
    </>
  );
}