import type { Direction, KarelWorld } from '@/domain/karel';

const directionLabel: Record<Direction, string> = {
  north: 'Norden',
  east: 'Osten',
  south: 'Süden',
  west: 'Westen',
};

function formatBeeperCount(count: number) {
  if (count === 0) {
    return 'keine Beeper';
  }

  if (count === 1) {
    return '1 Beeper';
  }

  return `${count} Beeper`;
}

export function describeGoalWorld(goalWorld: KarelWorld) {
  const beeperTotal = goalWorld.beepers.reduce((total, beeper) => total + beeper.count, 0);
  const beeperBag = goalWorld.karel.beeperBag ?? 0;
  const paintedCount = goalWorld.paintedCorners?.length ?? 0;

  const description = [
    `Karel soll am Ende in Spalte ${goalWorld.karel.col}, Zeile ${goalWorld.karel.row} stehen.`,
    `Karel soll nach ${directionLabel[goalWorld.karel.direction]} schauen.`,
    `In der Welt sollen ${formatBeeperCount(beeperTotal)} liegen.`,
    `Karel soll ${formatBeeperCount(beeperBag)} in der Tasche haben.`,
  ];

  if (paintedCount > 0) {
    description.push(`${paintedCount} Felder sollen bemalt sein.`);
  }

  return description;
}
