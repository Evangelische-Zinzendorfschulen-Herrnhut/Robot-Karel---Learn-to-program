import Link from 'next/link';

import { getChapters, getCourse } from '@/lib/content/course';

export default function CoursePage() {
  const course = getCourse();
  const chapters = getChapters().filter((chapter) => chapter.slug !== 'referenz');

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#20231f]">
      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="text-sm font-medium text-[#3d6f5a]" href="/">
            Zur Startseite
          </Link>
          <Link
            className="border border-[#20231f] px-4 py-2 text-sm font-semibold text-[#20231f] transition-colors hover:bg-white"
            href="/login?next=/lernen"
          >
            Einloggen
          </Link>
        </div>
        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Kurs
          </p>
          <h1 className="mt-3 text-4xl font-bold">{course.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[#4d554c]">{course.description}</p>
        </div>
        <div className="mt-10 space-y-4">
          {chapters.map((chapter) => (
            <Link
              className="block border border-[#d8d0bd] bg-white p-5 transition-colors hover:border-[#3d6f5a]"
              href={`/lernen/${chapter.slug}`}
              key={chapter.slug}
            >
              <p className="text-sm font-semibold text-[#3d6f5a]">
                Kapitel {chapter.orderIndex}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{chapter.title}</h2>
              <p className="mt-3 leading-7 text-[#4d554c]">{chapter.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
