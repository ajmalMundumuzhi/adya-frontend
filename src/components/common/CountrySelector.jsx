
import { useCallback, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import useCurrency from '../../hooks/useCurrency';
import CountryModal from './CountryModal';

const TRIGGER_STYLES = {
  header:
    'h-10 gap-1.5 rounded-full border border-[#B49A68]/40 bg-[#F8F3E8] px-3 text-xs font-semibold tracking-wide text-[#493829] transition-colors hover:bg-[#D4BC98]/40',
  drawer:
    'w-full justify-between gap-3 rounded-xl border border-[#B49A68]/40 bg-[#F8F3E8] px-4 py-3 text-sm font-medium text-[#493829] transition-colors hover:bg-[#D4BC98]/40',
  footer:
    'gap-2 rounded-full border border-[#B49A68]/50 bg-[#F8F3E8] px-4 py-3 text-sm font-medium text-[#493829] transition-colors hover:bg-[#D4BC98]/40',
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
        className={`inline-flex items-center transition-colors ${TRIGGER_STYLES[variant] || TRIGGER_STYLES.header}`}
      >
        <span className="inline-flex items-center gap-2">
          <Globe size={16} aria-hidden="true" />
          {variant === 'header' ? (
            <span>
              {country.code}
              <span className="hidden text-[#493829]/60 sm:inline"> &middot; {country.currency}</span>
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
