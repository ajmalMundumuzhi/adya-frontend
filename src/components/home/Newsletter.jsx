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
    <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#B49A68]/30 bg-[#D4BC98] px-5 py-12 text-[#493829] shadow-[0_8px_32px_rgba(73,56,41,0.08)] sm:px-10 sm:py-14 lg:px-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#493829] sm:text-sm">
            Letters from ADYA
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#493829] sm:text-4xl lg:text-5xl">
            A little beauty in your inbox.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-[#493829]/85 sm:text-lg">
            Get collection inspiration, styling notes and news from the world of sarees.
          </p>
          <form noValidate onSubmit={submit} className="max-w-xl mx-auto mt-7">
            <label htmlFor="adya-newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
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
                className="h-14 min-w-0 flex-1 rounded-full border border-[#B49A68]/60 bg-[#F8F3E8] p-3 text-sm font-medium text-[#493829] placeholder:text-[#493829]/60 focus-visible:outline-[#B49A68] sm:h-16 sm:px-7 sm:text-xl"
              />
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#B49A68] bg-[#F8F3E8] px-6 text-base font-semibold text-[#493829] transition-colors hover:bg-[#493829] hover:text-[#F8F3E8] sm:text-lg"
              >
                Subscribe
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p
              id={messageId}
              role={status === 'invalid' ? 'alert' : 'status'}
              className={`mt-3 min-h-5 text-sm font-medium ${
                status === 'invalid'
                  ? 'text-red-800'
                  : 'text-[#493829]'
              }`}
            >
              {status === 'invalid'
                ? 'Please enter a valid email address.'
                : status === 'success'
                  ? 'Thank you — this demo has validated your email locally. No mailing list was contacted.'
                  : ' '}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}