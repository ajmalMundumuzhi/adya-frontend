
import { useEffect, useState } from "react";
import api from "../../services/api";
import Logo from "../common/Logo";
import CountrySelector from "../common/CountrySelector";
import SocialLinks from "../common/SocialLinks";
import FooterSection from "./FooterSection";
import {
  COMPANY_LINKS,
  SERVICE_LINKS,
  SHOP_LINKS
} from "../../config/navigation";
import { RATES_DISCLAIMER } from "../../config/currency";
import { SITE } from "../../config/site";
import useCurrency from "../../hooks/useCurrency";

const DEFAULT_SETTINGS = {
  description: SITE.description,
  shopTitle: "Shop",
  serviceTitle: "Customer Service",
  companyTitle: "Company",
  shopLinks: SHOP_LINKS,
  serviceLinks: SERVICE_LINKS.filter(link => link.to !== "/faqs"),
  companyLinks: COMPANY_LINKS,
  copyrightText: "All rights reserved.",
  designerText: "Designed by",
  designerName: "RDR Technologies",
  designerUrl: "https://www.instagram.com/rdr.technology/"
};

export default function Footer() {
  const { country } = useCurrency();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await api.get("/settings/site.footer");
        const saved = response.data?.data?.value;

        if (active && saved) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...saved,
            shopLinks: saved.shopLinks || DEFAULT_SETTINGS.shopLinks,
            serviceLinks:
              saved.serviceLinks || DEFAULT_SETTINGS.serviceLinks,
            companyLinks:
              saved.companyLinks || DEFAULT_SETTINGS.companyLinks
          });
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const designerUrl = /^https?:\/\//i.test(settings.designerUrl)
    ? settings.designerUrl
    : "";

  return (
    <footer className="mt-20 bg-gradient-to-b from-[#D4BC98] to-[#F8F3E8] text-[#493829]">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
        <div className="mt-12 grid gap-x-10 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="mb-8 text-center md:col-span-3 lg:col-span-1 lg:mb-0 lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Logo tone="dark" />
            </div>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#493829] lg:mx-0">
              {settings.description}
            </p>

            <SocialLinks
              className="flex justify-center mt-4 lg:justify-start"
              itemClassName="text-[#493829] hover:bg-[#D4BC98]/50 hover:text-[#493829]"
            />
          </div>

          <FooterSection
            title={settings.shopTitle}
            links={settings.shopLinks}
          />

          <FooterSection
            title={settings.serviceTitle}
            links={settings.serviceLinks}
          />

          <FooterSection
            title={settings.companyTitle}
            links={settings.companyLinks}
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-[#493829]/25 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-[#493829]">
            <p>
              &copy; {new Date().getFullYear()} {SITE.name}.{" "}
              {settings.copyrightText}
            </p>

            {country && (
              <p className="max-w-xl text-xs leading-relaxed text-[#493829]/85">
                Shipping to {country.name}. Prices shown in {country.currency}.{" "}
                {RATES_DISCLAIMER}
              </p>
            )}
          </div>

          <div className="self-start md:self-auto">
            <CountrySelector variant="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#493829]/25 px-4 py-4 text-center text-xs text-[#493829] sm:text-sm">
        {settings.designerText}{" "}
        {designerUrl ? (
          <a
            href={designerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#493829] transition-colors hover:text-[#B49A68] hover:underline"
          >
            {settings.designerName}
          </a>
        ) : (
          <span className="font-semibold">{settings.designerName}</span>
        )}
      </div>
    </footer>
  );
}
