import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
          Robot Karel
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight">
          Python programmieren lernen, Schritt für Schritt.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d554c]">
          Eine spec-first Lernplattform mit Kapiteln, Login, gespeicherten
          Fortschritten und interaktiven Karel-Aufgaben im Browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center border border-[#20231f] bg-[#20231f] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d6f5a]"
            href="/lernen"
          >
            Kurs öffnen
          </Link>
          <Link
            className="inline-flex h-11 items-center border border-[#20231f] px-5 text-sm font-semibold text-[#20231f] transition-colors hover:bg-white"
            href="/login?next=/lernen"
          >
            Einloggen
          </Link>
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
              Karel-Code läuft direkt im Browser mit unserem eigenen Karel-Runner.
            </p>
          </div>
          <div className="border border-[#d8d0bd] bg-white p-5">
            <h2 className="font-semibold">Fortschritt</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f665e]">
              Supabase speichert Profile, Aufgabenstatus und Einreichungen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
