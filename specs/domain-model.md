# Karel Learning Platform Domain Model

## Product Scope

The platform combines a chapter-based Karel reader with interactive Python exercises.
Visitors can create an account, work through chapters, solve Karel tasks, and resume
their progress later.

## Core Concepts

### Profile

A profile represents the public application record for a Supabase Auth user.
Authentication itself is handled by Supabase Auth. The app stores only product-level
metadata such as display name and role.

Roles:

- `student`: default learner role
- `teacher`: can later review class progress and create assignments
- `admin`: can manage platform content

### Course

A course is a versioned learning path. The first course will be the Python Karel
course, but the model allows future courses or major revisions without overwriting
historic progress.

### Chapter

A chapter is a reader page, usually backed by MDX content. It can embed one or more
interactive exercises.

### Exercise

An exercise is a programmable Karel task. It contains prompt text, starter code, a
public initial world, a public goal world, and one or more test cases.

Exercises are authored as content files and can be mirrored into Supabase so that
progress and submissions point at stable exercise records.

### Karel World

A Karel world is a serializable grid state:

- dimensions
- Karel position and direction
- wall segments
- beepers
- optional beepers in Karel's bag

Coordinates use one-based row and column values. Row `1` is the bottom row, matching
traditional Karel notation.

### Submission

A submission is one attempt to solve an exercise. It stores the learner's code,
execution result, test results, and optional replay data.

### Progress

Progress is the current learner state for a chapter or exercise:

- chapter read state
- exercise status
- latest saved code
- best passing submission

Progress is derived from submissions where possible, but stored explicitly to make
resume screens and dashboards fast.

## MVP User Journey

1. A visitor opens the reader.
2. The visitor signs in with Supabase Auth.
3. The learner reads a chapter.
4. The learner opens an embedded Karel exercise.
5. Python runs in the browser through Pyodide.
6. The browser submits the result summary and code to the backend.
7. Supabase stores submission and progress.
8. The learner can resume later.

## Non-Goals For The First Build

- Server-side execution of arbitrary Python
- Multi-class classroom management
- Payment or course sales
- Full teacher dashboards
- Real-time collaboration
