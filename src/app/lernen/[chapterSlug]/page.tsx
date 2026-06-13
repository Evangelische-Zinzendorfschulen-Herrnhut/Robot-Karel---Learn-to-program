import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ExercisePreview } from '@/components/course/exercise-preview';
import { getChapter, getChapterExercises, getChapters } from '@/lib/content/course';

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
  { label: '10 - Referenz', slug: 'referenz' },
  { label: '11 - Übungen', slug: 'uebungen' },
];

const commandDescriptions = [
  {
    command: 'move()',
    description:
      'Karel geht ein Feld nach vorne. Wenn eine Wand im Weg ist, darf Karel den Schritt nicht ausführen.',
  },
  {
    command: 'turn_left()',
    description: 'Karel dreht sich um 90 Grad nach links, also gegen den Uhrzeigersinn.',
  },
  {
    command: 'pick_beeper()',
    description:
      'Karel hebt einen Beeper auf dem aktuellen Feld auf und legt ihn in seine Tasche. Das geht nur, wenn dort ein Beeper liegt.',
  },
  {
    command: 'put_beeper()',
    description:
      'Karel legt einen Beeper aus seiner Tasche auf dem aktuellen Feld ab. Das geht nur, wenn die Tasche nicht leer ist.',
  },
];

type ChapterPageProps = {
  params: Promise<{
    chapterSlug: string;
  }>;
};

export function generateStaticParams() {
  return getChapters().map((chapter) => ({
    chapterSlug: chapter.slug,
  }));
}

function ReaderShell({
  activeSlug,
  children,
}: {
  activeSlug: string;
  children: React.ReactNode;
}) {
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
              const className = `block border-l-2 px-3 py-2 ${
                isActive
                  ? 'border-[#3d6f5a] bg-white font-semibold text-[#20231f]'
                  : 'border-transparent text-[#5f665e]'
              }`;

              if (!item.slug) {
                return (
                  <span className={className} key={item.label}>
                    {item.label}
                  </span>
                );
              }

              return (
                <Link className={className} href={`/lernen/${item.slug}`} key={item.label}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {children}
      </section>
    </main>
  );
}

function ChapterHeader({ orderIndex, title }: { orderIndex: number; title: string }) {
  return (
    <div className="border-b border-[#d8d0bd] pb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
        Kapitel {orderIndex}
      </p>
      <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
    </div>
  );
}

function TrySection({ exercises }: { exercises: ReturnType<typeof getChapterExercises> }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Ausprobieren</h2>
      <div className="mt-5 space-y-5">
        {exercises.map((exercise) => (
          <ExercisePreview exercise={exercise} key={exercise.slug} />
        ))}
      </div>
    </section>
  );
}

function ChapterOneContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 1: Karel den Roboter kennenlernen" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Karel ist ein kleiner Roboter, mit dem man die Grundideen des
          Programmierens in einer sehr einfachen Umgebung lernen kann. Statt
          sofort mit allen Details einer großen Programmiersprache zu
          starten, konzentrieren wir uns zuerst auf Befehle, Reihenfolgen
          und das Lösen kleiner Probleme.
        </p>
        <p>
          Die Idee geht auf Rich Pattis zurück, der in den 1970er Jahren an
          Stanford eine Lernumgebung für den Einstieg in die Informatik
          entwickelte. Der Roboter bekam den Namen Karel, in Anlehnung an
          den tschechischen Schriftsteller Karel Capek, dessen Theaterstück
          das Wort „Roboter“ bekannt machte.
        </p>
      </section>

      <section className="mt-10 grid gap-6 border-y border-[#d8d0bd] py-8 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <h2 className="text-2xl font-semibold">Was ist Karel?</h2>
          <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
            <p>
              Karel lebt in einer kleinen Welt aus Feldern. Du gibst Karel
              Befehle, und aus diesen Befehlen entsteht ein Programm. Am
              Anfang versteht Karel nur wenige primitive Befehle. Später
              lernst du, Karel neue Fähigkeiten beizubringen.
            </p>
            <p>
              Karel-Programme sehen schon wie Python aus, sind aber viel
              kleiner. Dadurch bleiben die Regeln überschaubar, während die
              eigentliche Denkarbeit dieselbe ist: ein Problem verstehen,
              einen Plan machen und ihn Schritt für Schritt in Code
              ausdrücken.
            </p>
          </div>
        </div>
        <div className="flex min-h-56 items-center justify-center border border-[#d8d0bd] bg-white p-6">
          <Image
            alt="Karel als freundlicher Roboter"
            className="h-44 w-44 object-contain [image-rendering:pixelated]"
            height={180}
            priority
            src="/sprites/karel-robot-front.png"
            width={180}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Karels Welt</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Karels Welt besteht aus Reihen und Spalten. Eine Reihe verläuft
            waagerecht von Westen nach Osten, eine Spalte senkrecht von
            Süden nach Norden. Ein Schnittpunkt aus Reihe und Spalte ist ein
            Feld. Karel steht immer auf einem Feld und blickt nach Norden,
            Osten, Süden oder Westen.
          </p>
          <p>
            In der Welt können Beeper liegen. Karel kann einen Beeper nur
            erkennen, wenn er auf demselben Feld steht. Wände sind feste
            Hindernisse: Karel kann nicht durch sie hindurchgehen und muss
            einen anderen Weg finden. Der Rand jeder Welt ist ebenfalls
            durch Wände begrenzt.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Karels Befehle</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Am Anfang kennt Karel nur eine kleine Auswahl an Befehlen. Nutze
          die Buttons in der Übung unten, um die Startwelt so zu verändern,
          dass sie zur Zielwelt passt.
        </p>
        <div className="mt-5 overflow-hidden border border-[#d8d0bd] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#faf8f1] text-[#20231f]">
              <tr>
                <th className="border-b border-[#d8d0bd] px-4 py-3">Befehl</th>
                <th className="border-b border-[#d8d0bd] px-4 py-3">Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              {commandDescriptions.map((item) => (
                <tr key={item.command}>
                  <td className="border-b border-[#eee7d8] px-4 py-3 align-top font-mono text-[#20231f]">
                    {item.command}
                  </td>
                  <td className="border-b border-[#eee7d8] px-4 py-3 leading-6 text-[#4d554c]">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die leeren Klammern gehören zur Schreibweise der Befehle. Später
          wirst du Funktionen kennenlernen, bei denen Informationen zwischen
          den Klammern stehen können. Bei Karels Grundbefehlen bleiben sie
          leer, müssen aber trotzdem geschrieben werden.
        </p>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wenn Karel etwas Unmögliches versucht, zum Beispiel durch eine
          Wand zu laufen oder einen nicht vorhandenen Beeper aufzuheben,
          entsteht ein Fehler. Ein gutes Programm vermeidet solche
          Situationen durch einen klaren Plan.
        </p>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function CodeSnippet({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto border border-[#d8d0bd] bg-[#20231f] p-4 text-sm leading-6 text-[#f6f3ea]">
      <code>{children}</code>
    </pre>
  );
}

function FencepostIllustration() {
  return (
    <figure className="mt-5 border border-[#d8d0bd] bg-white p-4">
      <figcaption className="text-sm font-semibold text-[#20231f]">
        11 Pfosten bilden 10 Zaunfelder
      </figcaption>
      <Image
        alt="Maschendrahtzaun mit elf Pfosten und zehn Zaunfeldern"
        className="mt-4 h-auto w-full border border-[#eee7d8]"
        height={360}
        src="/images/fencepost.png"
        width={900}
      />
    </figure>
  );
}

function ChapterTwoContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 2: Karel programmieren" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Das einfachste Karel-Programm ist eine Folge von Textbefehlen. Beim
          Ausführen liest Karel diese Befehle von oben nach unten und verändert
          dadurch Schritt für Schritt seine Welt. In diesem Kapitel zerlegen
          wir ein erstes Programm in seine Bestandteile.
        </p>
        <p>
          Normalerweise schreibt man Programme in einer Entwicklungsumgebung.
          Unser Reader übernimmt für den Anfang dieselbe Rolle: Du kannst Code
          direkt auf der Seite ausprobieren und sofort sehen, was mit Karel
          passiert.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Ein erstes Programm</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Dieses kleine Programm bewegt Karel zum Beeper, hebt ihn auf und geht
          anschließend ein Feld weiter:
        </p>
        <CodeSnippet>{`# Karel hebt einen Beeper auf und geht danach weiter.
from karel import *


def main():
    move()
    pick_beeper()
    move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Obwohl das Programm kurz ist, enthält es bereits die wichtigsten
          Bausteine, die du immer wieder sehen wirst: Kommentare oder
          erklärender Text, einen Import, eine Funktion namens
          <span className="font-mono"> main()</span> und eine eingerückte
          Befehlsfolge.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Kommentare und Import</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Zeilen, die mit <span className="font-mono">#</span> beginnen, sind
          Kommentare. Karel führt sie nicht aus; sie helfen Menschen, den Plan
          hinter einem Programm zu verstehen. Bei sehr kleinen Programmen wirkt
          das manchmal übertrieben, aber bei größeren Aufgaben sind gute
          Kommentare ein wichtiger Teil sauberer Programmierung.
        </p>
        <CodeSnippet>{`# Karel hebt einen Beeper auf und geht weiter.
from karel import *`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die Importzeile macht die Karel-Befehle verfügbar. Ohne sie würde
          Python Befehle wie <span className="font-mono">move()</span> oder
          <span className="font-mono"> pick_beeper()</span> nicht kennen.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Die Funktion main()</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Mit <span className="font-mono">def main():</span> definierst du die
          Funktion, die beim Start des Programms ausgeführt wird. Die Zeile mit
          <span className="font-mono"> def</span> ist der Kopf der Funktion.
          Alles, was eingerückt darunter steht, gehört zum Körper der Funktion.
        </p>
        <CodeSnippet>{`def main():
    move()
    pick_beeper()
    move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die Einrückung ist in Python nicht Dekoration, sondern Bedeutung. Sie
          sagt: Diese Befehle gehören zusammen und werden ausgeführt, wenn
          <span className="font-mono"> main()</span> gestartet wird.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Ein interessanteres Problem</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Ein einzelner Beeper ist noch keine große Herausforderung. Spannender
            wird es, wenn Karel den Beeper an einen neuen Ort bringen soll. Die
            Aufgabe unten orientiert sich an der Idee aus dem Originalkapitel:
            Karel sammelt einen Beeper auf, steigt auf eine höhere Reihe, legt
            den Beeper dort ab und geht danach weiter.
          </p>
          <p>
            An einer Stelle braucht Karel eine Rechtsdrehung. Wenn du nur
            <span className="font-mono"> turn_left()</span> verwenden möchtest,
            kannst du rechts abbiegen, indem du dich dreimal links drehst. Genau
            das ist ein erster Programmiergedanke: Du hast nicht immer den
            perfekten Befehl, aber du kannst ihn aus vorhandenen Befehlen
            zusammensetzen.
          </p>
        </div>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterThreeContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 3: Neue Funktionen definieren" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Im letzten Kapitel hast du Karel auf eine höhere Reihe steigen lassen.
          Dabei gab es eine kleine Unbequemlichkeit: Karel konnte nach links
          drehen, aber für eine Rechtsdrehung mussten wir dreimal
          <span className="font-mono"> turn_left()</span> schreiben.
        </p>
        <p>
          Der Plan in deinem Kopf lautet an dieser Stelle eigentlich ganz
          einfach: Karel soll rechts abbiegen. In diesem Kapitel gibst du dieser
          Befehlsfolge einen eigenen Namen, damit dein Programm näher an deinem
          Plan lesbar wird.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Neue Befehle definieren</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          In Python definierst du eine neue Funktion mit
          <span className="font-mono"> def</span>. Direkt danach steht der Name
          deiner Funktion, dann leere Klammern und ein Doppelpunkt. Die Befehle,
          die zur Funktion gehören, stehen eingerückt darunter:
        </p>
        <CodeSnippet>{`def name():
    befehl()
    noch_ein_befehl()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Der Name ist frei wählbar, solange er wie ein Python-Name geschrieben
          ist. Für Karel lohnt sich ein Name, der beschreibt, was der Codeblock
          insgesamt bewirkt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">turn_right() als Funktion</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Eine Rechtsdrehung besteht aus drei Linksdrehungen. Statt diese drei
          Zeilen jedes Mal neu zu schreiben, kannst du sie in einer Funktion
          sammeln:
        </p>
        <CodeSnippet>{`def turn_right():
    turn_left()
    turn_left()
    turn_left()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Danach darfst du <span className="font-mono">turn_right()</span> im
          Programm genauso verwenden wie Karels eingebaute Befehle. Der Name
          steht im Hauptprogramm, die genaue Ausführung ist in der Funktion
          versteckt.
        </p>
        <CodeSnippet>{`from karel import *


def main():
    move()
    turn_right()
    move()


def turn_right():
    turn_left()
    turn_left()
    turn_left()`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Weitere kleine Helfer</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Du kannst beliebig viele Funktionen definieren. Zum Beispiel ist auch
          eine halbe Drehung ein wiederverwendbarer Gedanke:
        </p>
        <CodeSnippet>{`def turn_around():
    turn_left()
    turn_left()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Gute Funktionen machen Programme kürzer, aber vor allem klarer. Wenn
          ein Name gut gewählt ist, versteht man schneller, was Karel tun soll.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Codeblöcke und Einrückung</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Der eingerückte Bereich unter einer
            <span className="font-mono"> def</span>-Zeile heißt Codeblock. In
            Python ist diese Einrückung Teil der Sprache: Sie zeigt, welche
            Befehle zur Funktion gehören.
          </p>
          <p>
            Funktionen werden nacheinander geschrieben. Du definierst also erst
            eine Funktion, dann die nächste. Eine Funktion gehört nicht in den
            eingerückten Block einer anderen Funktion.
          </p>
        </div>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterFourContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 4: Zerlegung" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Eigene Funktionen sind nicht nur praktisch, weil sie wiederholte
          Befehlsfolgen kürzer machen. Sie helfen dir vor allem dabei, ein
          größeres Problem in kleinere, verständliche Teile zu zerlegen.
        </p>
        <p>
          In diesem Kapitel soll Karel ein Schlagloch in einer Straße füllen.
          Karel steht links neben dem Loch, legt einen Beeper hinein und geht
          anschließend zum nächsten Feld weiter.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Alles in main() schreiben</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Mit den Befehlen aus den letzten Kapiteln lässt sich die Aufgabe schon
          lösen. Wenn der gesamte Plan direkt in
          <span className="font-mono"> main()</span> steht, sieht das aber
          schnell nach einer bloßen Befehlsliste aus:
        </p>
        <CodeSnippet>{`def main():
    move()
    turn_right()
    move()
    put_beeper()
    turn_around()
    move()
    turn_right()
    move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Dieser Code kann funktionieren, aber die Absicht ist nicht sofort
          sichtbar. Man muss jede einzelne Zeile innerlich mitlaufen lassen, um
          zu erkennen, dass Karel gerade ein Schlagloch füllt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Teilprobleme erkennen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Zerlegung bedeutet: Du teilst eine Aufgabe in kleinere Teilprobleme
          auf. Für das Schlagloch kann der Plan so aussehen:
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-6 leading-7 text-[#4d554c]">
          <li>Bis zum Schlagloch gehen.</li>
          <li>Das Schlagloch mit einem Beeper füllen.</li>
          <li>Zum nächsten Feld auf der Straße weitergehen.</li>
        </ol>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wenn <span className="font-mono">main()</span> genau diesen Plan
          ausdrückt, wird das Programm auf menschlicher Ebene lesbar:
        </p>
        <CodeSnippet>{`def main():
    move()
    fill_pothole()
    move()`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">fill_pothole() definieren</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Jetzt braucht Karel nur noch eine Erklärung, was
          <span className="font-mono"> fill_pothole()</span> bedeutet. Die
          Details wandern in eine eigene Funktion:
        </p>
        <CodeSnippet>{`def fill_pothole():
    turn_right()
    move()
    put_beeper()
    turn_around()
    move()
    turn_right()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Der Vorteil ist nicht, dass weniger Befehle ausgeführt werden. Der
          Computer arbeitet immer noch Schritt für Schritt. Der Vorteil ist,
          dass du das Programm auf zwei Ebenen lesen kannst: oben den Plan,
          darunter die Details.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Das vollständige Programm</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Zusammengesetzt entsteht ein Programm, dessen
          <span className="font-mono"> main()</span> sehr kurz bleibt. Mit dem
          Einzelschritt-Modus kannst du trotzdem beobachten, wie Karel zwischen
          Hauptprogramm und Hilfsfunktionen wechselt.
        </p>
        <CodeSnippet>{`from karel import *


def main():
    move()
    fill_pothole()
    move()


def fill_pothole():
    turn_right()
    move()
    put_beeper()
    turn_around()
    move()
    turn_right()


def turn_right():
    turn_left()
    turn_left()
    turn_left()


def turn_around():
    turn_left()
    turn_left()`}</CodeSnippet>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterFiveContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 5: For-Schleifen" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Computer sind besonders gut darin, Dinge zuverlässig zu wiederholen.
          Wenn Karel denselben Codeblock mehrere Male ausführen soll, brauchst
          du nicht jede Zeile immer wieder neu zu schreiben.
        </p>
        <p>
          Für eine feste Anzahl von Wiederholungen verwenden wir eine
          <span className="font-mono"> for</span>-Schleife. Sie sagt: Führe den
          eingerückten Block genau so oft aus, wie in
          <span className="font-mono"> range(...)</span> angegeben ist.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Die Grundform</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die Karel-Variante einer for-Schleife sieht so aus:
        </p>
        <CodeSnippet>{`for i in range(anzahl):
    befehl()
    noch_ein_befehl()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Für den Anfang kannst du die Zeile als „wiederhole diesen Codeblock
          <span className="font-mono"> anzahl</span> Mal“ lesen. Die Variable
          <span className="font-mono"> i</span> ist hier nur Teil der
          Python-Schreibweise; Karel benutzt sie in unseren ersten Aufgaben
          noch nicht.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Viele Beeper ablegen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wenn Karel zum Beispiel 15 Beeper auf demselben Feld ablegen soll,
          wäre es mühsam, fünfzehnmal
          <span className="font-mono"> put_beeper()</span> zu schreiben. Mit
          einer Schleife bleibt die Absicht sichtbar:
        </p>
        <CodeSnippet>{`def main():
    for i in range(15):
        put_beeper()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wichtig ist die Einrückung: Nur die Zeilen unter der
          <span className="font-mono"> for</span>-Zeile gehören zum
          Schleifenkörper und werden wiederholt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Mehrere Zeilen im Schleifenkörper</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Ein Schleifenkörper kann aus mehreren Befehlen bestehen. In der Übung
          unten legt Karel einen Beeper ab, geht zum nächsten Feld und dreht
          sich nach links. Diese drei Befehle werden viermal ausgeführt:
        </p>
        <CodeSnippet>{`def main():
    for i in range(4):
        put_beeper()
        move()
        turn_left()`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Vorbedingung und Nachbedingung</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Der schwierigste Teil an Schleifen ist oft nicht die Schreibweise,
            sondern der Zustand zwischen den Wiederholungen. Am Anfang jeder
            Runde muss Karel so stehen, dass der Schleifenkörper wieder
            sinnvoll ausgeführt werden kann.
          </p>
          <p>
            In der 2x2-Welt unten klappt das, weil Karel nach jeder Runde auf
            das nächste leere Feld schaut. Würdest du
            <span className="font-mono"> turn_left()</span> aus dem
            Schleifenkörper entfernen, wäre diese Annahme nach der ersten Runde
            nicht mehr wahr.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Verschachtelte Schleifen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Später können Schleifen auch andere Schleifen enthalten. Das nennt man
          verschachtelte Schleifen. Unser Runner unterstützt diese einfache
          Form bereits, aber für den Anfang reicht es, eine einzelne Schleife
          sicher zu lesen und zu schreiben.
        </p>
        <CodeSnippet>{`def main():
    for row in range(2):
        for col in range(2):
            put_beeper()`}</CodeSnippet>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterSixContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 6: While-Schleifen" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Funktionen und <span className="font-mono">for</span>-Schleifen
          machen Programme kürzer und klarer. Aber sie führen bei jedem Start
          immer dieselbe feste Anzahl von Schritten aus.
        </p>
        <p>
          Interessanter wird ein Programm, wenn es auf die Welt reagieren kann.
          Karel soll zum Beispiel so lange laufen, bis direkt vor ihm eine Wand
          ist. Dafür muss das Programm nicht wissen, wie breit die Welt ist.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Die Grundform</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Eine <span className="font-mono">while</span>-Schleife wiederholt
          ihren Codeblock, solange eine Bedingung wahr ist:
        </p>
        <CodeSnippet>{`while bedingung():
    befehl()
    noch_ein_befehl()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Bei jedem Durchlauf wird die Bedingung neu geprüft. Ist sie wahr, läuft
          der eingerückte Block. Ist sie falsch, endet die Schleife und das
          Programm macht hinter dem Block weiter.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">front_is_clear()</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die erste Bedingung, die wir verwenden, ist
          <span className="font-mono"> front_is_clear()</span>. Sie ist wahr,
          wenn Karel einen Schritt nach vorne gehen kann. Damit kann Karel bis
          zur Wand laufen:
        </p>
        <CodeSnippet>{`def main():
    while front_is_clear():
        move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Anders als bei einer <span className="font-mono">for</span>-Schleife
          muss die Anzahl der Wiederholungen nicht vorher feststehen. Sie ergibt
          sich aus der aktuellen Welt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Eine Linie aus Beepern</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wenn Karel auf jedem Feld bis zur Wand einen Beeper ablegen soll, liegt
          eine kleine Falle im Programm:
        </p>
        <CodeSnippet>{`def main():
    while front_is_clear():
        put_beeper()
        move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Dieses Programm legt auf vielen Feldern Beeper ab, aber nicht auf dem
          letzten Feld. Dort steht Karel direkt vor der Wand, also ist
          <span className="font-mono"> front_is_clear()</span> falsch und der
          Schleifenkörper läuft nicht mehr.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Der Zaunpfahlfehler</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Dieses Muster heißt Zaunpfahlfehler, auf Englisch
            <span className="font-mono"> fencepost error</span>. Es ist ein
            typischer Off-by-one-Fehler: Zwischen sieben Feldern liegen nur
            sechs Schritte. Der Befehl
            <span className="font-mono"> move()</span> muss also einmal weniger
            ausgeführt werden als
            <span className="font-mono"> put_beeper()</span>.
          </p>
          <p>
            Die einfache Lösung ist, die wiederholbaren Paare in die Schleife zu
            schreiben und danach den letzten Beeper separat abzulegen:
          </p>
        </div>
        <FencepostIllustration />
        <CodeSnippet>{`def main():
    while front_is_clear():
        put_beeper()
        move()
    put_beeper()`}</CodeSnippet>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

const conditionRows = [
  ['front_is_clear()', 'front_is_blocked()', 'Ist vor Karel der Weg frei?'],
  ['beepers_present()', 'no_beepers_present()', 'Liegt auf Karels Feld ein Beeper?'],
  ['left_is_clear()', 'left_is_blocked()', 'Ist links von Karel der Weg frei?'],
  ['right_is_clear()', 'right_is_blocked()', 'Ist rechts von Karel der Weg frei?'],
  ['beepers_in_bag()', 'no_beepers_in_bag()', 'Hat Karel Beeper in der Tasche?'],
  ['facing_north()', 'not_facing_north()', 'Schaut Karel nach Norden?'],
  ['facing_south()', 'not_facing_south()', 'Schaut Karel nach Süden?'],
  ['facing_east()', 'not_facing_east()', 'Schaut Karel nach Osten?'],
  ['facing_west()', 'not_facing_west()', 'Schaut Karel nach Westen?'],
];

const commandReferenceRows = [
  ['move()', 'Karel geht ein Feld nach vorne.'],
  ['turn_left()', 'Karel dreht sich um 90 Grad nach links.'],
  ['turn_right()', 'Karel dreht sich um 90 Grad nach rechts.'],
  ['turn_around()', 'Karel dreht sich um 180 Grad.'],
  ['pick_beeper()', 'Karel hebt einen Beeper auf dem aktuellen Feld auf.'],
  ['put_beeper()', 'Karel legt einen Beeper auf dem aktuellen Feld ab.'],
  ['paint_field("blue")', 'Karel bemalt das aktuelle Feld mit der angegebenen Farbe.'],
];

function ReferenceTable({
  rows,
  headings,
}: {
  rows: string[][];
  headings: string[];
}) {
  return (
    <div className="mt-5 overflow-hidden border border-[#d8d0bd] bg-white">
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
                    index === 0 || index === 1 && headings[1] === 'Gegenteil'
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

function ChapterSevenContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 7: Bedingungen" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Bis jetzt konnte Karel Code wiederholen und in Funktionen aufteilen.
          Mit Bedingungen kommt die letzte große Kontrollstruktur dazu: Karel
          kann abhängig vom Zustand der Welt entscheiden, welcher Code laufen
          soll.
        </p>
        <p>
          Eine Bedingung ist eine Frage mit Ja-oder-Nein-Antwort. Zum Beispiel:
          Liegt auf diesem Feld ein Beeper? Ist der Weg vor Karel frei?
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">if und else</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Eine <span className="font-mono">if</span>-Anweisung führt ihren
          eingerückten Codeblock nur aus, wenn die Bedingung wahr ist. Mit
          <span className="font-mono"> else</span> kannst du angeben, was
          passieren soll, wenn die Bedingung falsch ist:
        </p>
        <CodeSnippet>{`if bedingung():
    befehl_wenn_wahr()
else:
    befehl_wenn_falsch()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Auch hier ist die Einrückung entscheidend. Sie zeigt, welche Befehle
          zum <span className="font-mono">if</span>-Zweig und welche zum
          <span className="font-mono">else</span>-Zweig gehören.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Beeper invertieren</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Ein gutes Beispiel ist eine Funktion, die den Zustand eines Feldes
          umkehrt. Wenn ein Beeper da ist, hebt Karel ihn auf. Wenn keiner da
          ist, legt Karel einen ab:
        </p>
        <CodeSnippet>{`def invert_beeper():
    if beepers_present():
        pick_beeper()
    else:
        put_beeper()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Diese Funktion ist klein, aber mächtig: Zusammen mit einer
          <span className="font-mono">while</span>-Schleife kann Karel eine
          ganze Reihe Feld für Feld invertieren.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">if ohne else</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Manchmal gibt es nur im Ja-Fall etwas zu tun. Dann kann der
          <span className="font-mono">else</span>-Zweig fehlen:
        </p>
        <CodeSnippet>{`if beepers_present():
    pick_beeper()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Das ist wie eine <span className="font-mono">while</span>-Schleife,
          die höchstens einmal läuft: Die Bedingung wird geprüft, der Block wird
          entweder einmal oder gar nicht ausgeführt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Karels Bedingungen</h2>
        <div className="mt-5 overflow-hidden border border-[#d8d0bd] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#faf8f1] text-[#20231f]">
              <tr>
                <th className="border-b border-[#d8d0bd] px-4 py-3">Bedingung</th>
                <th className="border-b border-[#d8d0bd] px-4 py-3">Gegenteil</th>
                <th className="border-b border-[#d8d0bd] px-4 py-3">Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              {conditionRows.map(([condition, opposite, meaning]) => (
                <tr key={condition}>
                  <td className="border-b border-[#eee7d8] px-4 py-3 align-top font-mono text-[#20231f]">
                    {condition}
                  </td>
                  <td className="border-b border-[#eee7d8] px-4 py-3 align-top font-mono text-[#20231f]">
                    {opposite}
                  </td>
                  <td className="border-b border-[#eee7d8] px-4 py-3 leading-6 text-[#4d554c]">
                    {meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterEightContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 8: Schrittweise Verfeinerung" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Je größer ein Programm wird, desto wichtiger wird die Art, wie du es
          aufteilst. Schrittweise Verfeinerung bedeutet: Du beginnst mit dem
          Problem als Ganzem und formulierst zuerst eine grobe Lösung.
        </p>
        <p>
          Erst danach arbeitest du die einzelnen Teilprobleme aus. So bleibt der
          Code verständlich, und du kannst kleine Teile testen, bevor alles
          zusammenkommen muss.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Von oben anfangen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Bei der Turm-Aufgabe soll Karel alle Beeper einsammeln, rechts unten
          stapeln und dann nach Hause zurückkehren. Auf der höchsten Ebene sieht
          das Programm deshalb so aus:
        </p>
        <CodeSnippet>{`def main():
    collect_all_beepers()
    drop_all_beepers()
    return_home()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Diese drei Zeilen lösen noch keine Details. Aber sie machen den Plan
          klar. Beim Lesen weiß man sofort, welche Phasen das Programm hat.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Iterativ testen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Schreibe bei schwierigen Schleifen nicht sofort alles auf einmal.
          Teste zuerst den Körper der Schleife. Für die Turm-Aufgabe kannst du
          zum Beispiel zunächst nur einen Turm einsammeln und dann ein Feld
          weitergehen:
        </p>
        <CodeSnippet>{`def collect_all_beepers():
    # vorläufige Version zum Testen
    collect_one_tower()
    move()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Wenn dieser kleine Teil funktioniert, kannst du ihn später sicher in
          eine <span className="font-mono">while</span>-Schleife einbauen.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Einen Turm verfeinern</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Ein einzelner Turm ist selbst wieder ein Teilproblem. Karel steht unten
          auf der ersten Reihe und schaut nach Osten. Danach soll Karel wieder
          genau dort stehen und wieder nach Osten schauen:
        </p>
        <CodeSnippet>{`def collect_one_tower():
    turn_left()
    collect_line_of_beepers()
    turn_around()
    move_to_wall()
    turn_left()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Diese Funktion behandelt leere Spalten ohne Sonderfall. Eine Spalte
          mit Höhe 0 ist einfach ein Turm, bei dem
          <span className="font-mono"> collect_line_of_beepers()</span> sofort
          fertig ist.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Vorbedingungen und Nachbedingungen</h2>
        <div className="mt-4 space-y-4 leading-8 text-[#4d554c]">
          <p>
            Eine Vorbedingung beschreibt, was vor dem Aufruf einer Funktion wahr
            sein muss. Eine Nachbedingung beschreibt, was danach garantiert
            wieder wahr sein soll.
          </p>
          <p>
            Für <span className="font-mono">collect_one_tower()</span> lautet
            die Vorbedingung: Karel steht unten in einer Spalte und schaut nach
            Osten. Die Nachbedingung ist dieselbe. Genau deshalb kann
            <span className="font-mono"> collect_all_beepers()</span> diese
            Funktion wiederholt aufrufen.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Alle Spalten bearbeiten</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Für das Bearbeiten jeder Spalte taucht wieder das Muster aus Kapitel 6
          auf: Solange vorne frei ist, bearbeite das aktuelle Feld und bewege
          dich weiter. Danach fehlt noch das letzte Feld.
        </p>
        <CodeSnippet>{`def collect_all_beepers():
    while front_is_clear():
        collect_one_tower()
        move()
    collect_one_tower()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Das ist dieselbe Strategie wie bei der Beeper-Linie: Eine Aktion wird
          auf jedem Feld ausgeführt, bis die Reihe an einer Wand endet.
        </p>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterNineContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 9: Karel-Extras" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Neben Beepern und Bewegung kann Karel Felder auch farbig markieren.
          Das ist praktisch, wenn eine Lösung sichtbar Muster erzeugen soll.
        </p>
        <p>
          Im Original heißt der Befehl
          <span className="font-mono"> paint_corner(...)</span>. In unserer
          deutschen Karel-Umgebung schreiben wir
          <span className="font-mono"> paint_field(...)</span>, weil „Feld“ in
          unseren Welten die passendere Übersetzung ist.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Felder bemalen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Mit <span className="font-mono">paint_field()</span> bemalt Karel das
          Feld, auf dem er gerade steht. Der Farbname steht als Text in
          Anführungszeichen:
        </p>
        <CodeSnippet>{`def main():
    paint_field("blue")`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Unterstützte Farben sind zum Beispiel
          <code className="font-mono">{'"blue"'}</code>,
          <code className="font-mono"> {'"red"'}</code>,
          <code className="font-mono"> {'"green"'}</code>,
          <code className="font-mono"> {'"yellow"'}</code> und
          <code className="font-mono"> {'"black"'}</code>. Mit
          <code className="font-mono"> {'"white"'}</code> entfernst du eine
          vorhandene Farbe wieder.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Bemalen und bewegen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Malaufgaben lassen sich mit den bekannten Kontrollstrukturen
          kombinieren. Eine Diagonale entsteht zum Beispiel, wenn Karel ein Feld
          bemalt, dann ein Feld nach Osten und ein Feld nach Norden geht:
        </p>
        <CodeSnippet>{`def step_diagonal():
    paint_field("blue")
    move()
    turn_left()
    move()
    turn_right()`}</CodeSnippet>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

function ChapterTenContent({ orderIndex }: { orderIndex: number }) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 10: Karel-Referenz" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Diese Seite sammelt die bisher unterstützte Karel-Sprache an einem
          Ort. Sie ist als Nachschlagewerk gedacht, wenn du beim Programmieren
          kurz Schreibweise oder Bedeutung prüfen möchtest.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Grundbefehle</h2>
        <ReferenceTable headings={['Befehl', 'Bedeutung']} rows={commandReferenceRows} />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Programmstruktur</h2>
        <CodeSnippet>{`from karel import *


def main():
    # Code, der beim Start ausgeführt wird
    pass


def eigene_funktion():
    # weitere Funktionen stehen nach main()
    pass`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Kommentare</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Alles nach einem <span className="font-mono">#</span> ist ein
          Kommentar und wird von Karel nicht ausgeführt.
        </p>
        <CodeSnippet>{`# Karel ignoriert diese Zeile.
move()  # Dieser Kommentar steht hinter einem Befehl.`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Kontrollstrukturen</h2>
        <CodeSnippet>{`if bedingung():
    code_wenn_wahr()
else:
    code_wenn_falsch()

for i in range(4):
    code_wiederholen()

while bedingung():
    code_wiederholen()`}</CodeSnippet>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Funktionen</h2>
        <CodeSnippet>{`def name():
    befehl()
    noch_ein_befehl()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Funktionen werden mit <span className="font-mono">def</span>
          definiert. Ihr Körper ist eingerückt. Danach kannst du die Funktion
          wie einen normalen Befehl aufrufen.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Bedingungen</h2>
        <ReferenceTable headings={['Bedingung', 'Gegenteil', 'Bedeutung']} rows={conditionRows} />
      </section>
    </article>
  );
}

function ChapterElevenContent({
  orderIndex,
  exercises,
}: {
  orderIndex: number;
  exercises: ReturnType<typeof getChapterExercises>;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl" id="kapitel">
      <ChapterHeader orderIndex={orderIndex} title="Kapitel 11: Weitere Übungen" />

      <section className="prose-none mt-8 space-y-5 text-lg leading-8 text-[#384037]">
        <p>
          Dieses Kapitel ist kein neues Sprachkapitel, sondern eine kleine
          Sammlung zusätzlicher Aufgaben. Die Ideen sind von FredOverflows Karel
          inspiriert und für unsere Python-Umgebung angepasst.
        </p>
        <p>
          Ziel ist jetzt weniger, einen neuen Befehl kennenzulernen, sondern die
          bekannten Werkzeuge geschickter zu kombinieren: Funktionen, Schleifen,
          Bedingungen und genaue Vor- und Nachbedingungen.
        </p>
      </section>

      <section className="mt-10 border-y border-[#d8d0bd] py-8">
        <h2 className="text-2xl font-semibold">Wie du diese Aufgaben angehst</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Beginne bei jeder Aufgabe mit einer kleinen Funktion für den
          wiederkehrenden Teil. Wenn diese Funktion am Ende wieder dieselbe
          Blickrichtung und Position auf der Grundlinie herstellt, kann
          <span className="font-mono"> main()</span> sie zuverlässig mehrfach
          verwenden.
        </p>
        <CodeSnippet>{`def main():
    while front_is_clear():
        bearbeite_aktuelles_teilproblem()
        move()
    bearbeite_aktuelles_teilproblem()`}</CodeSnippet>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Dieses Muster taucht in den Zusatzaufgaben mehrfach wieder auf. Die
          eigentliche Schwierigkeit steckt darin, das Teilproblem sauber zu
          formulieren.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Drei neue Herausforderungen</h2>
        <p className="mt-4 leading-8 text-[#4d554c]">
          Die Aufgaben steigen leicht an: Erst hängt Karel Lampions unter eine
          unregelmäßige Decke, dann säubert er Tunnel mit verschiedenen Höhen
          und zum Schluss springt er über Hürden, deren Höhe nicht vorher fest
          einprogrammiert werden sollte.
        </p>
      </section>

      <TrySection exercises={exercises} />
    </article>
  );
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  const chapter = getChapter(chapterSlug);

  if (!chapter) {
    notFound();
  }

  const exercises = getChapterExercises(chapter.slug);

  return (
    <ReaderShell activeSlug={chapter.slug}>
      {chapter.slug === 'programmieren' ? (
        <ChapterTwoContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'neue-funktionen' ? (
        <ChapterThreeContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'zerlegung' ? (
        <ChapterFourContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'for-schleifen' ? (
        <ChapterFiveContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'while-schleifen' ? (
        <ChapterSixContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'bedingungen' ? (
        <ChapterSevenContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'verfeinerung' ? (
        <ChapterEightContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'extras' ? (
        <ChapterNineContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'referenz' ? (
        <ChapterTenContent orderIndex={chapter.orderIndex} />
      ) : chapter.slug === 'uebungen' ? (
        <ChapterElevenContent exercises={exercises} orderIndex={chapter.orderIndex} />
      ) : (
        <ChapterOneContent exercises={exercises} orderIndex={chapter.orderIndex} />
      )}
    </ReaderShell>
  );
}
