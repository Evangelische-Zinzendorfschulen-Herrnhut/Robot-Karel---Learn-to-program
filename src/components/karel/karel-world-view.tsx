import Image from 'next/image';

import type { Direction, KarelWorld, WallEdge } from '@/domain/karel';

type KarelWorldViewProps = {
  title: string;
  world: KarelWorld;
};

const directionLabel: Record<Direction, string> = {
  north: 'Norden',
  east: 'Osten',
  south: 'Süden',
  west: 'Westen',
};

const robotRotation: Record<Direction, string> = {
  north: 'rotate(-90deg)',
  east: 'rotate(0deg)',
  south: 'rotate(90deg)',
  west: 'scaleX(-1)',
};

const wallClassName: Record<WallEdge, string> = {
  north: 'left-0 right-0 top-0 h-1',
  east: 'bottom-0 right-0 top-0 w-1',
  south: 'bottom-0 left-0 right-0 h-1',
  west: 'bottom-0 left-0 top-0 w-1',
};

const paintedCornerClassName: Record<string, string> = {
  black: 'bg-[#2f332f]',
  blue: 'bg-[#8fb7df]',
  red: 'bg-[#e58a80]',
  green: 'bg-[#9ec89d]',
  yellow: 'bg-[#f0d878]',
  orange: 'bg-[#e8a45e]',
  purple: 'bg-[#b7a0d8]',
  white: 'bg-white',
};

function hasWall(world: KarelWorld, row: number, col: number, edge: WallEdge) {
  return world.walls.some((wall) => wall.row === row && wall.col === col && wall.edge === edge);
}

function getPaintedCornerColor(world: KarelWorld, row: number, col: number) {
  return world.paintedCorners?.find((corner) => corner.row === row && corner.col === col)?.color;
}

function getBeeperCount(world: KarelWorld, row: number, col: number) {
  return world.beepers.find((beeper) => beeper.row === row && beeper.col === col)?.count ?? 0;
}

function getGridCells(world: KarelWorld) {
  const cells = [];

  for (let row = world.rows; row >= 1; row -= 1) {
    for (let col = 1; col <= world.cols; col += 1) {
      cells.push({ row, col });
    }
  }

  return cells;
}

function formatWorldSize(world: KarelWorld) {
  const colLabel = world.cols === 1 ? 'Spalte' : 'Spalten';
  const rowLabel = world.rows === 1 ? 'Zeile' : 'Zeilen';

  return `${world.cols} ${colLabel} und ${world.rows} ${rowLabel}`;
}

export function KarelWorldView({ title, world }: KarelWorldViewProps) {
  const cells = getGridCells(world);
  const cellSize = world.cols >= 8 ? 52 : Math.max(world.rows, world.cols) <= 4 ? 72 : 58;
  const worldSize = formatWorldSize(world);

  return (
    <figure className="border border-[#d8d0bd] bg-[#faf8f1] p-4">
      <figcaption className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Karel-Welt
          </p>
          <h4 className="mt-1 font-semibold text-[#20231f]">{title}</h4>
        </div>
        <p className="text-right text-xs leading-5 text-[#5f665e]">
          {world.cols} x {world.rows}
          <br />
          Blick nach {directionLabel[world.karel.direction]}
        </p>
      </figcaption>
      <div className="mt-4 overflow-x-auto pb-1">
        <div
          aria-label={`${title}: ${worldSize}`}
          className="grid w-fit gap-px overflow-hidden border border-[#cfc6b4] bg-[#d8d0bd] p-px"
          style={{ gridTemplateColumns: `repeat(${world.cols}, ${cellSize}px)` }}
        >
          {cells.map(({ row, col }) => {
            const isKarel = world.karel.row === row && world.karel.col === col;
            const beeperCount = getBeeperCount(world, row, col);
            const paintedColor = getPaintedCornerColor(world, row, col);
            const walls = (['north', 'east', 'south', 'west'] as WallEdge[]).filter((edge) =>
              hasWall(world, row, col, edge),
            );

            return (
              <div
                className={`relative flex aspect-square items-center justify-center ${
                  paintedColor ? paintedCornerClassName[paintedColor] ?? 'bg-[#dce8dc]' : 'bg-white'
                }`}
                key={`${row}-${col}`}
              >
                {walls.map((edge) => (
                  <span
                    aria-hidden="true"
                    className={`absolute z-20 bg-[#20231f] ${wallClassName[edge]}`}
                    key={edge}
                  />
                ))}
                {beeperCount > 0 ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Image
                      alt=""
                      className="h-10 w-10 object-contain [image-rendering:pixelated]"
                      height={40}
                      src="/sprites/beeper-gem-generated.png"
                      width={40}
                    />
                    {beeperCount > 1 ? (
                      <span className="absolute right-1 top-1 rounded-sm bg-white/90 px-1 text-xs font-bold text-[#20231f]">
                        {beeperCount}
                      </span>
                    ) : null}
                  </span>
                ) : null}
                {isKarel ? (
                  <span
                    aria-label={`Karel in Zeile ${row}, Spalte ${col}, Blick nach ${directionLabel[world.karel.direction]}`}
                    className="flex h-12 w-12 items-center justify-center"
                  >
                    <Image
                      alt=""
                      className="h-14 w-14 object-contain [image-rendering:pixelated]"
                      height={60}
                      src="/sprites/karel-robot-generated.png"
                      style={{ transform: robotRotation[world.karel.direction] }}
                      width={60}
                    />
                  </span>
                ) : null}
                <span className="absolute bottom-1 left-1 text-[10px] text-[#aaa190]">
                  {col},{row}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
