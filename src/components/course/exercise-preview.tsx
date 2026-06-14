import type { Exercise } from '@/domain/course';
import { KarelCommandPanel } from '@/components/karel/karel-command-panel';
import { getExerciseCodeSnapshot } from '@/lib/course/progress';

type ExercisePreviewProps = {
  exercise: Exercise;
};

export async function ExercisePreview({ exercise }: ExercisePreviewProps) {
  const snapshot = await getExerciseCodeSnapshot(exercise.slug);

  return (
    <article className="border border-[#d8d0bd] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Aufgabe
          </p>
          <h3 className="mt-2 text-xl font-semibold">{exercise.title}</h3>
        </div>
        <span className="border border-[#d8d0bd] px-2 py-1 text-xs font-medium text-[#4d554c]">
          {exercise.difficulty}
        </span>
      </div>
      <p className="mt-4 leading-7 text-[#4d554c]">{exercise.prompt}</p>
      <KarelCommandPanel
        exercise={exercise}
        initialCode={snapshot.latestCode ?? undefined}
        initialStatus={snapshot.status ?? undefined}
      />
    </article>
  );
}
