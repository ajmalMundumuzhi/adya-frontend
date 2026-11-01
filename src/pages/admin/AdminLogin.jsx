
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";
import { adminLogin } from "../../services/admin/auth.service";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(form);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F3E8] px-5 py-12 text-[#493829]">
      <div className="w-full max-w-md border border-[#B49A68]/35 bg-white/60 p-7 shadow-sm sm:p-10">
        <div className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8B7047]">
            ADYA
          </p>

          <h1 className="mt-4 font-display text-3xl">
            Admin Portal
          </h1>

          <p className="mt-2 text-sm text-[#493829]/60">
            Sign in to manage your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <div className="flex items-center border border-[#B49A68]/40 bg-white px-3">
              <Mail size={17} className="text-[#8B7047]" />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="min-h-12 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="flex items-center border border-[#B49A68]/40 bg-white px-3">
              <LockKeyhole size={17} className="text-[#8B7047]" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="min-h-12 w-full bg-transparent px-3 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="p-2 text-[#8B7047]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-[#493829] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5B4835] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#493829]/50">
          ADYA Store Management
        </p>
      </div>
    </main>
  );
}
