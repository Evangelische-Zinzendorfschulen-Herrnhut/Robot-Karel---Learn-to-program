# MVP Data Contract

## Content Files

Chapters live as MDX files and reference exercises by stable slug:

```mdx
<KarelExercise slug="first-step" />
```

Exercises live as JSON files under `content/exercises`.

## Runtime Contract

The browser runtime receives:

- starter code
- initial world
- visible test cases
- hidden test case count

The runtime returns:

- code
- status
- step count
- error message if any
- per-test result summaries
- optional action replay

## Submission Status

Submission status values:

- `queued`
- `running`
- `passed`
- `failed`
- `error`
- `timeout`

For the MVP, execution happens in the browser, so `queued` and `running` are mostly
reserved for future server-side evaluation.

## Exercise Progress Status

Exercise progress values:

- `not_started`
- `started`
- `passed`
- `needs_retry`

## Chapter Progress Status

Chapter progress values:

- `not_started`
- `started`
- `completed`
