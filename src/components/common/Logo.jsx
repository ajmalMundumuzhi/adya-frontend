import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';

export default function Logo({ tone = 'dark', onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${SITE.name} home`}
      className="inline-flex items-center"
    >
      <img
        src="/images/logo.png"
        alt={SITE.name}
        className="h-12 w-auto max-w-[180px] object-contain sm:h-14 sm:max-w-[220px]"
      />
    </Link>
  );
}