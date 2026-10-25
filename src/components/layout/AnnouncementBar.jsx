
import { useEffect, useState } from 'react';
import SocialLinks from '../common/SocialLinks';
import useCurrency from '../../hooks/useCurrency';

export default function AnnouncementBar({ messages, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { formatPrice } = useCurrency();
  const total = messages.length;

  useEffect(() => {
    if (paused || total < 2) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % total), intervalMs);
    return () => clearInterval(timer);
  }, [paused, total, intervalMs]);

  if (total === 0) return null;
  const message = messages[index % total];

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="border-b border-[#B49A68]/40 bg-[#D4BC98] text-[#493829]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center gap-4 px-4 py-1.5 sm:px-6 md:justify-between lg:px-8">
        <p
          key={message.id}
          className="animate-fade-in text-center text-xs font-medium leading-snug tracking-wide text-[#493829] sm:text-sm md:text-left"
        >
          {message.text}
          {message.amountInr ? (
            <>
              {' '}
              <strong className="font-semibold text-[#493829]">
                {formatPrice(message.amountInr)}
              </strong>
            </>
          ) : null}
        </p>
        <SocialLinks
          className="-my-1 hidden shrink-0 md:flex"
          itemClassName="text-[#493829] hover:bg-[#F8F3E8]/50 hover:text-[#B49A68]"
        />
      </div>
    </div>
  );
}