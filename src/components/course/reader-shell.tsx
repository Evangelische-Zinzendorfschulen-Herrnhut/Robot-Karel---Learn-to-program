'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { commandReferenceRows, conditionRows } from '@/lib/content/reference';

const readerNavigation = [
  { label: '1 - Karel kennenlernen', slug: 'karel-kennenlernen' },
  { label: '2 - Programmieren', slug: 'programmieren' },
  { label: '3 - Neue Funktionen', slug: 'neue-funktionen' },
  { label: '4 - Zerlegung', slug: 'zerlegung' },
  { label: '5 - For-Schleifen', slug: 'for-schleifen' },
  { label: '6 - While-Schleifen', slug: 'while-schleifen' },
  { label: '7 - Bedingungen', slug: 'bedingungen' },
  { label: '8 - Verfeinerung', slug: 'verfeinerung' },
  { label: '9 - Extras', slug: 'extras' },
  { label: '10 - Übungen', slug: 'uebungen' },
];

function ReferenceTable({ rows, headings }: { rows: string[][]; headings: string[] }) {
  return (
    <div className="mt-4 overflow-hidden border border-[#d8d0bd] bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[#faf8f1] text-[#20231f]">
          <tr>
            {headings.map((heading) => (
              <th className="border-b border-[#d8d0bd] px-4 py-3" key={heading}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td
                  className={`border-b border-[#eee7d8] px-4 py-3 align-top ${
                    index === 0 || (index === 1 && headings[1] === 'Gegenteil')
                      ? 'font-mono text-[#20231f]'
                      : 'leading-6 text-[#4d554c]'
                  }`}
                  key={`${row[0]}-${cell}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReferenceOverlay({
  isOpen,
  titleId,
  onClose,
}: {
  isOpen: boolean;
  titleId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#20231f]/45 px-4 py-5 backdrop-blur-sm md:py-8">
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="mx-auto flex max-h-full w-full max-w-5xl flex-col overflow-hidden border border-[#d8d0bd] bg-[#f6f3ea] shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#d8d0bd] bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
              Nachschlagen
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#20231f]" id={titleId}>
              Karel-Referenz
            </h2>
          </div>
          <button
            aria-label="Referenz schließen"
            className="rounded-md border border-[#d8d0bd] bg-[#f6f3ea] px-3 py-2 text-sm font-semibold text-[#20231f] transition hover:bg-[#eee7d8] focus:outline-none focus:ring-2 focus:ring-[#2f6b56] focus:ring-offset-2"
            onClick={onClose}
            type="button"
          >
            Schließen
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <section>
            <h3 className="text-xl font-semibold">Grundbefehle</h3>
            <ReferenceTable headings={['Befehl', 'Bedeutung']} rows={commandReferenceRows} />
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">Programmstruktur</h3>
            <pre className="mt-4 overflow-x-auto border border-[#d8d0bd] bg-white p-4 text-sm leading-6 text-[#20231f]">
              <code>{`from karel import *


def main():
    # Code, der beim Start ausgeführt wird
    pass


def eigene_funktion():
    # weitere Funktionen stehen nach main()
    pass`}</code>
            </pre>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">Kontrollstrukturen</h3>
            <pre className="mt-4 overflow-x-auto border border-[#d8d0bd] bg-white p-4 text-sm leading-6 text-[#20231f]">
              <code>{`if bedingung():
    code_wenn_wahr()
else:
    code_wenn_falsch()

for i in range(4):
    code_wiederholen()

while bedingung():
    code_wiederholen()`}</code>
            </pre>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">Bedingungen</h3>
            <ReferenceTable
              headings={['Bedingung', 'Gegenteil', 'Bedeutung']}
              rows={conditionRows}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export function ReaderShell({
  activeSlug,
  children,
}: {
  activeSlug: string;
  children: React.ReactNode;
}) {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const referenceTitleId = useId();

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
        <aside className="border-b border-[#d8d0bd] pb-6 lg:sticky lg:top-6 lg:h-fit lg:border-b-0 lg:border-r lg:pr-6">
          <Link className="block text-xl font-bold text-[#20231f]" href="/lernen">
            Karel
          </Link>
          <nav aria-label="Kapitel" className="mt-6 space-y-1 text-sm">
            {readerNavigation.map((item) => {
              const isActive = item.slug === activeSlug;
              const className = `block w-full border-l-2 px-3 py-2 text-left ${
                isActive
                  ? 'border-[#3d6f5a] bg-white font-semibold text-[#20231f]'
                  : 'border-transparent text-[#5f665e]'
              }`;

              return (
                <Link className={className} href={`/lernen/${item.slug}`} key={item.label}>
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-5 border-t border-[#d8d0bd] pt-4">
              {activeSlug === 'referenz' ? (
                <Link
                  className="block w-full border-l-2 border-[#3d6f5a] bg-white px-3 py-2 text-left font-semibold text-[#20231f]"
                  href="/lernen/referenz"
                >
                  Referenz
                </Link>
              ) : (
                <button
                  className="block w-full border-l-2 border-transparent px-3 py-2 text-left text-[#5f665e] transition hover:border-[#d8d0bd] hover:bg-white hover:text-[#20231f]"
                  onClick={() => setIsReferenceOpen(true)}
                  type="button"
                >
                  Referenz
                </button>
              )}
            </div>
          </nav>
        </aside>

        {children}
      </section>

      <ReferenceOverlay
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        titleId={referenceTitleId}
      />
    </main>
  );
}
