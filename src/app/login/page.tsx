import Link from 'next/link';

import { signIn, signUp } from './actions';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith('/') ? params.next : '/lernen';

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto grid min-h-screen w-full max-w-5xl items-center gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div>
          <Link className="text-sm font-medium text-[#3d6f5a]" href={next}>
            Zurück zum Kurs
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Robot Karel
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Einloggen und deinen Fortschritt speichern.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4d554c]">
            Mit einem Account kann die Seite später deinen Code, gelöste Aufgaben
            und Kapitelstatus deinem Profil zuordnen.
          </p>
        </div>

        <div className="border border-[#d8d0bd] bg-white p-5 shadow-sm">
          {params.error ? (
            <p className="mb-4 border border-[#d99b8f] bg-[#fff4f1] px-3 py-2 text-sm leading-6 text-[#8a2f20]">
              {params.error}
            </p>
          ) : null}
          {params.message ? (
            <p className="mb-4 border border-[#b8d1bf] bg-[#f0f8f2] px-3 py-2 text-sm leading-6 text-[#295b3a]">
              {params.message}
            </p>
          ) : null}

          <section>
            <h2 className="text-xl font-semibold">Einloggen</h2>
            <form action={signIn} className="mt-4 space-y-4">
              <input name="next" type="hidden" value={next} />
              <label className="block text-sm font-semibold text-[#20231f]">
                E-Mail
                <input
                  autoComplete="email"
                  className="mt-2 w-full border border-[#cfc6b4] bg-[#faf8f1] px-3 py-2 font-normal outline-none focus:border-[#3d6f5a]"
                  name="email"
                  required
                  type="email"
                />
              </label>
              <label className="block text-sm font-semibold text-[#20231f]">
                Passwort
                <input
                  autoComplete="current-password"
                  className="mt-2 w-full border border-[#cfc6b4] bg-[#faf8f1] px-3 py-2 font-normal outline-none focus:border-[#3d6f5a]"
                  name="password"
                  required
                  type="password"
                />
              </label>
              <button
                className="w-full border border-[#20231f] bg-[#20231f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6f5a]"
                type="submit"
              >
                Einloggen
              </button>
            </form>
          </section>

          <section className="mt-8 border-t border-[#d8d0bd] pt-6">
            <h2 className="text-xl font-semibold">Account erstellen</h2>
            <form action={signUp} className="mt-4 space-y-4">
              <input name="next" type="hidden" value={next} />
              <label className="block text-sm font-semibold text-[#20231f]">
                Name
                <input
                  autoComplete="name"
                  className="mt-2 w-full border border-[#cfc6b4] bg-[#faf8f1] px-3 py-2 font-normal outline-none focus:border-[#3d6f5a]"
                  name="displayName"
                  type="text"
                />
              </label>
              <label className="block text-sm font-semibold text-[#20231f]">
                E-Mail
                <input
                  autoComplete="email"
                  className="mt-2 w-full border border-[#cfc6b4] bg-[#faf8f1] px-3 py-2 font-normal outline-none focus:border-[#3d6f5a]"
                  name="email"
                  required
                  type="email"
                />
              </label>
              <label className="block text-sm font-semibold text-[#20231f]">
                Passwort
                <input
                  autoComplete="new-password"
                  className="mt-2 w-full border border-[#cfc6b4] bg-[#faf8f1] px-3 py-2 font-normal outline-none focus:border-[#3d6f5a]"
                  minLength={6}
                  name="password"
                  required
                  type="password"
                />
              </label>
              <button
                className="w-full border border-[#20231f] px-4 py-2 text-sm font-semibold text-[#20231f] transition-colors hover:bg-[#faf8f1]"
                type="submit"
              >
                Account erstellen
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
