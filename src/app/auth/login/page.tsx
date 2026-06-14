import Link from 'next/link';

import { signInAction, signUpAction } from '@/app/auth/actions';
import { AuthStatus } from '@/components/auth/auth-status';
import { hasSupabaseEnv } from '@/lib/supabase/env';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isConfigured = hasSupabaseEnv();

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <Link className="text-xl font-bold text-[#20231f]" href="/">
            Robot Karel
          </Link>
          <AuthStatus />
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
              Login
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Melde dich an und speichere deinen Karel-Fortschritt.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#4d554c]">
              Dein Konto verbindet später gelöste Aufgaben, Kapitelstatus und
              Einreichungen mit deinem Profil.
            </p>
          </div>

          <div className="border border-[#d8d0bd] bg-white">
            {(params.error || params.message || !isConfigured) && (
              <div
                className={`border-b border-[#d8d0bd] px-5 py-4 text-sm leading-6 ${
                  params.error || !isConfigured
                    ? 'bg-[#fff4ef] text-[#8a321f]'
                    : 'bg-[#eef7f1] text-[#2f6b56]'
                }`}
              >
                {params.error ??
                  params.message ??
                  'Supabase ist noch nicht konfiguriert. Setze die Werte in .env.local.'}
              </div>
            )}

            <div className="grid gap-0 md:grid-cols-2">
              <form action={signInAction} className="border-b border-[#d8d0bd] p-5 md:border-b-0 md:border-r">
                <h2 className="text-xl font-semibold">Anmelden</h2>
                <label className="mt-5 block text-sm font-semibold text-[#384037]" htmlFor="login-email">
                  E-Mail
                </label>
                <input
                  autoComplete="email"
                  className="mt-2 h-11 w-full border border-[#cfc6b2] bg-[#faf8f1] px-3 text-sm outline-none transition focus:border-[#2f6b56] focus:ring-2 focus:ring-[#2f6b56]/20"
                  id="login-email"
                  name="email"
                  required
                  type="email"
                />
                <label className="mt-4 block text-sm font-semibold text-[#384037]" htmlFor="login-password">
                  Passwort
                </label>
                <input
                  autoComplete="current-password"
                  className="mt-2 h-11 w-full border border-[#cfc6b2] bg-[#faf8f1] px-3 text-sm outline-none transition focus:border-[#2f6b56] focus:ring-2 focus:ring-[#2f6b56]/20"
                  id="login-password"
                  name="password"
                  required
                  type="password"
                />
                <button
                  className="mt-5 inline-flex h-11 w-full items-center justify-center bg-[#20231f] px-4 text-sm font-semibold text-white transition hover:bg-[#2f6b56] focus:outline-none focus:ring-2 focus:ring-[#2f6b56] focus:ring-offset-2"
                  type="submit"
                >
                  Anmelden
                </button>
              </form>

              <form action={signUpAction} className="p-5">
                <h2 className="text-xl font-semibold">Konto erstellen</h2>
                <label className="mt-5 block text-sm font-semibold text-[#384037]" htmlFor="signup-name">
                  Name
                </label>
                <input
                  autoComplete="name"
                  className="mt-2 h-11 w-full border border-[#cfc6b2] bg-[#faf8f1] px-3 text-sm outline-none transition focus:border-[#2f6b56] focus:ring-2 focus:ring-[#2f6b56]/20"
                  id="signup-name"
                  name="displayName"
                  type="text"
                />
                <label className="mt-4 block text-sm font-semibold text-[#384037]" htmlFor="signup-email">
                  E-Mail
                </label>
                <input
                  autoComplete="email"
                  className="mt-2 h-11 w-full border border-[#cfc6b2] bg-[#faf8f1] px-3 text-sm outline-none transition focus:border-[#2f6b56] focus:ring-2 focus:ring-[#2f6b56]/20"
                  id="signup-email"
                  name="email"
                  required
                  type="email"
                />
                <label className="mt-4 block text-sm font-semibold text-[#384037]" htmlFor="signup-password">
                  Passwort
                </label>
                <input
                  autoComplete="new-password"
                  className="mt-2 h-11 w-full border border-[#cfc6b2] bg-[#faf8f1] px-3 text-sm outline-none transition focus:border-[#2f6b56] focus:ring-2 focus:ring-[#2f6b56]/20"
                  id="signup-password"
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
                <button
                  className="mt-5 inline-flex h-11 w-full items-center justify-center border border-[#20231f] px-4 text-sm font-semibold text-[#20231f] transition hover:border-[#2f6b56] hover:text-[#2f6b56] focus:outline-none focus:ring-2 focus:ring-[#2f6b56] focus:ring-offset-2"
                  type="submit"
                >
                  Registrieren
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
