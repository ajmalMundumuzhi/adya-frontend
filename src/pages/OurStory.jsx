
import { Link } from 'react-router-dom';

const storyImage =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85';

export default function OurStory() {
  return (
    <main className="bg-[#F8F3E8] text-[#493829]">
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pb-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#B49A68] sm:text-base sm:tracking-[0.5em]">
            Our Story
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-[#B49A68] sm:text-5xl lg:text-6xl">
            Welcome to Adya by Anjana
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg font-medium leading-relaxed sm:text-xl">
            Every woman is unique. Her saree should feel just as special.
          </p>
        </div>

        <img
          src={storyImage}
          alt="Beautifully embroidered Indian saree in soft pastel tones"
          className="mt-8 h-64 w-full object-cover object-center sm:mt-10 sm:h-96 lg:h-[460px]"
        />

        <div className="mx-auto mt-7 max-w-5xl space-y-5 text-base font-medium leading-8 sm:mt-9 sm:text-lg sm:leading-9">
          <p>
            I’m Anjana Karun—a civil engineer, a mother, and the founder of Adya by Anjana.
          </p>
          <p>
            My love for sarees began in a small village in Kerala, where I grew up admiring the colours, textures and intricate details that give each saree its character. I was fascinated by how a woman could make a saree her own through the way she wore and styled it.
          </p>
          <p>
            As I built my life in Australia, that love remained close to me. Alongside my engineering career and motherhood, sharing styling ideas through YouTube and Instagram gave me a way to express my creativity—and eventually inspired Adya by Anjana.
          </p>
          <p>
            Adya is a personal expression of everything I love about sarees: soft colours, thoughtful details and the joy of finding a piece that feels uniquely yours. Every saree is handpicked by me, with the hope that it helps you express your individuality with elegance and confidence.
          </p>
        </div>

        <div className="mx-auto my-9 max-w-4xl text-center sm:my-12">
          <div className="flex items-center justify-center gap-4 text-xl text-[#B49A68]">
            <span className="h-px flex-1 bg-[#B49A68]/60" />
            <span aria-hidden="true">✿</span>
            <span className="h-px flex-1 bg-[#B49A68]/60" />
          </div>
          <blockquote className="my-6 font-display text-3xl font-medium leading-tight text-[#B49A68] sm:text-4xl lg:text-5xl">
            “Personally handpicked.
            <br />
            Chosen for its character.”
          </blockquote>
          <div className="flex items-center justify-center gap-4 text-xl text-[#B49A68]">
            <span className="h-px flex-1 bg-[#B49A68]/60" />
            <span aria-hidden="true">✿</span>
            <span className="h-px flex-1 bg-[#B49A68]/60" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-5 text-base font-medium leading-8 sm:text-lg sm:leading-9">
          <p>
            I personally select every saree in our collection, looking for something distinctive—a delicate pastel shade, an unexpected detail, a beautiful texture or a graceful drape.
          </p>
          <p>
            Each piece is chosen with care, creating a thoughtfully curated collection that celebrates understated elegance and your own sense of style.
          </p>
          <p>
            My hope is that you discover a saree that feels unmistakably yours.
          </p>
          <div className="pt-2">
            <p className="font-display text-4xl font-medium italic leading-tight text-[#B49A68] sm:text-5xl">
              With love, Anjana
            </p>
            <p className="mt-2 text-base font-medium text-[#493829]/80 sm:text-lg">
              Founder, Adya by Anjana
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#D4BC98]/35">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <div className="grid gap-4 sm:grid-cols-[0.8fr_1.5fr] sm:items-center sm:gap-10">
            <h2 className="font-display text-3xl font-medium text-[#B49A68] sm:border-r sm:border-[#B49A68]/60 sm:py-5 sm:text-4xl">
              Our Mission
            </h2>
            <p className="text-base font-medium leading-7 sm:text-lg sm:leading-8">
              To celebrate every woman’s individuality through personally handpicked sarees, chosen for distinctive colours, beautiful details and graceful drapes.
            </p>
          </div>

          <div className="my-6 h-px bg-[#B49A68]/50" />

          <div className="grid gap-4 sm:grid-cols-[0.8fr_1.5fr] sm:items-center sm:gap-10">
            <h2 className="font-display text-3xl font-medium text-[#B49A68] sm:border-r sm:border-[#B49A68]/60 sm:py-5 sm:text-4xl">
              Our Vision
            </h2>
            <p className="text-base font-medium leading-7 sm:text-lg sm:leading-8">
              To become a cherished boutique where women discover sarees that express their individuality, known for soft colours, refined elegance and personal care.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-6 bg-[#B49A68] px-8 py-3 text-base font-medium text-[#F8F3E8] transition-colors duration-300 hover:bg-[#493829] sm:min-w-72 sm:text-lg"
            >
              Explore the collection
              <span aria-hidden="true" className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
