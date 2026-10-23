import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import useDismiss from '../../hooks/useDismiss';

export default function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  useDismiss(panelRef, open, onClose, '[data-search-toggle]');

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(value)}`);
    setQuery('');
    onClose();
  };

  return (
    <div
      ref={panelRef}
      id="header-search-panel"
      className="absolute inset-x-0 top-full z-40 animate-fade-in border-b border-burgundy/30 bg-ivory-100/90 shadow-glass backdrop-blur-xl"
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6"
      >
        <label htmlFor="header-search-input" className="sr-only">
          Search sarees
        </label>
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/50"
          />
          <input
            ref={inputRef}
            id="header-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sarees, fabrics, collections"
            className="h-12 w-full rounded-full border border-burgundy/25 bg-white/70 pl-11 pr-4 text-base text-ink placeholder:text-ink/50"
          />
        </div>
        <button
          type="submit"
          className="h-12 rounded-full bg-burgundy px-5 text-sm font-semibold text-ivory-100 transition-colors hover:bg-burgundy-700"
        >
          Search
        </button>
        <button type="button" onClick={onClose} aria-label="Close search" className="icon-btn shrink-0">
          <X size={20} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}