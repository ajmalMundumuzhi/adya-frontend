import Logo from '../common/Logo';
import CountrySelector from '../common/CountrySelector';
import NewsletterForm from '../common/NewsletterForm';
import SocialLinks from '../common/SocialLinks';
import FooterSection from './FooterSection';
import { COMPANY_LINKS, SERVICE_LINKS, SHOP_LINKS } from '../../config/navigation';
import { RATES_DISCLAIMER } from '../../config/currency';
import { SITE } from '../../config/site';
import useCurrency from '../../hooks/useCurrency';

export default function Footer() {
  const { country } = useCurrency();

  return (
    <footer className="mt-20 bg-gradient-to-b from-burgundy-800 to-burgundy-900 text-ivory-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="glass-dark rounded-2xl p-6 sm:p-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Join the {SITE.name} circle</h2>
            <p className="mt-2 text-sm leading-relaxed text-ivory-100/80 sm:text-base">
              Be the first to hear about new handloom arrivals, festive edits and artisan stories.
            </p>
          </div>
          <NewsletterForm className="mt-6 lg:mt-0" />
        </div>

        <div className="mt-12 grid gap-x-10 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="mb-8 md:col-span-3 lg:col-span-1 lg:mb-0">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-100/80">{SITE.description}</p>
            <SocialLinks
              className="-ml-2 mt-4 flex"
              itemClassName="text-ivory-100/80 hover:bg-ivory-100/10 hover:text-gold-light"
            />
          </div>
          <FooterSection title="Shop" links={SHOP_LINKS} />
          <FooterSection title="Customer Service" links={SERVICE_LINKS} />
          <FooterSection title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-ivory-100/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-ivory-100/70">
            <p>
              &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-ivory-100/60">
              Shipping to {country.name}. Prices shown in {country.currency}. {RATES_DISCLAIMER}
            </p>
          </div>
          <div className="self-start md:self-auto">
            <CountrySelector variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}