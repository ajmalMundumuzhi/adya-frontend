
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SOCIAL_LINKS } from "../../config/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./SocialIcons";

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
};

export default function SocialLinks({
  className = "",
  itemClassName = "",
}) {
  const [links, setLinks] = useState(SOCIAL_LINKS);

  useEffect(() => {
    let active = true;

    async function loadSocialLinks() {
      try {
        const response = await api.get("/settings/site.socialMedia");
        const saved = response.data?.data?.value;

        if (active && Array.isArray(saved)) {
          setLinks(saved);
        }
      } catch (error) {
        console.error("Failed to load social media links:", error);
      }
    }

    loadSocialLinks();

    return () => {
      active = false;
    };
  }, []);

  const visibleLinks = links.filter(
    (item) =>
      item.enabled !== false &&
      item.href &&
      ICONS[item.key] &&
      /^https?:\/\//i.test(item.href)
  );

  return (
    <ul className={`items-center gap-1 ${className}`}>
      {visibleLinks.map(({ key, label, href }) => {
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
