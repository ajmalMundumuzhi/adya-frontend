import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import { loginCustomer } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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

    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      nextErrors.password = 'Please enter your password.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    try {
        await loginCustomer({
          email: formData.email.trim(),
          password: formData.password,
        });

        navigate("/");
      } catch (error) {
        setErrors({
          general:
            error.response?.data?.message ||
            "Unable to sign in. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
  }

  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#D4BC98] lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-20">
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full border border-[#493829]/15" />
          <div className="absolute -left-20 top-32 h-96 w-96 rounded-full border border-[#493829]/10" />
          <div className="absolute -bottom-40 -right-24 h-[34rem] w-[34rem] rounded-full border border-[#493829]/15" />

          <Link to="/" className="relative z-10 inline-flex items-center w-fit">
            <img
              src="/images/logo.png"
              alt="ADYA"
              className="h-14 w-auto max-w-[220px] object-contain"
            />
          </Link>

          <div className="relative z-10 max-w-lg py-12 mx-auto">
            <span className="mb-6 inline-block text-xs font-medium uppercase tracking-[0.35em] text-[#493829]/70">
              The Art of Indian Heritage
            </span>

            <h1 className="font-display text-5xl font-medium leading-[1.15] xl:text-6xl">
              Tradition woven
              <br />
              into every
              <br />
              <span className="italic">thread.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-8 text-[#493829]/75">
              Discover timeless sarees that celebrate the beauty of Indian
              craftsmanship, culture, and the stories passed down through
              generations.
            </p>

            <div className="flex items-center gap-4 mt-10">
              <div className="h-px w-12 bg-[#493829]/50" />
              <span className="text-xs uppercase tracking-[0.25em]">
                Elegance that lasts forever
              </span>
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

          <div className="flex flex-col justify-center flex-1 w-full max-w-md py-12 mx-auto lg:py-16">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#B49A68]/40 bg-[#D4BC98]/20">
                <LockKeyhole size={21} strokeWidth={1.5} />
              </div>

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-[#B49A68]">
                Welcome Back
              </p>

              <h2 className="text-4xl font-medium font-display sm:text-5xl">
                Sign in to ADYA
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#493829]/65 sm:text-base">
                Your favourite styles and timeless collections are waiting
                for you.
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

              <div>
                <label
                  htmlFor="login-email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email address
                </label>

                <div
                  className={`flex h-14 items-center gap-3 rounded-lg border bg-white/60 px-4 transition focus-within:border-[#B49A68] ${
                    errors.email ? 'border-red-400' : 'border-[#493829]/15'
                  }`}
                >
                  <Mail
                    size={18}
                    className="shrink-0 text-[#B49A68]"
                    strokeWidth={1.5}
                  />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#493829]/35"
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#8D7045] transition hover:text-[#493829] sm:text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
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

                {errors.password && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-[#493829]/75">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#493829]"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#493829] px-6 text-sm font-medium text-[#F8F3E8] transition duration-300 hover:bg-[#34271D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Please wait...' : 'Sign In'}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="h-px flex-1 bg-[#493829]/10" />
              <span className="text-xs uppercase tracking-[0.15em] text-[#493829]/45">
                New to ADYA?
              </span>
              <div className="h-px flex-1 bg-[#493829]/10" />
            </div>

            <Link
              to="/register"
              className="flex h-14 w-full items-center justify-center rounded-lg border border-[#493829]/25 text-sm font-medium transition hover:border-[#B49A68] hover:bg-[#D4BC98]/15"
            >
              Create an Account
            </Link>

            <div className="flex items-start justify-center gap-3 mt-8 text-center">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#B49A68]"
                strokeWidth={1.5}
              />
              <p className="max-w-xs text-xs leading-6 text-[#493829]/55">
                Your personal details deserve care. We are committed to
                protecting your privacy.
              </p>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center justify-center gap-2 text-sm text-[#493829]/60 transition hover:text-[#493829]"
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

export default Login