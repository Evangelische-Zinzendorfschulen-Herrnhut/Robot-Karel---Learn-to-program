export type Direction = 'north' | 'east' | 'south' | 'west';
export type WallEdge = Direction;

export type KarelPosition = {
  row: number;
  col: number;
};

export type KarelState = KarelPosition & {
  direction: Direction;
  beeperBag?: number;
};

export type BeeperPile = KarelPosition & {
  count: number;
};

export type WallSegment = KarelPosition & {
  edge: WallEdge;
};

export type PaintedCorner = KarelPosition & {
  color: string;
};

export type KarelWorld = {
  rows: number;
  cols: number;
  karel: KarelState;
  beepers: BeeperPile[];
  walls: WallSegment[];
  paintedCorners?: PaintedCorner[];
};

export type KarelCommand =
  | 'move'
  | 'turn_left'
  | 'turn_right'
  | 'turn_around'
  | 'pick_beeper'
  | 'put_beeper'
  | 'paint_field';

export type KarelCondition =
  | 'front_is_clear'
  | 'left_is_clear'
  | 'right_is_clear'
  | 'beepers_present'
  | 'no_beepers_present';

export type KarelAction = {
  command: KarelCommand;
  before: KarelWorld;
  after: KarelWorld;
};

export type KarelRuntimeErrorCode =
  | 'blocked_by_wall'
  | 'missing_beeper'
  | 'empty_beeper_bag'
  | 'step_limit_exceeded'
  | 'python_error';

export type KarelRuntimeError = {
  code: KarelRuntimeErrorCode;
  message: string;
  line?: number;
};
