import Link from 'next/link';

import { signOutAction } from '@/app/auth/actions';
import { AuthStatus } from '@/components/auth/auth-status';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

async function HomeAuthAction() {
  if (!hasSupabaseEnv()) {
    return (
      <Link
        className="inline-flex h-11 items-center border border-[#20231f] px-5 text-sm font-semibold text-[#20231f] transition-colors hover:border-[#3d6f5a] hover:text-[#3d6f5a]"
        href="/auth/login"
      >
        Anmelden
      </Link>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        className="inline-flex h-11 items-center border border-[#20231f] px-5 text-sm font-semibold text-[#20231f] transition-colors hover:border-[#3d6f5a] hover:text-[#3d6f5a]"
        href="/auth/login"
      >
        Anmelden
      </Link>
    );
  }

  return (
    <form action={signOutAction}>
      <button
        className="inline-flex h-11 items-center border border-[#20231f] px-5 text-sm font-semibold text-[#20231f] transition-colors hover:border-[#3d6f5a] hover:text-[#3d6f5a]"
        type="submit"
      >
        Abmelden
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <Link className="text-xl font-bold text-[#20231f]" href="/">
            Robot Karel
          </Link>
          <AuthStatus />
        </header>
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Robot Karel
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight">
            Python programmieren lernen, Schritt für Schritt.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d554c]">
            Für Schüler:innen der 9. und 10. Klasse: Öffne den Kurs und beginne
            direkt mit den ersten Karel-Aufgaben im Browser. Mit Anmeldung
            werden dein letzter Code, gelöste Aufgaben und vollständig
            bearbeitete Kapitel gespeichert, damit du später in der Schule oder
            zuhause weiterarbeiten kannst.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center border border-[#20231f] bg-[#20231f] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d6f5a]"
              href="/lernen"
            >
              Kurs öffnen
            </Link>
            <HomeAuthAction />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="border border-[#d8d0bd] bg-white p-5">
              <h2 className="font-semibold">Kapitel</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f665e]">
                MDX-Inhalte für einen Reader im Stil der Stanford-Vorlage.
              </p>
            </div>
            <div className="border border-[#d8d0bd] bg-white p-5">
              <h2 className="font-semibold">Python</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f665e]">
                Karel-Code läuft später sicher im Browser mit Pyodide.
              </p>
            </div>
            <div className="border border-[#d8d0bd] bg-white p-5">
              <h2 className="font-semibold">Fortschritt</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f665e]">
                Supabase speichert Profile, Aufgabenstatus und Einreichungen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
