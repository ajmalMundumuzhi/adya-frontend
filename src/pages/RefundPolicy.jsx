import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, RefreshCw } from 'lucide-react';

const sections = [
  { id: 'faulty-goods', title: 'Faulty, damaged, incorrect or misdescribed goods' },
  { id: 'return-costs', title: 'Return costs for a product problem' },
  { id: 'how-to-return', title: 'How to return an item' },
  { id: 'refunds-exchanges', title: 'Refunds and exchanges' },
];

const sectionHeadingClass =
  'mb-4 font-display text-2xl font-medium leading-snug text-[#493829] sm:text-3xl';

const paragraphClass =
  'mb-4 text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8';

const RefundPolicy = () => {
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
            <RefreshCw size={18} strokeWidth={1.5} />
            Shopping with confidence
          </div>

          <h1 className="max-w-3xl mt-5 text-4xl font-medium leading-tight font-display sm:text-5xl lg:text-6xl">
            Returns &amp; Refunds Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#493829]/75 sm:text-base sm:leading-8">
            Find out how to contact us about a product problem, arrange a
            return, and understand the refund process when shopping with
            Adya by Anjana.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#493829]/65 sm:text-sm">
            <span className="rounded-full border border-[#B49A68]/40 bg-[#F8F3E8]/65 px-4 py-2">
              Adya by Anjana
            </span>
            <span>Returns, remedies and refunds</span>
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

              <Link
                to="/privacy-policy"
                className="group mt-4 flex items-center justify-between gap-3 text-sm font-medium text-[#8D7045] transition hover:text-[#493829]"
              >
                Privacy Policy
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
            id="faulty-goods"
            className="scroll-mt-28 border-b border-[#493829]/10 pb-8 sm:pb-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              01 / Product issues
            </p>

            <h2 className={sectionHeadingClass}>
              1. Faulty, damaged, incorrect or misdescribed goods
            </h2>

            <p className={paragraphClass}>
              Contact us with proof of purchase and details of the issue. Photos
              can help, but an unboxing video is must. We may reasonably assess
              the goods before deciding the remedy.
            </p>

            <p className={paragraphClass}>
              For a major failure, you may reject the goods and choose a refund
              or replacement. Alternatively, you may keep them and claim
              compensation for their reduced value. For a minor failure, we
              will arrange a free remedy within a reasonable time. If we do not
              remedy it in a reasonable time, further rights may include
              obtaining a repair elsewhere and recovering reasonable costs, or
              rejecting the goods and seeking a refund or replacement.
            </p>
          </section>

          <section
            id="return-costs"
            className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              02 / Return postage
            </p>

            <h2 className={sectionHeadingClass}>
              3. Return costs for a product problem
            </h2>

            <p className={paragraphClass}>
              Please contact us for return arrangements. If the product fails
              to meet a consumer guarantee, we pay reasonable return costs and
              provide any refund of original delivery charges required by law.
            </p>
          </section>

          <section
            id="how-to-return"
            className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              03 / Return process
            </p>

            <h2 className={sectionHeadingClass}>4. How to return an item</h2>

            <p className={paragraphClass}>
              Email{' '}
              <a
                href="mailto:support@adyabyanjana.com.au"
                className="font-medium text-[#8D7045] underline decoration-[#B49A68]/60 underline-offset-4 transition hover:text-[#493829]"
              >
                support@adyabyanjana.com.au
              </a>{' '}
              with your order number or other reasonable proof of purchase, the
              item and your reason for return.
            </p>

            <p className={paragraphClass}>
              Tracking is recommended so the parcel can be located; postage
              insurance is optional. Keep your postage receipt. Contacting us
              first helps us process your return, but lack of prior
              authorisation does not itself remove a statutory entitlement.
            </p>
          </section>

          <section
            id="refunds-exchanges"
            className="py-8 scroll-mt-28 sm:py-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              04 / Refund processing
            </p>

            <h2 className={sectionHeadingClass}>6. Refunds and exchanges</h2>

            <p className={paragraphClass}>
              We aim to inspect returns and process an approved refund within
              5 business days after receipt, or sooner where legally required.
              Refunds go to the original payment method unless we agree
              otherwise. Your provider may take additional time to display the
              credit.
            </p>
          </section>

          <div className="mt-4 rounded-2xl border border-[#B49A68]/30 bg-[#D4BC98]/20 p-5 sm:p-7">
            <p className="text-xl font-medium font-display">
              Need help with a return?
            </p>

            <p className="mt-2 text-sm leading-7 text-[#493829]/75">
              Have your order number and relevant product details ready so our
              team can help you with your return enquiry.
            </p>

            <a
              href="mailto:support@adyabyanjana.com.au"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8D7045] transition hover:text-[#493829]"
            >
              Email our support team
              <ArrowUpRight size={16} />
            </a>
          </div>
        </article>
      </section>
    </main>
  );
};

export default RefundPolicy;