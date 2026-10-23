import { MessageCircle, PackageCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { TRUST_BENEFITS } from '../../data/homepage';

const ICONS = { PackageCheck, ShieldCheck, MessageCircle, RefreshCw };

export default function TrustBenefits() {
  return <section className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-4 lg:px-12">{TRUST_BENEFITS.map((item) => { const Icon = ICONS[item.icon]; return <div key={item.title} className="text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-burgundy"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span><h3 className="mt-4 font-display text-xl font-semibold text-burgundy sm:text-2xl">{item.title}</h3><p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-ink/65 sm:text-sm">{item.text}</p></div>; })}</section>;
}
