import type { KarelAction, KarelWorld } from './karel';

export type AppRole = 'student' | 'teacher' | 'admin';
export type ChapterProgressStatus = 'not_started' | 'started' | 'completed';
export type ExerciseProgressStatus = 'not_started' | 'started' | 'passed' | 'needs_retry';
export type SubmissionStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timeout';
export type ExerciseDifficulty = 'intro' | 'easy' | 'medium' | 'hard' | 'challenge';

export type Profile = {
  id: string;
  displayName: string | null;
  role: AppRole;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  language: string;
  isPublished: boolean;
};

export type Chapter = {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  summary: string | null;
  orderIndex: number;
  mdxPath: string;
  isPublished: boolean;
};

export type ExerciseHint = {
  title?: string;
  body: string;
};

export type ExerciseTest = {
  id?: string;
  name: string;
  initialWorld: KarelWorld;
  goalWorld: KarelWorld;
  isHidden: boolean;
  orderIndex: number;
};

export type Exercise = {
  id?: string;
  chapterId?: string | null;
  slug: string;
  title: string;
  prompt: string;
  difficulty: ExerciseDifficulty;
  orderIndex: number;
  starterCode: string;
  initialWorld: KarelWorld;
  goalWorld: KarelWorld;
  hints: ExerciseHint[];
  concepts: string[];
  isPublished: boolean;
  tests: ExerciseTest[];
};

export type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  message?: string;
  stepCount?: number;
};

export type Submission = {
  id: string;
  userId: string;
  exerciseId: string;
  code: string;
  status: SubmissionStatus;
  stepCount: number | null;
  errorMessage: string | null;
  testResults: TestResult[];
  actionReplay: KarelAction[] | null;
  createdAt: string;
};

export type ChapterProgress = {
  id: string;
  userId: string;
  chapterId: string;
  status: ChapterProgressStatus;
  lastSeenAt: string | null;
  completedAt: string | null;
};

export type ExerciseProgress = {
  id: string;
  userId: string;
  exerciseId: string;
  status: ExerciseProgressStatus;
  latestCode: string | null;
  bestSubmissionId: string | null;
  startedAt: string | null;
  passedAt: string | null;
};
