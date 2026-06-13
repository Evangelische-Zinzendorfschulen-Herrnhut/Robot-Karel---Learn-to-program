# Karel World Schema

Karel worlds are stored as JSON in content files and as `jsonb` in Supabase.

## Coordinate System

- `row` starts at `1` at the bottom.
- `col` starts at `1` at the left.
- `direction` is one of `north`, `east`, `south`, `west`.

## Shape

```json
{
  "rows": 4,
  "cols": 6,
  "karel": {
    "row": 1,
    "col": 1,
    "direction": "east",
    "beeperBag": 0
  },
  "beepers": [
    { "row": 1, "col": 2, "count": 1 }
  ],
  "walls": [
    {
      "row": 1,
      "col": 3,
      "edge": "east"
    }
  ]
}
```

## Walls

Walls are represented as blocked edges of cells. A wall at `{ row: 1, col: 3,
edge: "east" }` blocks movement between `(1, 3)` and `(1, 4)`.

Outer boundary walls are implicit and do not need to be stored.

## Goal Matching

For MVP, an exercise passes when all expected goal fields match:

- Karel final position and direction
- beeper locations and counts
- optional beeper bag count if the goal declares it

World definitions may later support partial goals, but the first version should keep
goal checking exact and explainable.
