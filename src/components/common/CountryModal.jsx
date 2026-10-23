import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import useCurrency from '../../hooks/useCurrency';
import useScrollLock from '../../hooks/useScrollLock';
import { RATES_DISCLAIMER } from '../../config/currency';

export default function CountryModal({ onClose }) {
  const { country, countries, setCountryCode } = useCurrency();
  const panelRef = useRef(null);
  useScrollLock(true);

  useEffect(() => {
    const selected = panelRef.current?.querySelector('[aria-checked="true"]');
    selected?.focus();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll('button:not([disabled])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleSelect = (code) => {
    setCountryCode(code);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close country selector"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-modal-title"
        className="relative flex max-h-[88vh] w-full max-w-md animate-fade-in flex-col overflow-hidden rounded-2xl border border-gold/50 bg-ivory-100/95 shadow-glass backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
          <div>
            <h2 id="country-modal-title" className="font-display text-2xl font-semibold text-burgundy">
              Choose your destination
            </h2>
            <p className="mt-1 text-sm text-ink/70">Prices will switch to your destination currency.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="icon-btn -mr-2 -mt-1 shrink-0">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div role="radiogroup" aria-labelledby="country-modal-title" className="overflow-y-auto px-3 pb-3">
          {countries.map((option) => {
            const selected = option.code === country.code;
            return (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleSelect(option.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                  selected ? 'bg-burgundy/10' : 'hover:bg-burgundy/5'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy text-xs font-semibold tracking-wider text-gold-light">
                  {option.code}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-base font-medium text-ink">{option.name}</span>
                  <span className="text-xs text-ink/60">
                    {option.currency} &middot; {option.locale}
                  </span>
                </span>
                {selected && <Check size={20} className="shrink-0 text-burgundy" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <p className="border-t border-burgundy/10 px-5 py-3 text-xs leading-relaxed text-ink/60">
          {RATES_DISCLAIMER}
        </p>
      </div>
    </div>,
    document.body,
  );
}