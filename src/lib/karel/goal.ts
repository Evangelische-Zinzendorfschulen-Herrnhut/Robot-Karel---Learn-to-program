import type { BeeperPile, KarelWorld, PaintedCorner } from '@/domain/karel';

function sortBeepers(beepers: BeeperPile[]) {
  return [...beepers].sort((a, b) => a.row - b.row || a.col - b.col || a.count - b.count);
}

function beepersMatch(actual: BeeperPile[], expected: BeeperPile[]) {
  const sortedActual = sortBeepers(actual);
  const sortedExpected = sortBeepers(expected);

  if (sortedActual.length !== sortedExpected.length) {
    return false;
  }

  return sortedActual.every((actualBeeper, index) => {
    const expectedBeeper = sortedExpected[index];

    return (
      actualBeeper.row === expectedBeeper.row &&
      actualBeeper.col === expectedBeeper.col &&
      actualBeeper.count === expectedBeeper.count
    );
  });
}

function sortPaintedCorners(corners: PaintedCorner[]) {
  return [...corners].sort((a, b) => a.row - b.row || a.col - b.col || a.color.localeCompare(b.color));
}

function paintedCornersMatch(actual: PaintedCorner[] = [], expected: PaintedCorner[] = []) {
  const sortedActual = sortPaintedCorners(actual);
  const sortedExpected = sortPaintedCorners(expected);

  if (sortedActual.length !== sortedExpected.length) {
    return false;
  }

  return sortedActual.every((actualCorner, index) => {
    const expectedCorner = sortedExpected[index];

    return (
      actualCorner.row === expectedCorner.row &&
      actualCorner.col === expectedCorner.col &&
      actualCorner.color === expectedCorner.color
    );
  });
}

export function worldMatchesGoal(actual: KarelWorld, goal: KarelWorld) {
  return (
    actual.karel.row === goal.karel.row &&
    actual.karel.col === goal.karel.col &&
    actual.karel.direction === goal.karel.direction &&
    (goal.karel.beeperBag === undefined || actual.karel.beeperBag === goal.karel.beeperBag) &&
    beepersMatch(actual.beepers, goal.beepers) &&
    paintedCornersMatch(actual.paintedCorners, goal.paintedCorners)
  );
}
