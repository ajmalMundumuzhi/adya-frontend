
import { Link } from 'react-router-dom';

export default function FooterSection({ title, links }) {
  return (
    <div className="border-b border-[#493829]/20 pb-4 md:border-0 md:pb-0">
      <h3 className="pb-4 font-display text-xl font-semibold text-[#493829] md:pb-5">
        {title}
      </h3>

      <ul className="space-y-1 md:space-y-3">
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
