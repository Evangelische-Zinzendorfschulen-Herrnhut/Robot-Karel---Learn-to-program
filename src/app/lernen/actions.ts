'use server';

import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

type ExerciseCodeSnapshotStatus = 'started' | 'passed' | 'needs_retry';

type ExerciseCodeSnapshotUpsert = {
  user_id: string;
  exercise_slug: string;
  latest_code: string;
  status: ExerciseCodeSnapshotStatus;
};

type SupabaseMutationError = {
  message: string;
};

type ExerciseCodeSnapshotMutationClient = {
  upsert: (
    values: ExerciseCodeSnapshotUpsert,
    options: { onConflict: string },
  ) => Promise<{ error: SupabaseMutationError | null }>;
};

export type SaveExerciseCodeResult =
  | { status: 'saved' }
  | { status: 'unauthenticated' }
  | { status: 'missing-table' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string };

export async function saveExerciseCodeAction({
  code,
  exerciseSlug,
  passed,
}: {
  code: string;
  exerciseSlug: string;
  passed: boolean;
}): Promise<SaveExerciseCodeResult> {
  if (!hasSupabaseEnv()) {
    return { status: 'not-configured' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: 'unauthenticated' };
  }

  const progressStatus: ExerciseCodeSnapshotStatus = passed ? 'passed' : 'needs_retry';
  const progress: ExerciseCodeSnapshotUpsert = {
    user_id: user.id,
    exercise_slug: exerciseSlug,
    latest_code: code,
    status: progressStatus,
  };

  const exerciseCodeSnapshots = supabase.from(
    'exercise_code_snapshots',
  ) as unknown as ExerciseCodeSnapshotMutationClient;
  const { error: progressError } = await exerciseCodeSnapshots.upsert(progress, {
    onConflict: 'user_id,exercise_slug',
  });

  if (progressError) {
    if (progressError.message.includes("Could not find the table 'public.exercise_code_snapshots'")) {
      return { status: 'missing-table' };
    }

    return { status: 'error', message: progressError.message };
  }

  return { status: 'saved' };
}
