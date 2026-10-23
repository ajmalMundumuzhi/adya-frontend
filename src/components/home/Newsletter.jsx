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
  return <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12"><div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-burgundy-900 px-5 py-12 text-ivory-50 sm:px-10 sm:py-14 lg:px-16"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">Letters from ADYA</p><h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl lg:text-5xl">A little beauty in your inbox.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ivory-50/75 sm:text-base">Get collection inspiration, styling notes and news from the world of sarees.</p><form noValidate onSubmit={submit} className="mx-auto mt-7 max-w-xl"><label htmlFor="adya-newsletter-email" className="sr-only">Email address</label><div className="flex flex-col gap-3 sm:flex-row"><input id="adya-newsletter-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); if (status !== 'idle') setStatus('idle'); }} placeholder="Your email address" aria-invalid={status === 'invalid'} aria-describedby={messageId} className="h-12 min-w-0 flex-1 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-5 text-base text-ivory-50 placeholder:text-ivory-50/55 focus-visible:outline-gold-light" /><button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-light">Join the list <ArrowRight size={17} aria-hidden="true" /></button></div><p id={messageId} role={status === 'invalid' ? 'alert' : 'status'} className="mt-3 min-h-5 text-sm text-gold-light">{status === 'invalid' ? 'Please enter a valid email address.' : status === 'success' ? 'Thank you — this demo has validated your email locally. No mailing list was contacted.' : ' '}</p></form></div></div></section>;
}
