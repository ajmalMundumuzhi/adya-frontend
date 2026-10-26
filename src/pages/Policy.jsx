import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, ShieldCheck } from 'lucide-react';

const sections = [
  { id: 'about', title: 'About this policy' },
  { id: 'information', title: 'Information we collect' },
  { id: 'usage', title: 'Why we use information' },
];

const sectionHeadingClass =
  'mb-4 font-display text-2xl font-medium leading-snug text-[#493829] sm:text-3xl';

const paragraphClass =
  'mb-4 text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8';

const Policy = () => {
  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <section className="border-b border-[#B49A68]/25 bg-[#D4BC98]/35">
        <div className="px-5 py-8 mx-auto max-w-7xl sm:px-8 sm:py-12 lg:px-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#493829]/70 transition hover:text-[#493829]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-[#8D7045]">
            <ShieldCheck size={18} strokeWidth={1.5} />
            Your privacy matters
          </div>

          <h1 className="max-w-3xl mt-5 text-4xl font-medium leading-tight font-display sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#493829]/75 sm:text-base sm:leading-8">
            At Adya by Anjana, we value your trust. Learn how we collect,
            use and protect your personal information when you visit our
            website or shop with us.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#493829]/65 sm:text-sm">
            <span className="rounded-full border border-[#B49A68]/40 bg-[#F8F3E8]/65 px-4 py-2">
              Adya by Anjana
            </span>
            <span>Privacy and personal information</span>
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
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-start gap-3 rounded-lg px-3 py-3 text-sm leading-5 text-[#493829]/75 transition hover:bg-[#D4BC98]/20 hover:text-[#493829]"
                >
                  <span className="mt-0.5 text-xs tabular-nums text-[#B49A68]">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1">{section.title}</span>

                  <ChevronRight
                    size={15}
                    className="mt-0.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>

            <div className="mt-5 border-t border-[#493829]/10 pt-5">
              <Link
                to="/terms-and-conditions"
                className="group flex items-center justify-between gap-3 text-sm font-medium text-[#8D7045] transition hover:text-[#493829]"
              >
                Terms &amp; Conditions
                <ArrowUpRight
                  size={16}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          <section
            id="about"
            className="scroll-mt-28 border-b border-[#493829]/10 pb-8 sm:pb-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              01 / Introduction
            </p>

            <h2 className={sectionHeadingClass}>1. About this policy</h2>

            <p className={paragraphClass}>
              Adya by Anjana respects your privacy. This policy explains how
              [Anjana Karun], trading as Adya by Anjana, collects, holds, uses
              and shares personal information when you browse our website, buy
              from us or contact us.
            </p>
          </section>

          <section
            id="information"
            className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              02 / Information collection
            </p>

            <h2 className={sectionHeadingClass}>
              2. Information we collect and how we collect it
            </h2>

            <p className={paragraphClass}>
              We collect information you provide during checkout, account
              registration if available, enquiries, returns or newsletter
              sign-up. This may include your name, email, telephone number,
              billing and delivery addresses, order history, correspondence and
              return information. If you nominate a gift recipient, we receive
              their delivery details from you; please provide only details you
              are authorised to share.
            </p>

            <p className={paragraphClass}>
              Payment providers process payment information. Do not send full
              card details by email or social media. We do not ask for
              sensitive information to buy a saree; please avoid including it
              in messages or return photographs.
            </p>
          </section>

          <section
            id="usage"
            className="py-8 scroll-mt-28 sm:py-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              03 / How we use information
            </p>

            <h2 className={sectionHeadingClass}>
              3. Why we use information
            </h2>

            <ul className="mb-5 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B49A68]" />
                <p className="text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8">
                  To accept payments, fulfil and deliver orders, provide order
                  updates and handle returns and complaints.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B49A68]" />
                <p className="text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8">
                  To answer enquiries, maintain customer records, secure our
                  systems and investigate suspected fraud.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B49A68]" />
                <p className="text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8">
                  To send marketing where we have the required consent and to
                  understand website use through the tools disclosed below.
                </p>
              </li>
            </ul>

            <p className={paragraphClass}>
              If you do not supply information needed to process an order or
              verify a request, we may be unable to complete it. You may browse
              or make general enquiries anonymously or under a pseudonym where
              practical. We need accurate customer and delivery information to
              fulfil purchases.
            </p>
          </section>

          <div className="mt-4 rounded-2xl border border-[#B49A68]/30 bg-[#D4BC98]/20 p-5 sm:p-7">
            <p className="text-xl font-medium font-display">
              Questions about your privacy?
            </p>

            <p className="mt-2 text-sm leading-7 text-[#493829]/75">
              If you have questions about how your information is handled,
              please contact the ADYA team through the contact details
              published on our website.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8D7045] transition hover:text-[#493829]"
            >
              Contact us
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Policy;