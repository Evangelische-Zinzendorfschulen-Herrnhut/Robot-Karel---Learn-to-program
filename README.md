# Robot Karel - Programmieren lernen

Deutschsprachige Karel-Lernplattform mit Next.js, interaktiven Python-Aufgaben,
Karel-Welten, Tests und vorbereitetem Supabase-Schema für Auth und Fortschritt.

## Stack

- Next.js 16 mit App Router
- TypeScript
- Tailwind CSS
- Supabase Auth und Postgres
- Eigener Karel-Runner im Browser für die unterstützte Python-Teilmenge

## Projektstruktur

- `content/course.json` enthält Kapitelreihenfolge und Übungszuordnung.
- `content/exercises/` enthält die interaktiven Aufgabendefinitionen.
- `src/app/lernen/[chapterSlug]/page.tsx` rendert die Kapitel.
- `src/components/karel/` enthält Weltansicht und Code-/Feedbackbereich.
- `src/lib/karel/` enthält Karel-Engine, Runner und Zielprüfung.
- `src/lib/supabase/` enthält Supabase-Clients für Browser, Server und Proxy.
- `supabase/migrations/` enthält das Datenbankschema.
- `specs/` enthält Produkt- und Datenverträge.

## Lokale Entwicklung

Installieren:

```bash
npm install
```

Entwicklungsserver:

```bash
npm run dev
```

Prüfen:

```bash
npm run lint
npm run build
```

Falls lokal kein globales Node/npm verfügbar ist, kann das portable Node-Setup aus
diesem Workspace genutzt werden:

```bash
PATH="/Users/Markus/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PWD/.tools/node-v22.11.0-darwin-arm64/bin:$PATH" npm run dev
```

## Environment Variables

Für lokale Entwicklung eine `.env.local` aus `.env.example` anlegen:

```bash
cp .env.example .env.local
```

Benötigt werden:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Dieselben Variablen müssen in Vercel unter **Project Settings -> Environment
Variables** gesetzt werden.

## Supabase einrichten

1. Neues Supabase-Projekt erstellen.
2. In Supabase unter **SQL Editor** die Migration aus
   `supabase/migrations/0001_initial_schema.sql` ausführen.
3. Unter **Authentication** mindestens eine Login-Methode aktivieren, zum
   Beispiel E-Mail.
4. Unter **Project Settings -> API** die Project URL und den Publishable Key in
   `.env.local` und später in Vercel eintragen.

Das Schema enthält bereits Profile, Kurse, Kapitel, Übungen, Tests,
Fortschritt und Submissions inklusive Row-Level-Security.

## Deployment auf Vercel

1. Projekt in ein GitHub-Repository pushen.
2. In Vercel **New Project** wählen und das Repository importieren.
3. Framework Preset: **Next.js**.
4. Build Command: `npm run build`.
5. Environment Variables aus `.env.example` setzen.
6. Deploy starten.

Nach jedem Push auf den Produktionsbranch deployed Vercel automatisch neu.

## Ionos-Domain verwenden

Der Ionos-Webspace muss die Next.js-App nicht hosten. Die Domain kann aber bei
Ionos bleiben:

1. In Vercel unter **Project Settings -> Domains** die Domain hinzufügen.
2. Die von Vercel angezeigten DNS-Einträge bei Ionos setzen.
3. Warten, bis DNS und HTTPS-Zertifikat aktiv sind.

## Aktueller Stand

Der Kurs enthält Kapitel 1 bis 11 mit deutschen Inhalten, interaktiven
Karel-Welten und zusätzlichen Übungsaufgaben. Supabase ist strukturell
vorbereitet; die sichtbaren Fortschritts- und Login-Flows können darauf als
nächster Schritt aufgebaut werden.
