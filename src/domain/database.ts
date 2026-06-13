import type {
  AppRole,
  ChapterProgressStatus,
  ExerciseDifficulty,
  ExerciseProgressStatus,
  SubmissionStatus,
} from './course';
import type { KarelWorld } from './karel';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      app_role: AppRole;
      chapter_progress_status: ChapterProgressStatus;
      exercise_progress_status: ExerciseProgressStatus;
      submission_status: SubmissionStatus;
      exercise_difficulty: ExerciseDifficulty;
    };
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: AppRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: AppRole;
        };
        Update: {
          display_name?: string | null;
          role?: AppRole;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          language: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          language?: string;
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      chapters: {
        Row: {
          id: string;
          course_id: string;
          slug: string;
          title: string;
          summary: string | null;
          order_index: number;
          mdx_path: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          slug: string;
          title: string;
          summary?: string | null;
          order_index: number;
          mdx_path: string;
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['chapters']['Insert']>;
      };
      exercises: {
        Row: {
          id: string;
          chapter_id: string | null;
          slug: string;
          title: string;
          prompt: string;
          difficulty: ExerciseDifficulty;
          order_index: number;
          starter_code: string;
          initial_world: KarelWorld;
          goal_world: KarelWorld;
          hints: Json;
          concepts: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id?: string | null;
          slug: string;
          title: string;
          prompt: string;
          difficulty?: ExerciseDifficulty;
          order_index?: number;
          starter_code: string;
          initial_world: KarelWorld;
          goal_world: KarelWorld;
          hints?: Json;
          concepts?: string[];
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
      exercise_tests: {
        Row: {
          id: string;
          exercise_id: string;
          name: string;
          initial_world: KarelWorld;
          goal_world: KarelWorld;
          is_hidden: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          exercise_id: string;
          name: string;
          initial_world: KarelWorld;
          goal_world: KarelWorld;
          is_hidden?: boolean;
          order_index?: number;
        };
        Update: Partial<Database['public']['Tables']['exercise_tests']['Insert']>;
      };
      chapter_progress: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          status: ChapterProgressStatus;
          last_seen_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_id: string;
          status?: ChapterProgressStatus;
          last_seen_at?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['chapter_progress']['Insert']>;
      };
      exercise_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          status: ExerciseProgressStatus;
          latest_code: string | null;
          best_submission_id: string | null;
          started_at: string | null;
          passed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          status?: ExerciseProgressStatus;
          latest_code?: string | null;
          best_submission_id?: string | null;
          started_at?: string | null;
          passed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['exercise_progress']['Insert']>;
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          code: string;
          status: SubmissionStatus;
          step_count: number | null;
          error_message: string | null;
          test_results: Json;
          action_replay: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          code: string;
          status: SubmissionStatus;
          step_count?: number | null;
          error_message?: string | null;
          test_results?: Json;
          action_replay?: Json | null;
        };
        Update: never;
      };
    };
  };
};
