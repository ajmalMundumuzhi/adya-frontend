import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  ShoppingBag,
  Pencil,
  Mail,
  Phone,
} from 'lucide-react';
import { SITE } from '../config/site';

const tabs = [
  { id: 'overview', label: 'Overview', icon: UserRound },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'details', label: 'Account Details', icon: Settings },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState('overview');

  const customer = {
    name: 'Welcome back',
    email: 'Sign in to view your account details',
    phone: '',
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen bg-[#F8F3E8] text-[#493829]">
      <section className="border-b border-[#B49A68]/30 bg-[#D4BC98]/35">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#493829]/65 sm:text-xs">
            {SITE.name} / My Account
          </p>

          <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
                Your account
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#493829]/75 sm:text-base">
                Your orders, personal details and favourite drapes, all in one
                place.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex min-h-11 w-fit items-center gap-3 border border-[#493829]/35 px-5 py-3 text-sm font-medium transition-colors hover:bg-[#F8F3E8]"
            >
              Continue shopping
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[270px_1fr] lg:gap-12">
          <aside>
            <div className="border border-[#B49A68]/35 bg-white/40 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D4BC98] text-[#493829]">
                  <UserRound size={25} strokeWidth={1.4} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-xl">{customer.name}</h2>
                  <p className="mt-1 truncate text-xs text-[#493829]/60">
                    Guest account
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#493829]/15 pt-5">
                <Link
                  to="/login"
                  className="flex min-h-11 w-full items-center justify-center bg-[#493829] px-4 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                >
                  Login / Register
                </Link>
                <p className="mt-3 text-center text-xs leading-5 text-[#493829]/65">
                  Sign in to manage orders and personal details.
                </p>
              </div>
            </div>

            <nav
              aria-label="Account navigation"
              className="mt-5 border border-[#B49A68]/35 bg-white/30 p-2"
            >
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex min-h-12 w-full items-center gap-3 px-3 py-3 text-left text-sm transition-colors ${
                    activeTab === id
                      ? 'bg-[#D4BC98]/50 font-semibold text-[#493829]'
                      : 'text-[#493829]/75 hover:bg-[#D4BC98]/20 hover:text-[#493829]'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              ))}

              <div className="my-2 border-t border-[#493829]/15" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 w-full items-center gap-3 px-3 py-3 text-left text-sm text-[#493829]/75 transition-colors hover:bg-[#D4BC98]/20 hover:text-[#493829]"
              >
                <LogOut size={18} strokeWidth={1.6} aria-hidden="true" />
                <span>Login / Exit</span>
              </button>
            </nav>
          </aside>

          <div className="min-w-0">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                    Account overview
                  </p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                    A little space for you
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#493829]/70">
                    Sign in to access your personal shopping experience.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Package size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                    <h3 className="mt-7 font-display text-2xl">Your orders</h3>
                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      View purchases and track deliveries after signing in.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('addresses')}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <MapPin size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                    <h3 className="mt-7 font-display text-2xl">Addresses</h3>
                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Manage your delivery addresses after signing in.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('wishlist')}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Heart size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                    <h3 className="mt-7 font-display text-2xl">Wishlist</h3>
                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Keep your favourite sarees close at hand.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="group border border-[#B49A68]/35 bg-white/35 p-5 text-left transition-colors hover:bg-[#D4BC98]/20 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Settings size={22} strokeWidth={1.4} />
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                    <h3 className="mt-7 font-display text-2xl">Your details</h3>
                    <p className="mt-2 text-sm leading-6 text-[#493829]/65">
                      Update your profile and contact information.
                    </p>
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-4 border border-[#B49A68]/35 bg-[#D4BC98]/25 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h3 className="font-display text-2xl">
                      Find your next favourite
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#493829]/70">
                      Explore the latest drapes and timeless collections.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#493829] px-5 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                  >
                    <ShoppingBag size={16} />
                    Shop sarees
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <AccountPanel
                eyebrow="Your purchases"
                title="My orders"
                description="Your order history and delivery updates will appear here once you sign in."
              />
            )}

            {activeTab === 'addresses' && (
              <AccountPanel
                eyebrow="Delivery details"
                title="Saved addresses"
                description="Sign in to view and manage your saved shipping addresses."
              />
            )}

            {activeTab === 'wishlist' && (
              <AccountPanel
                eyebrow="Your favourites"
                title="Wishlist"
                description="Sign in to view and manage the sarees you have saved."
                actionLabel="Explore sarees"
                actionTo="/shop"
              />
            )}

            {activeTab === 'details' && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
                  Personal information
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                  Account details
                </h2>

                <div className="mt-6 space-y-4 border border-[#B49A68]/35 bg-white/35 p-5 sm:p-7">
                  <div className="flex items-center gap-3 border-b border-[#493829]/10 pb-4">
                    <Mail size={18} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#493829]/60">Email address</p>
                      <p className="mt-1 text-sm">{customer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#493829]/60">Phone number</p>
                      <p className="mt-1 text-sm">
                        {customer.phone || 'Available after sign in'}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-5 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
                  >
                    Login to manage details
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function AccountPanel({
  eyebrow,
  title,
  description,
  actionLabel = 'Login / Register',
  actionTo = '/login',
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7047]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>

      <div className="mt-6 flex flex-col items-center border border-[#B49A68]/35 bg-white/35 px-5 py-12 text-center sm:px-10 sm:py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4BC98]/45">
          <UserRound size={27} strokeWidth={1.4} />
        </div>
        <h3 className="mt-5 font-display text-2xl">Welcome to ADYA</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#493829]/70">
          {description}
        </p>
        <Link
          to={actionTo}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#493829] px-6 py-3 text-sm font-medium text-[#F8F3E8] transition-colors hover:bg-[#5B4835]"
        >
          {actionLabel}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}