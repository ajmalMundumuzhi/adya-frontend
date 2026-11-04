
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FileText,
} from "lucide-react";
import usePolicySettings from "../../hooks/usePolicySettings";

const ICONS = {
  privacy: ShieldCheck,
  terms: FileText,
  returns: RefreshCw,
};

const LINKS = {
  privacy: [
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
    { label: "Returns & Refunds Policy", to: "/return-policy" },
  ],
  terms: [
    { label: "Returns & Refunds Policy", to: "/return-policy" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ],
  returns: [
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ],
};

const sectionHeadingClass =
  "mb-4 font-display text-2xl font-medium leading-snug text-[#493829] sm:text-3xl";

const paragraphClass =
  "mb-4 whitespace-pre-line text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8";

export default function PolicyPage({ policyKey }) {
  const { policy, loading } = usePolicySettings(policyKey);
  const Icon = ICONS[policyKey] || FileText;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F3E8] text-sm text-[#493829]/70">
        Loading policy...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <section className="border-b border-[#B49A68]/25 bg-[#D4BC98]/35">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#493829]/70 transition hover:text-[#493829]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-[#8D7045]">
            <Icon size={18} strokeWidth={1.5} />
            {policy.eyebrow}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            {policy.title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#493829]/75 sm:text-base sm:leading-8">
            {policy.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#493829]/65 sm:text-sm">
            <span className="rounded-full border border-[#B49A68]/40 bg-[#F8F3E8]/65 px-4 py-2">
              Adya by Anjana
            </span>
            <span>{policy.badge}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 lg:px-12">
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-[#B49A68]/25 bg-white/45 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8D7045]">
              On this page
            </p>

            <nav className="mt-5 space-y-1">
              {policy.sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-start gap-3 rounded-lg px-3 py-3 text-sm leading-5 text-[#493829]/75 transition hover:bg-[#D4BC98]/20 hover:text-[#493829]"
                >
                  <span className="mt-0.5 text-xs tabular-nums text-[#B49A68]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1">{section.title}</span>

                  <ChevronRight
                    size={15}
                    className="mt-0.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>

            <div className="mt-5 space-y-4 border-t border-[#493829]/10 pt-5">
              {LINKS[policyKey].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center justify-between gap-3 text-sm font-medium text-[#8D7045] transition hover:text-[#493829]"
                >
                  {link.label}
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          {policy.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={`scroll-mt-28 border-[#493829]/10 py-8 sm:py-10 ${
                index !== policy.sections.length - 1 ? "border-b" : ""
              } ${index === 0 ? "pt-0" : ""}`}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
                {section.label}
              </p>

              <h2 className={sectionHeadingClass}>{section.title}</h2>

              {section.content.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className={paragraphClass}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <div className="mt-4 rounded-2xl border border-[#B49A68]/30 bg-[#D4BC98]/20 p-5 sm:p-7">
            <p className="font-display text-xl font-medium">
              {policy.contactTitle}
            </p>

            <p className="mt-2 text-sm leading-7 text-[#493829]/75">
              {policy.contactDescription}
            </p>

            {policyKey === "returns" ? (
              <a
                href="mailto:support@adyabyanjana.com.au"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8D7045] transition hover:text-[#493829]"
              >
                {policy.contactLabel}
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <Link
                to="/our-story"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8D7045] transition hover:text-[#493829]"
              >
                {policy.contactLabel}
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
