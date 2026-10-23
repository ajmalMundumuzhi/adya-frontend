import { useId, useState } from 'react';
import { Send } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  empty: 'Please enter your email address.',
  invalid: 'Please enter a valid email address.',
  success:
    'Thank you. Your email looks valid. Mailing list signup is not connected yet, so nothing was saved.',
};

export default function NewsletterForm({ className = '' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const inputId = useId();
  const messageId = useId();
  const hasError = status === 'empty' || status === 'invalid';

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus('empty');
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus('invalid');
      return;
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className={className}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          placeholder="Your email address"
          aria-invalid={hasError}
          aria-describedby={status === 'idle' ? undefined : messageId}
          className="h-12 min-w-0 flex-1 rounded-full border border-ivory-100/30 bg-ivory-100/10 px-5 text-base text-ivory-100 placeholder:text-ivory-100/60"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-gold-light"
        >
          Subscribe
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
      <p
        id={messageId}
        role={hasError ? 'alert' : 'status'}
        className={`mt-3 min-h-[1.25rem] text-sm ${hasError ? 'text-[#ffb4a8]' : 'text-gold-light'}`}
      >
        {status === 'idle' ? '' : MESSAGES[status]}
      </p>
    </form>
  );
}