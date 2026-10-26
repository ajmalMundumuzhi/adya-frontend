import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  ArrowRight,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  ShieldCheck,
  ArrowLeft,
  Check,
} from 'lucide-react'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      general: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.firstName.trim()) {
      nextErrors.firstName = 'Please enter your first name.'
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = 'Please enter your last name.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (formData.phone.trim() && !/^[+\d\s()-]{7,20}$/.test(formData.phone)) {
      nextErrors.phone = 'Please enter a valid phone number.'
    }

    if (formData.password.length < 8) {
      nextErrors.password = 'Password must contain at least 8 characters.'
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!formData.agreeToTerms) {
      nextErrors.agreeToTerms = 'Please accept the terms to continue.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    try {
      setErrors({
        general: 'Account registration is not connected yet.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'h-14 w-full rounded-lg border border-[#493829]/15 bg-white/60 px-4 text-sm text-[#493829] outline-none transition placeholder:text-[#493829]/35 focus:border-[#B49A68]'

  const renderError = (field) =>
    errors[field] ? (
      <p className="mt-2 text-xs text-red-600">{errors[field]}</p>
    ) : null

  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#D4BC98] lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-20">
          <div className="absolute -right-36 top-20 h-96 w-96 rounded-full border border-[#493829]/15" />
          <div className="absolute -right-20 top-36 h-[30rem] w-[30rem] rounded-full border border-[#493829]/10" />
          <div className="absolute -bottom-44 -left-32 h-[35rem] w-[35rem] rounded-full border border-[#493829]/15" />

          <Link to="/" className="relative z-10 inline-flex items-center w-fit">
            <img
              src="/images/logo.png"
              alt="ADYA"
              className="h-14 w-auto max-w-[220px] object-contain"
            />
          </Link>

          <div className="relative z-10 max-w-lg py-12 mx-auto">
            <span className="mb-6 inline-block text-xs font-medium uppercase tracking-[0.35em] text-[#493829]/70">
              A World of Timeless Elegance
            </span>

            <h1 className="font-display text-5xl font-medium leading-[1.15] xl:text-6xl">
              Your story.
              <br />
              Your style.
              <br />
              <span className="italic">Your ADYA.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-8 text-[#493829]/75">
              Join our community and explore carefully selected sarees that
              bring together traditional artistry and contemporary elegance.
            </p>

            <div className="mt-10 space-y-5">
              {[
                'Explore timeless saree collections',
                'Keep your favourite styles close',
                'Manage your orders with ease',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#493829]/30">
                    <Check size={13} />
                  </span>
                  <span className="text-sm text-[#493829]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-[#493829]/20 pt-5 text-xs text-[#493829]/70">
            <span>© {new Date().getFullYear()} ADYA</span>
            <span>Crafted with heritage</span>
          </div>
        </section>

        <section className="flex flex-col min-h-screen px-5 py-6 sm:px-10 sm:py-10 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/images/logo.png"
                alt="ADYA"
                className="h-12 w-auto max-w-[180px] object-contain"
              />
            </Link>

            <Link
              to="/"
              aria-label="Back to home"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#493829]/15 transition hover:bg-[#D4BC98]/30"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="flex flex-col justify-center flex-1 w-full max-w-md py-10 mx-auto lg:py-14">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#B49A68]/40 bg-[#D4BC98]/20">
                <UserRound size={22} strokeWidth={1.5} />
              </div>

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-[#B49A68]">
                Become a Member
              </p>

              <h2 className="text-4xl font-medium font-display sm:text-5xl">
                Create Account
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#493829]/65 sm:text-base">
                Create your ADYA account and make every shopping experience
                more personal.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {errors.general && (
                <div
                  role="alert"
                  className="px-4 py-3 text-sm leading-6 text-red-700 border border-red-200 rounded-lg bg-red-50"
                >
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-first-name"
                    className="block mb-2 text-sm font-medium"
                  >
                    First name
                  </label>

                  <input
                    id="register-first-name"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.firstName)}
                    className={`${inputClass} ${
                      errors.firstName ? 'border-red-400' : ''
                    }`}
                  />

                  {renderError('firstName')}
                </div>

                <div>
                  <label
                    htmlFor="register-last-name"
                    className="block mb-2 text-sm font-medium"
                  >
                    Last name
                  </label>

                  <input
                    id="register-last-name"
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.lastName)}
                    className={`${inputClass} ${
                      errors.lastName ? 'border-red-400' : ''
                    }`}
                  />

                  {renderError('lastName')}
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B49A68]"
                    strokeWidth={1.5}
                  />

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    className={`${inputClass} pl-11 ${
                      errors.email ? 'border-red-400' : ''
                    }`}
                  />
                </div>

                {renderError('email')}
              </div>

              <div>
                <label
                  htmlFor="register-phone"
                  className="block mb-2 text-sm font-medium"
                >
                  Phone number <span className="text-[#493829]/45">(Optional)</span>
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B49A68]"
                    strokeWidth={1.5}
                  />

                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.phone)}
                    className={`${inputClass} pl-11 ${
                      errors.phone ? 'border-red-400' : ''
                    }`}
                  />
                </div>

                {renderError('phone')}
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>

                <div
                  className={`flex h-14 items-center gap-3 rounded-lg border bg-white/60 px-4 transition focus-within:border-[#B49A68] ${
                    errors.password
                      ? 'border-red-400'
                      : 'border-[#493829]/15'
                  }`}
                >
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[#B49A68]"
                    strokeWidth={1.5}
                  />

                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.password)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#493829]/35"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#493829]/55 transition hover:bg-[#D4BC98]/25 hover:text-[#493829]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {renderError('password')}
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block mb-2 text-sm font-medium"
                >
                  Confirm password
                </label>

                <div
                  className={`flex h-14 items-center gap-3 rounded-lg border bg-white/60 px-4 transition focus-within:border-[#B49A68] ${
                    errors.confirmPassword
                      ? 'border-red-400'
                      : 'border-[#493829]/15'
                  }`}
                >
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[#B49A68]"
                    strokeWidth={1.5}
                  />

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#493829]/35"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#493829]/55 transition hover:bg-[#D4BC98]/25 hover:text-[#493829]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {renderError('confirmPassword')}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#493829]/75">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#493829]"
                  />

                  <span>
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="font-medium text-[#8D7045] underline underline-offset-4 hover:text-[#493829]"
                    >
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy-policy"
                      className="font-medium text-[#8D7045] underline underline-offset-4 hover:text-[#493829]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {renderError('agreeToTerms')}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#493829] px-6 text-sm font-medium text-[#F8F3E8] transition duration-300 hover:bg-[#34271D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Please wait...' : 'Create Account'}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#493829]/65">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#8D7045] underline underline-offset-4 transition hover:text-[#493829]"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-start justify-center gap-3 mt-7">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#B49A68]"
                strokeWidth={1.5}
              />

              <p className="max-w-xs text-center text-xs leading-6 text-[#493829]/55">
                Your information is handled with care. We respect your privacy
                and value your trust.
              </p>
            </div>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center gap-2 text-sm text-[#493829]/60 transition hover:text-[#493829]"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </div>

          <div className="border-t border-[#493829]/10 pt-5 text-center text-xs text-[#493829]/50 lg:hidden">
            © {new Date().getFullYear()} ADYA. All rights reserved.
          </div>
        </section>
      </div>
    </main>
  )
}

export default Register