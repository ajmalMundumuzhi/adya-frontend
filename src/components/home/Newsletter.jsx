import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const messageId = 'adya-newsletter-message';

  const submit = (event) => {
    event.preventDefault();

    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setStatus('invalid');
      return;
    }

    setStatus('success');
    setEmail('');
  };

  return (
    <section className="px-3 pb-12 sm:px-6 sm:pb-16 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#B49A68]/30 bg-[#D4BC98] px-5 py-12 text-center text-[#493829] sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <svg
          className="absolute w-40 h-48 pointer-events-none -left-2 -top-3 opacity-80 sm:h-64 sm:w-52 lg:h-72 lg:w-60"
          viewBox="0 0 220 300"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="#F8F3E8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 220C48 170 53 107 83 24" />
            <path d="M53 136C21 125 8 91 17 61C45 73 61 99 53 136Z" />
            <path d="M58 115C78 77 108 61 145 68C126 99 95 117 58 115Z" />
            <path d="M34 180C12 159 8 136 19 111C42 130 48 154 34 180Z" />
            <path d="M45 161C65 127 94 119 121 130C103 155 76 168 45 161Z" />
            <path d="M77 49C59 32 61 13 72 3C90 20 90 37 77 49Z" />
            <path d="M86 43C109 14 140 6 170 15C148 38 118 48 86 43Z" />
            <path d="M26 145C47 141 64 149 74 169C51 174 33 165 26 145Z" />
            <path d="M32 189C60 187 82 202 88 228C61 224 42 210 32 189Z" />
            <path d="M84 225C111 194 143 188 173 201C150 226 117 236 84 225Z" />
            <path d="M18 219C45 217 62 231 68 254C45 249 28 238 18 219Z" />
            <path d="M68 254C89 235 115 235 136 248C117 268 91 271 68 254Z" />
          </g>
        </svg>

        <svg
          className="absolute w-40 h-48 rotate-180 pointer-events-none -bottom-5 -right-2 opacity-80 sm:h-64 sm:w-52 lg:h-72 lg:w-60"
          viewBox="0 0 220 300"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="#F8F3E8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 220C48 170 53 107 83 24" />
            <path d="M53 136C21 125 8 91 17 61C45 73 61 99 53 136Z" />
            <path d="M58 115C78 77 108 61 145 68C126 99 95 117 58 115Z" />
            <path d="M34 180C12 159 8 136 19 111C42 130 48 154 34 180Z" />
            <path d="M45 161C65 127 94 119 121 130C103 155 76 168 45 161Z" />
            <path d="M77 49C59 32 61 13 72 3C90 20 90 37 77 49Z" />
            <path d="M86 43C109 14 140 6 170 15C148 38 118 48 86 43Z" />
            <path d="M26 145C47 141 64 149 74 169C51 174 33 165 26 145Z" />
            <path d="M32 189C60 187 82 202 88 228C61 224 42 210 32 189Z" />
            <path d="M84 225C111 194 143 188 173 201C150 226 117 236 84 225Z" />
            <path d="M18 219C45 217 62 231 68 254C45 249 28 238 18 219Z" />
            <path d="M68 254C89 235 115 235 136 248C117 268 91 271 68 254Z" />
          </g>
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#493829]/85 sm:text-sm sm:tracking-[0.38em]">
            Letters from ADYA
          </p>

          <h2 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-normal leading-[1.12] tracking-[-0.045em] text-[#493829] sm:mt-9 sm:text-5xl md:text-6xl lg:text-7xl">
            A little elegance
            <br />
            in your inbox.
          </h2>

          <div className="flex items-center justify-center max-w-xs gap-3 mx-auto mt-6 sm:mt-8">
            <span className="h-px flex-1 bg-[#8D7045]/70" />
            <svg
              viewBox="0 0 32 32"
              className="h-7 w-7 shrink-0 text-[#8D7045]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 2C12 6 12 10 16 13C20 10 20 6 16 2Z" />
              <path d="M16 30C12 26 12 22 16 19C20 22 20 26 16 30Z" />
              <path d="M2 16C6 12 10 12 13 16C10 20 6 20 2 16Z" />
              <path d="M30 16C26 12 22 12 19 16C22 20 26 20 30 16Z" />
              <circle cx="16" cy="16" r="3" />
            </svg>
            <span className="h-px flex-1 bg-[#8D7045]/70" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-7 text-[#493829]/85 sm:mt-8 sm:text-xl sm:leading-9">
            Be the first to discover new arrivals,
            <br className="hidden sm:block" /> pastel edits and styling inspiration.
          </p>

          <form
            noValidate
            onSubmit={submit}
            className="max-w-4xl mx-auto mt-8 sm:mt-10"
          >
            <label htmlFor="adya-newsletter-email" className="sr-only">
              Your email address
            </label>

            <input
              id="adya-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="Your email address"
              aria-invalid={status === 'invalid'}
              aria-describedby={messageId}
              className="h-14 w-full rounded-full border border-[#B49A68]/70 bg-[#FDFBF7] px-6 text-base text-[#493829] shadow-sm outline-none transition placeholder:text-[#493829]/55 focus:border-[#8D7045] focus:ring-2 focus:ring-[#8D7045]/20 sm:h-[76px] sm:px-9 sm:text-2xl"
            />

            <button
              type="submit"
              className="group mt-4 flex h-14 w-full items-center justify-center gap-4 rounded-full border border-[#8D7045] bg-[#F8F0DF] px-6 font-display text-xl font-medium text-[#8D7045] transition duration-300 hover:bg-[#493829] hover:text-[#F8F3E8] sm:mt-5 sm:h-[76px] sm:gap-6 sm:text-3xl"
            >
              Subscribe
              <ArrowRight
                size={25}
                strokeWidth={1.7}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>

            <p
              id={messageId}
              role={status === 'invalid' ? 'alert' : 'status'}
              className={`mt-3 min-h-5 text-sm font-medium ${
                status === 'invalid'
                  ? 'text-red-800'
                  : status === 'success'
                    ? 'text-[#493829]'
                    : 'text-transparent'
              }`}
            >
              {status === 'invalid'
                ? 'Please enter a valid email address.'
                : status === 'success'
                  ? 'Thank you! Your email has been validated locally.'
                  : ' '}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}