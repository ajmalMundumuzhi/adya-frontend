import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, FileText } from 'lucide-react';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'accounts', title: 'Online store and account information' },
  { id: 'products', title: 'Products, descriptions and availability' },
  { id: 'prices', title: 'Prices, promotions and payments' },
  { id: 'orders', title: 'Orders and acceptance' },
  { id: 'errors', title: 'Errors and corrections' },
  { id: 'delivery', title: 'Delivery and pre-orders' },
  { id: 'cancellations', title: 'Order changes and cancellations' },
  { id: 'reviews', title: 'Reviews, feedback and customer photographs' },
];

const sectionHeadingClass =
  'mb-4 font-display text-2xl font-medium leading-snug text-[#493829] sm:text-3xl';

const paragraphClass =
  'mb-4 text-sm leading-7 text-[#493829]/80 sm:text-base sm:leading-8';

const Terms = () => {
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
            <FileText size={17} strokeWidth={1.5} />
            Legal information
          </div>

          <h1 className="max-w-3xl mt-5 text-4xl font-medium leading-tight font-display sm:text-5xl lg:text-6xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#493829]/75 sm:text-base sm:leading-8">
            Please read these terms carefully before shopping with Adya by
            Anjana. They explain how our online boutique operates and the
            terms that apply when you purchase from us.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#493829]/65 sm:text-sm">
            <span className="rounded-full border border-[#B49A68]/40 bg-[#F8F3E8]/65 px-4 py-2">
              Adya by Anjana
            </span>
            <span>Website use and purchases</span>
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
                to="/returns-refunds"
                className="group flex items-center justify-between gap-3 text-sm font-medium text-[#8D7045] transition hover:text-[#493829]"
              >
                Returns &amp; Refunds Policy
                <ArrowUpRight
                  size={16}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          <section id="overview" className="scroll-mt-28 border-b border-[#493829]/10 pb-8 sm:pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              01 / Introduction
            </p>
            <h2 className={sectionHeadingClass}>1. Overview</h2>

            <p className={paragraphClass}>
              Welcome to Adya by Anjana. Our online boutique offers sarees to
              customers in the delivery locations shown at checkout. In these
              terms, “we”, “us” and “our” mean the legal operator identified
              above. “You” means the person browsing our website or placing an
              order.
            </p>

            <p className={paragraphClass}>
              These terms explain website use and purchases from our store.
              Please read them and our Returns &amp; Refunds Policy before
              ordering.
            </p>
          </section>

          <section id="accounts" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              02 / Your account
            </p>
            <h2 className={sectionHeadingClass}>
              2. Online store and account information
            </h2>

            <p className={paragraphClass}>
              If customer accounts are available, keep your login details
              secure and notify us promptly if you suspect unauthorised access.
              Contact us as soon as possible about incorrect order details. We
              will make reasonable efforts to correct them before dispatch. We
              will not hold you automatically responsible for activity caused
              by a failure of our systems or our own conduct.
            </p>
          </section>

          <section id="products" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              03 / Our collections
            </p>
            <h2 className={sectionHeadingClass}>
              3. Products, descriptions and availability
            </h2>

            <p className={paragraphClass}>
              We sell sarees as described on each product page and do not
              provide stitching or alterations. Check the listed fabric,
              dimensions, care instructions and included pieces before purchase.
              Product listings identify whether a blouse piece is supplied and
              whether it is attached or separate. Jewellery, blouses and other
              styling accessories are included only where the listing expressly
              says so.
            </p>

            <p className={paragraphClass}>
              We aim to represent colours, patterns and details accurately.
              Screen settings and lighting can affect how images appear.
              Handwoven or handmade items may have individual characteristics
              that are explained in the listing. These explanations do not
              excuse material differences from the description, undisclosed
              defects or failures to meet consumer guarantees.
            </p>

            <p className={paragraphClass}>
              Stock may be limited. Any purchase limits, pre-order status and
              delivery restrictions will be disclosed before checkout. We may
              update our range or future availability, but changes will not
              reduce our obligations for an accepted order. Please follow the
              care instructions supplied with your saree.
            </p>
          </section>

          <section id="prices" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              04 / Payments
            </p>
            <h2 className={sectionHeadingClass}>
              4. Prices, promotions and payments
            </h2>

            <p className={paragraphClass}>
              All prices are displayed in Australian dollars (AUD) by default
              and include GST where applicable. You can use the currency
              selector on our website to view saree prices in your preferred
              supported currency. Delivery charges and other applicable charges
              are disclosed before you commit to purchase. Available payment
              methods are shown at checkout. Payment-provider terms may apply
              to their service without reducing your rights against us.
            </p>

            <p className={paragraphClass}>
              Prices may change for future purchases. A price change will not
              alter an accepted order without your agreement. Conditions,
              eligibility, exclusions and expiry dates for promotions will be
              disclosed with the offer. Discounts apply as stated and cannot be
              retrospectively applied unless we agree. We will not add
              undisclosed charges after checkout.
            </p>
          </section>

          <section id="orders" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              05 / Order processing
            </p>
            <h2 className={sectionHeadingClass}>5. Orders and acceptance</h2>

            <p className={paragraphClass}>
              Placing an order is an offer to purchase the selected goods on
              these terms. We send an electronic acknowledgement. An automated
              receipt alone is not acceptance, and we will assess orders
              promptly.
            </p>

            <p className={paragraphClass}>
              Before acceptance, we may decline an order for a genuine reason,
              including unavailable stock, inability to deliver to the
              nominated location or reasonable evidence of unauthorised
              payment. We will explain the reason where lawful and promptly
              refund any payment for a declined order. We will not substitute
              another product without your agreement.
            </p>

            <p className={paragraphClass}>
              After acceptance, we will fulfil the order as agreed. If a genuine
              problem prevents fulfilment, we will contact you promptly to
              discuss a solution. If we cannot supply the affected goods and
              you do not agree to an alternative, we will refund the affected
              purchase and associated delivery charges. We will not require you
              to accept store credit instead of a refund owed to you.
            </p>
          </section>

          <section id="errors" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              06 / Corrections
            </p>
            <h2 className={sectionHeadingClass}>6. Errors and corrections</h2>

            <p className={paragraphClass}>
              If we discover an error in a description, price, promotion or
              availability, we will correct the listing and contact affected
              customers promptly. We will explain your options before asking
              you to agree to a change. We will not rely on a general right to
              correct errors to override an accepted order. If an order cannot
              proceed, refunds will be handled as described above and as
              required by law.
            </p>
          </section>

          <section id="delivery" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              07 / Shipping
            </p>
            <h2 className={sectionHeadingClass}>7. Delivery and pre-orders</h2>

            <p className={paragraphClass}>
              We deliver to the destinations offered at checkout. In-stock
              orders are normally dispatched within [2-3] business days.
              Delivery estimates by destination are [Inside Australia-4-6
              working days and Outside Australia-8-12 working days]. Business
              days exclude weekends and relevant public holidays. Pre-orders
              will show their estimated dispatch date before purchase; we will
              advise you of material delays and explain available options.
            </p>

            <p className={paragraphClass}>
              For international orders, any customs duties, import taxes or
              clearance fees imposed by the destination country are the
              customer’s responsibility. These charges are separate from our
              product prices and shipping fees, unless expressly stated at
              checkout.
            </p>

            <p className={paragraphClass}>
              Please contact us before ordering if delivery by a particular
              date is important. Estimates do not remove your rights if we fail
              to supply as agreed or within a reasonable time. If your parcel is
              lost, damaged or significantly delayed, contact us so we can
              investigate and provide an appropriate solution.
            </p>

            <p className={paragraphClass}>
              If an incorrect address supplied by you requires redelivery, we
              will discuss any reasonable additional cost before arranging it.
            </p>

            <p className={paragraphClass}>
              Charges vary by destination. Please check with your local customs
              authority before placing an order. International deliveries may
              also be delayed by customs processing.
            </p>
          </section>

          <section id="cancellations" className="scroll-mt-28 border-b border-[#493829]/10 py-8 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              08 / Changes
            </p>
            <h2 className={sectionHeadingClass}>
              8. Order changes and cancellations
            </h2>

            <p className={paragraphClass}>
              Contact us promptly if you wish to change an address, amend an
              order or request cancellation. We will make reasonable efforts to
              help before dispatch. If cancellation is agreed, we refund the
              cancelled goods and delivery charges not incurred. After dispatch,
              our Returns &amp; Refunds Policy applies.
            </p>
          </section>

          <section id="reviews" className="py-8 scroll-mt-28 sm:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B49A68]">
              09 / Community
            </p>
            <h2 className={sectionHeadingClass}>
              9. Reviews, feedback and customer photographs
            </h2>

            <p className={paragraphClass}>
              If reviews or public comments are enabled, submit only genuine
              feedback and material you are entitled to share. Do not post
              unlawful, defamatory, misleading or abusive material, personal
              information about others without permission, or content that
              infringes intellectual property rights.
            </p>

            <p className={paragraphClass}>
              You retain ownership of your submissions. When you submit a
              review for publication on our website, you allow us to display it
              with the display name you choose and make minor formatting
              changes that do not alter its meaning. We will seek separate
              permission before using your photographs, name or review in
              advertising beyond that review display.
            </p>

            <p className={paragraphClass}>
              We may moderate content for genuine reasons such as spam,
              unlawful material, privacy concerns or an unrelated submission.
              We will not remove or alter reviews merely because they express a
              genuine negative opinion. Contact us if you want to discuss
              removal of your own submission.
            </p>
          </section>

          <div className="mt-4 rounded-2xl border border-[#B49A68]/30 bg-[#D4BC98]/20 p-5 sm:p-7">
            <p className="text-xl font-medium font-display">
              Need help with an order?
            </p>
            <p className="mt-2 text-sm leading-7 text-[#493829]/75">
              If you have a question about these terms, your purchase or
              delivery, please contact the ADYA team through the contact
              details published on our website.
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

export default Terms;