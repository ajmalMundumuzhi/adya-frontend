import { SOCIAL_LINKS } from '../../config/navigation';
import { FacebookIcon, InstagramIcon, WhatsappIcon, YoutubeIcon } from './SocialIcons';

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
};

export default function SocialLinks({ className = '', itemClassName = '' }) {
  return (
    <ul className={`items-center gap-1 ${className}`}>
      {SOCIAL_LINKS.map(({ key, label, href }) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (opens in a new tab)`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${itemClassName}`}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}