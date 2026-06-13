import type {
  BeeperPile,
  Direction,
  KarelCommand,
  KarelRuntimeError,
  KarelWorld,
  WallEdge,
} from '@/domain/karel';

type CommandResult =
  | {
      ok: true;
      world: KarelWorld;
    }
  | {
      ok: false;
      world: KarelWorld;
      error: KarelRuntimeError;
    };

const leftTurn: Record<Direction, Direction> = {
  north: 'west',
  west: 'south',
  south: 'east',
  east: 'north',
};

const rightTurn: Record<Direction, Direction> = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
};

const oppositeEdge: Record<WallEdge, WallEdge> = {
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east',
};

function cloneWorld(world: KarelWorld): KarelWorld {
  return {
    rows: world.rows,
    cols: world.cols,
    karel: { ...world.karel },
    beepers: world.beepers.map((beeper) => ({ ...beeper })),
    walls: world.walls.map((wall) => ({ ...wall })),
    paintedCorners: world.paintedCorners?.map((corner) => ({ ...corner })),
  };
}

function getNextPosition(world: KarelWorld) {
  const { row, col, direction } = world.karel;

  if (direction === 'north') return { row: row + 1, col };
  if (direction === 'east') return { row, col: col + 1 };
  if (direction === 'south') return { row: row - 1, col };

  return { row, col: col - 1 };
}

function isInsideWorld(world: KarelWorld, row: number, col: number) {
  return row >= 1 && row <= world.rows && col >= 1 && col <= world.cols;
}

function hasWallAt(world: KarelWorld, row: number, col: number, edge: WallEdge) {
  return world.walls.some((wall) => wall.row === row && wall.col === col && wall.edge === edge);
}

export function frontIsClear(world: KarelWorld) {
  const { row, col, direction } = world.karel;
  const nextPosition = getNextPosition(world);

  if (!isInsideWorld(world, nextPosition.row, nextPosition.col)) {
    return false;
  }

  return (
    !hasWallAt(world, row, col, direction) &&
    !hasWallAt(world, nextPosition.row, nextPosition.col, oppositeEdge[direction])
  );
}

export function beepersPresent(world: KarelWorld) {
  return world.beepers.some(
    (beeper) => beeper.row === world.karel.row && beeper.col === world.karel.col && beeper.count > 0,
  );
}

function updateBeeperPile(
  beepers: BeeperPile[],
  row: number,
  col: number,
  updater: (count: number) => number,
) {
  const existing = beepers.find((beeper) => beeper.row === row && beeper.col === col);

  if (!existing) {
    return beepers;
  }

  return beepers
    .map((beeper) => {
      if (beeper.row !== row || beeper.col !== col) {
        return beeper;
      }

      return {
        ...beeper,
        count: updater(beeper.count),
      };
    })
    .filter((beeper) => beeper.count > 0);
}

export function runKarelCommand(world: KarelWorld, command: KarelCommand): CommandResult {
  const nextWorld = cloneWorld(world);

  if (command === 'turn_left') {
    nextWorld.karel.direction = leftTurn[nextWorld.karel.direction];
    return { ok: true, world: nextWorld };
  }

  if (command === 'turn_right') {
    nextWorld.karel.direction = rightTurn[nextWorld.karel.direction];
    return { ok: true, world: nextWorld };
  }

  if (command === 'turn_around') {
    nextWorld.karel.direction = rightTurn[rightTurn[nextWorld.karel.direction]];
    return { ok: true, world: nextWorld };
  }

  if (command === 'move') {
    if (!frontIsClear(world)) {
      return {
        ok: false,
        world,
        error: {
          code: 'blocked_by_wall',
          message: 'Karel kann nicht nach vorne gehen.',
        },
      };
    }

    const { row, col } = getNextPosition(world);
    nextWorld.karel.row = row;
    nextWorld.karel.col = col;
    return { ok: true, world: nextWorld };
  }

  if (command === 'pick_beeper') {
    if (!beepersPresent(world)) {
      return {
        ok: false,
        world,
        error: {
          code: 'missing_beeper',
          message: 'Auf diesem Feld liegt kein Beeper.',
        },
      };
    }

    nextWorld.beepers = updateBeeperPile(world.beepers, world.karel.row, world.karel.col, (count) => count - 1);
    nextWorld.karel.beeperBag = (nextWorld.karel.beeperBag ?? 0) + 1;
    return { ok: true, world: nextWorld };
  }

  const beeperBag = world.karel.beeperBag ?? 0;

  if (beeperBag <= 0) {
    return {
      ok: false,
      world,
      error: {
        code: 'empty_beeper_bag',
        message: 'Karels Beeper-Tasche ist leer.',
      },
    };
  }

  const existingBeeper = world.beepers.find(
    (beeper) => beeper.row === world.karel.row && beeper.col === world.karel.col,
  );

  nextWorld.karel.beeperBag = beeperBag - 1;
  nextWorld.beepers = existingBeeper
    ? updateBeeperPile(world.beepers, world.karel.row, world.karel.col, (count) => count + 1)
    : [...world.beepers, { row: world.karel.row, col: world.karel.col, count: 1 }];

  return { ok: true, world: nextWorld };
}
