
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function FooterSection({ title, links }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="border-b border-[#493829]/20 md:border-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className="flex min-h-12 w-full items-center justify-between text-left font-display text-xl font-semibold text-[#493829] transition-colors hover:text-[#B49A68] md:pointer-events-none md:min-h-0 md:cursor-default md:pb-5"
        >
          {title}
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`text-[#493829] transition-transform md:hidden ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <ul
        id={listId}
        className={`space-y-1 pb-4 md:block md:space-y-3 md:pb-0 ${open ? 'block' : 'hidden'}`}
      >
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="inline-flex min-h-10 items-center text-sm font-medium text-[#493829]/90 transition-colors hover:text-[#B49A68] md:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
