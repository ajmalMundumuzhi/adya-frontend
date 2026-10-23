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
      className="glass-announcement"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center gap-4 px-4 py-1.5 sm:px-6 md:justify-between lg:px-8">
        <p
          key={message.id}
          className="animate-fade-in text-center text-[11px] leading-snug tracking-wide sm:text-xs md:text-left md:text-[13px]"
        >
          {message.text}
          {message.amountInr ? (
            <>
              {' '}
              <strong className="font-semibold text-gold-light">{formatPrice(message.amountInr)}</strong>
            </>
          ) : null}
        </p>
        <SocialLinks
          className="-my-1 hidden shrink-0 md:flex"
          itemClassName="text-ivory-100/80 hover:bg-ivory-100/10 hover:text-gold-light"
        />
      </div>
    </div>
  );
}