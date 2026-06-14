import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

type ExerciseCodeSnapshotReadClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{
          data: { latest_code: string | null; status: ExerciseCodeSnapshotStatus } | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

type ExerciseCodeSnapshotsReadClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => Promise<{
      data: { exercise_slug: string; status: ExerciseCodeSnapshotStatus }[] | null;
      error: { message: string } | null;
    }>;
  };
};

export type ExerciseCodeSnapshotStatus = 'started' | 'passed' | 'needs_retry';

export type ExerciseCodeSnapshot = {
  latestCode: string | null;
  status: ExerciseCodeSnapshotStatus | null;
};

export type ChapterCompletion = {
  completedCount: number;
  isComplete: boolean;
  totalCount: number;
};

type ChapterCompletionInput = {
  slug: string;
  exerciseSlugs: string[];
};

function emptyChapterCompletion(totalCount: number): ChapterCompletion {
  return {
    completedCount: 0,
    isComplete: false,
    totalCount,
  };
}

export async function getExerciseCodeSnapshot(exerciseSlug: string): Promise<ExerciseCodeSnapshot> {
  if (!hasSupabaseEnv()) {
    return { latestCode: null, status: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { latestCode: null, status: null };
  }

  const exerciseCodeSnapshots = supabase.from(
    'exercise_code_snapshots',
  ) as unknown as ExerciseCodeSnapshotReadClient;
  const { data: progress } = await exerciseCodeSnapshots
    .select('latest_code,status')
    .eq('user_id', user.id)
    .eq('exercise_slug', exerciseSlug)
    .maybeSingle();

  return {
    latestCode: progress?.latest_code ?? null,
    status: progress?.status ?? null,
  };
}

export async function getChapterCompletions(chapters: ChapterCompletionInput[]) {
  const fallback = Object.fromEntries(
    chapters.map((chapter) => [chapter.slug, emptyChapterCompletion(chapter.exerciseSlugs.length)]),
  ) as Record<string, ChapterCompletion>;

  if (chapters.length === 0 || !hasSupabaseEnv()) {
    return fallback;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fallback;
  }

  const exerciseCodeSnapshots = supabase.from(
    'exercise_code_snapshots',
  ) as unknown as ExerciseCodeSnapshotsReadClient;
  const { data: snapshots, error } = await exerciseCodeSnapshots
    .select('exercise_slug,status')
    .eq('user_id', user.id);

  if (error) {
    return fallback;
  }

  const passedExerciseSlugs = new Set(
    (snapshots ?? [])
      .filter((snapshot) => snapshot.status === 'passed')
      .map((snapshot) => snapshot.exercise_slug),
  );

  return Object.fromEntries(
    chapters.map((chapter) => {
      const completedCount = chapter.exerciseSlugs.filter((slug) => passedExerciseSlugs.has(slug)).length;

      return [
        chapter.slug,
        {
          completedCount,
          isComplete: chapter.exerciseSlugs.length > 0 && completedCount === chapter.exerciseSlugs.length,
          totalCount: chapter.exerciseSlugs.length,
        },
      ];
    }),
  ) as Record<string, ChapterCompletion>;
}

export async function getChapterCompletion(exerciseSlugs: string[]) {
  return (
    await getChapterCompletions([
      {
        slug: 'current',
        exerciseSlugs,
      },
    ])
  ).current;
}
