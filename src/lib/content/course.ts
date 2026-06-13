import courseData from '../../../content/course.json';
import beeperLineToWallExercise from '../../../content/exercises/beeper-line-to-wall.json';
import cleanTunnelsExercise from '../../../content/exercises/clean-tunnels.json';
import collectBeeperTowersExercise from '../../../content/exercises/collect-beeper-towers.json';
import collectNewspaperExercise from '../../../content/exercises/collect-newspaper.json';
import collectOppositeCornersExercise from '../../../content/exercises/collect-opposite-corners.json';
import defineTurnRightExercise from '../../../content/exercises/define-turn-right.json';
import fillPotholeExercise from '../../../content/exercises/fill-pothole.json';
import firstStepExercise from '../../../content/exercises/first-step.json';
import hangLampionsExercise from '../../../content/exercises/hang-lampions.json';
import invertBeeperLineExercise from '../../../content/exercises/invert-beeper-line.json';
import jumpHurdlesExercise from '../../../content/exercises/jump-hurdles.json';
import markFourCornersExercise from '../../../content/exercises/mark-four-corners.json';
import paintBlueDiagonalExercise from '../../../content/exercises/paint-blue-diagonal.json';
import placeBeeperOnLedgeExercise from '../../../content/exercises/place-beeper-on-ledge.json';
import repairFourPotholesExercise from '../../../content/exercises/repair-four-potholes.json';

import type { Exercise } from '@/domain/course';

export type CourseChapterContent = {
  slug: string;
  title: string;
  summary: string;
  orderIndex: number;
  mdxPath: string;
  exerciseSlugs: string[];
};

export type CourseContent = {
  slug: string;
  title: string;
  description: string;
  language: string;
  chapters: CourseChapterContent[];
};

const exercisesBySlug = {
  'first-step': firstStepExercise as Exercise,
  'collect-newspaper': collectNewspaperExercise as Exercise,
  'place-beeper-on-ledge': placeBeeperOnLedgeExercise as Exercise,
  'define-turn-right': defineTurnRightExercise as Exercise,
  'fill-pothole': fillPotholeExercise as Exercise,
  'mark-four-corners': markFourCornersExercise as Exercise,
  'repair-four-potholes': repairFourPotholesExercise as Exercise,
  'beeper-line-to-wall': beeperLineToWallExercise as Exercise,
  'collect-opposite-corners': collectOppositeCornersExercise as Exercise,
  'invert-beeper-line': invertBeeperLineExercise as Exercise,
  'collect-beeper-towers': collectBeeperTowersExercise as Exercise,
  'paint-blue-diagonal': paintBlueDiagonalExercise as Exercise,
  'hang-lampions': hangLampionsExercise as Exercise,
  'clean-tunnels': cleanTunnelsExercise as Exercise,
  'jump-hurdles': jumpHurdlesExercise as Exercise,
};

export function getCourse(): CourseContent {
  return courseData as CourseContent;
}

export function getChapters() {
  return [...getCourse().chapters].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getChapter(slug: string) {
  return getChapters().find((chapter) => chapter.slug === slug) ?? null;
}

export function getExercise(slug: string): Exercise | null {
  return exercisesBySlug[slug as keyof typeof exercisesBySlug] ?? null;
}

export function getChapterExercises(chapterSlug: string) {
  const chapter = getChapter(chapterSlug);

  if (!chapter) {
    return [];
  }

  return chapter.exerciseSlugs
    .map((slug) => getExercise(slug))
    .filter((exercise): exercise is Exercise => exercise !== null);
}
