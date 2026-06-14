import Link from 'next/link';

import { AuthStatus } from '@/components/auth/auth-status';
import { getChapters, getCourse } from '@/lib/content/course';
import { getChapterCompletions } from '@/lib/course/progress';

export default async function CoursePage() {
  const course = getCourse();
  const chapters = getChapters();
  const chapterCompletions = await getChapterCompletions(chapters);

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <header className="flex items-center justify-between gap-4">
          <Link className="text-sm font-medium text-[#3d6f5a]" href="/">
            Zur Startseite
          </Link>
          <AuthStatus />
        </header>
        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Kurs
          </p>
          <h1 className="mt-3 text-4xl font-bold">{course.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[#4d554c]">{course.description}</p>
        </div>
        <div className="mt-10 space-y-4">
          {chapters.map((chapter) => {
            const completion = chapterCompletions[chapter.slug];

            return (
              <Link
                className={`block border bg-white p-5 transition-colors hover:border-[#3d6f5a] ${
                  completion?.isComplete ? 'border-[#9cc8a9]' : 'border-[#d8d0bd]'
                }`}
                href={`/lernen/${chapter.slug}`}
                key={chapter.slug}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-[#3d6f5a]">
                    Kapitel {chapter.orderIndex}
                  </p>
                  {completion?.isComplete ? (
                    <span className="inline-flex items-center gap-2 border border-[#9cc8a9] bg-[#eef7f1] px-2 py-1 text-xs font-semibold text-[#24583a]">
                      <span aria-hidden="true">✓</span>
                      Vollständig
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{chapter.title}</h2>
                <p className="mt-3 leading-7 text-[#4d554c]">{chapter.summary}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
