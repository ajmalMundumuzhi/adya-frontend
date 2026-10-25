import { TESTIMONIALS } from '../../data/homepage';
import SectionHeading from './SectionHeading';

export default function Testimonials() {
  return (
    <section className="bg-[#F8F3E8]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <SectionHeading
          eyebrow="Words to be replaced"
          title="A little love for the drape"
          description="These sample quotes are layout placeholders, not verified customer reviews."
          centered
        />

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <figure
              key={`${item.name}-${index}`}
              className="flex h-full flex-col rounded-2xl border border-[#B49A68]/30 bg-[#D4BC98]/25 p-6 sm:p-8"
            >
              <div
                aria-label="Decorative quotation mark"
                className="font-display text-5xl leading-none text-[#B49A68]"
              >
                “
              </div>

              <blockquote className="mt-3 flex-1 font-display text-2xl leading-snug text-[#493829]">
                {item.quote}
              </blockquote>

              <figcaption className="mt-6 border-t border-[#493829]/15 pt-4">
                <p className="text-sm font-semibold text-[#493829]">
                  {item.name}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#493829]/65">
                  {item.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}