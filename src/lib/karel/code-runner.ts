import type { Direction, KarelCommand, KarelRuntimeError, KarelWorld, WallEdge } from '@/domain/karel';
import { beepersPresent, frontIsClear, runKarelCommand } from '@/lib/karel/engine';

type CodeRunResult =
  | {
      ok: true;
      world: KarelWorld;
      commands: KarelCommand[];
      steps: KarelExecutionStep[];
    }
  | {
      ok: false;
      world: KarelWorld;
      commands: KarelCommand[];
      steps: KarelExecutionStep[];
      error: KarelRuntimeError;
    };

export type KarelExecutionStep = {
  command: KarelCommand;
  lineNumber: number;
  before: KarelWorld;
  after: KarelWorld;
};

type ParsedFunction = {
  name: string;
  lineNumber: number;
  body: {
    line: string;
    lineNumber: number;
  }[];
};

type ParsedProgram =
  | {
      ok: true;
      functions: Map<string, ParsedFunction>;
    }
  | {
      ok: false;
      error: KarelRuntimeError;
    };

type FunctionLine = ParsedFunction['body'][number];
type BlockExecutionResult = {
  nextIndex: number;
  error: KarelRuntimeError | null;
};
type BlockBounds =
  | {
      ok: true;
      bodyIndent: number;
      bodyEnd: number;
      bodyLines: FunctionLine[];
    }
  | {
      ok: false;
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

const supportedCommands = new Set<KarelCommand>([
  'move',
  'turn_left',
  'turn_right',
  'turn_around',
  'pick_beeper',
  'put_beeper',
]);

const maxExecutedCommands = 10000;

function getIndentWidth(line: string) {
  const indentation = line.match(/^[ \t]*/)?.[0] ?? '';

  return [...indentation].reduce((width, char) => width + (char === '\t' ? 4 : 1), 0);
}

function parseProgram(code: string): ParsedProgram {
  const functions = new Map<string, ParsedFunction>();
  const lines = code.split('\n');
  let currentFunction: ParsedFunction | null = null;
  let functionIndent = 0;

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    if (
      trimmed === '' ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('from ') ||
      trimmed.startsWith('import ')
    ) {
      if (currentFunction && getIndentWidth(line) > functionIndent) {
        currentFunction.body.push({ line, lineNumber });
      }

      continue;
    }

    const definitionMatch = trimmed.match(/^def\s+([a-z_][a-z0-9_]*)\s*\(\s*\)\s*:\s*$/);

    if (definitionMatch) {
      if (currentFunction && getIndentWidth(line) > functionIndent) {
        return {
          ok: false,
          error: {
            code: 'python_error',
            line: lineNumber,
            message: `Zeile ${lineNumber}: Funktionen werden nacheinander definiert, nicht innerhalb einer anderen Funktion.`,
          },
        };
      }

      const name = definitionMatch[1];

      if (functions.has(name)) {
        return {
          ok: false,
          error: {
            code: 'python_error',
            line: lineNumber,
            message: `Zeile ${lineNumber}: Die Funktion ${name}() wurde bereits definiert.`,
          },
        };
      }

      currentFunction = {
        name,
        lineNumber,
        body: [],
      };
      functionIndent = getIndentWidth(line);
      functions.set(name, currentFunction);
      continue;
    }

    if (!currentFunction) {
      return {
        ok: false,
        error: {
          code: 'python_error',
          line: lineNumber,
          message: `Zeile ${lineNumber}: Befehle müssen in einer Funktion stehen, meistens in main().`,
        },
      };
    }

    if (getIndentWidth(line) <= functionIndent) {
      return {
        ok: false,
        error: {
          code: 'python_error',
          line: lineNumber,
          message: `Zeile ${lineNumber}: Erwartet wurde eine neue Funktionsdefinition mit def name():.`,
        },
      };
    }

    currentFunction.body.push({ line, lineNumber });
  }

  return {
    ok: true,
    functions,
  };
}

function parseCommand(line: string, lineNumber: number): string | null | KarelRuntimeError {
  const trimmed = line.trim();

  if (
    trimmed === '' ||
    trimmed === 'pass' ||
    trimmed.startsWith('#')
  ) {
    return null;
  }

  const commandMatch = trimmed.match(/^([a-z_]+)\(\)$/);

  if (!commandMatch) {
    return {
      code: 'python_error',
      line: lineNumber,
      message: `Zeile ${lineNumber}: Dieser einfache Runner versteht gerade nur Funktionsaufrufe wie move().`,
    };
  }

  return commandMatch[1];
}

function shouldSkipLine(line: string) {
  const trimmed = line.trim();

  return trimmed === '' || trimmed === 'pass' || trimmed.startsWith('#');
}

function findNextExecutableLine(lines: FunctionLine[], startIndex: number, parentIndent: number) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];

    if (shouldSkipLine(line.line)) {
      continue;
    }

    const indent = getIndentWidth(line.line);

    if (indent <= parentIndent) {
      return null;
    }

    return {
      index,
      indent,
    };
  }

  return null;
}

function getBlockBounds(
  lines: FunctionLine[],
  headerIndex: number,
  headerIndent: number,
  headerLineNumber: number,
  label: string,
): BlockBounds {
  const bodyStart = headerIndex + 1;
  const bodyInfo = findNextExecutableLine(lines, bodyStart, headerIndent);

  if (!bodyInfo) {
    return {
      ok: false,
      error: {
        code: 'python_error',
        line: headerLineNumber,
        message: `Zeile ${headerLineNumber}: ${label} braucht einen eingerückten Codeblock.`,
      },
    };
  }

  let bodyEnd = bodyStart;

  while (bodyEnd < lines.length) {
    const bodyLine = lines[bodyEnd].line;

    if (!shouldSkipLine(bodyLine) && getIndentWidth(bodyLine) <= headerIndent) {
      break;
    }

    bodyEnd += 1;
  }

  return {
    ok: true,
    bodyIndent: bodyInfo.indent,
    bodyEnd,
    bodyLines: lines.slice(bodyStart, bodyEnd),
  };
}

export function runKarelCode(initialWorld: KarelWorld, code: string): CodeRunResult {
  const parsedProgram = parseProgram(code);

  if (!parsedProgram.ok) {
    return {
      ok: false,
      world: initialWorld,
      commands: [],
      steps: [],
      error: parsedProgram.error,
    };
  }

  const functions = parsedProgram.functions;
  const mainFunction = functions.get('main');

  if (!mainFunction) {
    return {
      ok: false,
      world: initialWorld,
      commands: [],
      steps: [],
      error: {
        code: 'python_error',
        message: 'Dein Programm braucht eine Funktion main().',
      },
    };
  }

  let world = initialWorld;
  const commands: KarelCommand[] = [];
  const steps: KarelExecutionStep[] = [];
  let callDepth = 0;

  function getNextPosition(direction: Direction) {
    const { row, col } = world.karel;

    if (direction === 'north') return { row: row + 1, col };
    if (direction === 'east') return { row, col: col + 1 };
    if (direction === 'south') return { row: row - 1, col };

    return { row, col: col - 1 };
  }

  function isInsideWorld(row: number, col: number) {
    return row >= 1 && row <= world.rows && col >= 1 && col <= world.cols;
  }

  function hasWallAt(row: number, col: number, edge: WallEdge) {
    return world.walls.some((wall) => wall.row === row && wall.col === col && wall.edge === edge);
  }

  function directionIsClear(direction: Direction) {
    const { row, col } = world.karel;
    const nextPosition = getNextPosition(direction);

    if (!isInsideWorld(nextPosition.row, nextPosition.col)) {
      return false;
    }

    return (
      !hasWallAt(row, col, direction) &&
      !hasWallAt(nextPosition.row, nextPosition.col, oppositeEdge[direction])
    );
  }

  function evaluateCondition(conditionName: string, lineNumber: number): boolean | KarelRuntimeError {
    if (conditionName === 'front_is_clear') {
      return frontIsClear(world);
    }

    if (conditionName === 'front_is_blocked') {
      return !frontIsClear(world);
    }

    if (conditionName === 'left_is_clear') {
      return directionIsClear(leftTurn[world.karel.direction]);
    }

    if (conditionName === 'left_is_blocked') {
      return !directionIsClear(leftTurn[world.karel.direction]);
    }

    if (conditionName === 'right_is_clear') {
      return directionIsClear(rightTurn[world.karel.direction]);
    }

    if (conditionName === 'right_is_blocked') {
      return !directionIsClear(rightTurn[world.karel.direction]);
    }

    if (conditionName === 'beepers_present') {
      return beepersPresent(world);
    }

    if (conditionName === 'no_beepers_present') {
      return !beepersPresent(world);
    }

    if (conditionName === 'beepers_in_bag') {
      return (world.karel.beeperBag ?? 0) > 0;
    }

    if (conditionName === 'no_beepers_in_bag') {
      return (world.karel.beeperBag ?? 0) <= 0;
    }

    if (conditionName === 'facing_north') {
      return world.karel.direction === 'north';
    }

    if (conditionName === 'not_facing_north') {
      return world.karel.direction !== 'north';
    }

    if (conditionName === 'facing_south') {
      return world.karel.direction === 'south';
    }

    if (conditionName === 'not_facing_south') {
      return world.karel.direction !== 'south';
    }

    if (conditionName === 'facing_east') {
      return world.karel.direction === 'east';
    }

    if (conditionName === 'not_facing_east') {
      return world.karel.direction !== 'east';
    }

    if (conditionName === 'facing_west') {
      return world.karel.direction === 'west';
    }

    if (conditionName === 'not_facing_west') {
      return world.karel.direction !== 'west';
    }

    return {
      code: 'python_error',
      line: lineNumber,
      message: `Zeile ${lineNumber}: ${conditionName}() ist noch keine unterstützte Bedingung.`,
    };
  }

  function executeCommand(commandName: string, lineNumber: number): KarelRuntimeError | null {
    const customFunction = functions.get(commandName);

    if (customFunction && customFunction.name !== 'main') {
      return executeFunction(customFunction);
    }

    if (!supportedCommands.has(commandName as KarelCommand)) {
      return {
        code: 'python_error',
        line: lineNumber,
        message: `Zeile ${lineNumber}: ${commandName}() ist noch kein bekannter Karel-Befehl.`,
      };
    }

    if (steps.length >= maxExecutedCommands) {
      return {
        code: 'step_limit_exceeded',
        line: lineNumber,
        message: `Das Programm wurde nach ${maxExecutedCommands} Schritten angehalten.`,
      };
    }

    const command = commandName as KarelCommand;
    const result = runKarelCommand(world, command);

    if (!result.ok) {
      return {
        ...result.error,
        line: result.error.line ?? lineNumber,
      };
    }

    steps.push({
      command,
      lineNumber,
      before: world,
      after: result.world,
    });
    world = result.world;
    commands.push(command);

    return null;
  }

  function paintField(color: string, lineNumber: number): KarelRuntimeError | null {
    if (!/^[a-z]+$/.test(color)) {
      return {
        code: 'python_error',
        line: lineNumber,
        message: `Zeile ${lineNumber}: paint_field() erwartet einen Farbnamen wie "blue".`,
      };
    }

    if (steps.length >= maxExecutedCommands) {
      return {
        code: 'step_limit_exceeded',
        line: lineNumber,
        message: `Das Programm wurde nach ${maxExecutedCommands} Schritten angehalten.`,
      };
    }

    const before = world;
    const paintedCorners = (world.paintedCorners ?? []).filter(
      (corner) => corner.row !== world.karel.row || corner.col !== world.karel.col,
    );
    const after =
      color === 'white'
        ? {
            ...world,
            karel: { ...world.karel },
            beepers: world.beepers.map((beeper) => ({ ...beeper })),
            walls: world.walls.map((wall) => ({ ...wall })),
            paintedCorners,
          }
        : {
            ...world,
            karel: { ...world.karel },
            beepers: world.beepers.map((beeper) => ({ ...beeper })),
            walls: world.walls.map((wall) => ({ ...wall })),
            paintedCorners: [...paintedCorners, { row: world.karel.row, col: world.karel.col, color }],
          };

    steps.push({
      command: 'paint_field',
      lineNumber,
      before,
      after,
    });
    world = after;
    commands.push('paint_field');

    return null;
  }

  function executeBlock(
    lines: FunctionLine[],
    startIndex: number,
    blockIndent: number,
  ): BlockExecutionResult {
    let index = startIndex;

    while (index < lines.length) {
      const { line, lineNumber } = lines[index];

      if (shouldSkipLine(line)) {
        index += 1;
        continue;
      }

      const indent = getIndentWidth(line);

      if (indent < blockIndent) {
        return { nextIndex: index, error: null };
      }

      if (indent > blockIndent) {
        return {
          nextIndex: index,
          error: {
            code: 'python_error',
            line: lineNumber,
            message: `Zeile ${lineNumber}: Diese Einrückung gehört zu keinem erwarteten Codeblock.`,
          } satisfies KarelRuntimeError,
        };
      }

      const trimmed = line.trim();
      const forMatch = trimmed.match(/^for\s+[a-z_][a-z0-9_]*\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*$/);
      const whileMatch = trimmed.match(/^while\s+([a-z_][a-z0-9_]*)\(\)\s*:\s*$/);
      const ifMatch = trimmed.match(/^if\s+([a-z_][a-z0-9_]*)\(\)\s*:\s*$/);

      if (forMatch) {
        const count = Number(forMatch[1]);
        const block = getBlockBounds(lines, index, indent, lineNumber, 'Eine for-Schleife');

        if (!block.ok) {
          return { nextIndex: index, error: block.error };
        }

        for (let iteration = 0; iteration < count; iteration += 1) {
          const { error } = executeBlock(block.bodyLines, 0, block.bodyIndent);

          if (error) {
            return { nextIndex: index, error };
          }
        }

        index = block.bodyEnd;
        continue;
      }

      if (whileMatch) {
        const conditionName = whileMatch[1];
        const block = getBlockBounds(lines, index, indent, lineNumber, 'Eine while-Schleife');

        if (!block.ok) {
          return { nextIndex: index, error: block.error };
        }

        while (true) {
          const condition = evaluateCondition(conditionName, lineNumber);

          if (typeof condition === 'object') {
            return { nextIndex: index, error: condition };
          }

          if (!condition) {
            break;
          }

          if (steps.length >= maxExecutedCommands) {
            return {
              nextIndex: index,
              error: {
                code: 'step_limit_exceeded',
                line: lineNumber,
                message: `Die while-Schleife wurde nach ${maxExecutedCommands} Schritten angehalten.`,
              } satisfies KarelRuntimeError,
            };
          }

          const { error } = executeBlock(block.bodyLines, 0, block.bodyIndent);

          if (error) {
            return { nextIndex: index, error };
          }
        }

        index = block.bodyEnd;
        continue;
      }

      if (ifMatch) {
        const conditionName = ifMatch[1];
        const ifBlock = getBlockBounds(lines, index, indent, lineNumber, 'Eine if-Anweisung');

        if (!ifBlock.ok) {
          return { nextIndex: index, error: ifBlock.error };
        }

        let afterIfIndex = ifBlock.bodyEnd;
        let elseBlock: BlockBounds | null = null;

        while (afterIfIndex < lines.length && shouldSkipLine(lines[afterIfIndex].line)) {
          afterIfIndex += 1;
        }

        if (
          afterIfIndex < lines.length &&
          getIndentWidth(lines[afterIfIndex].line) === indent &&
          lines[afterIfIndex].line.trim() === 'else:'
        ) {
          elseBlock = getBlockBounds(
            lines,
            afterIfIndex,
            indent,
            lines[afterIfIndex].lineNumber,
            'Ein else-Zweig',
          );

          if (!elseBlock.ok) {
            return { nextIndex: index, error: elseBlock.error };
          }
        }

        const condition = evaluateCondition(conditionName, lineNumber);

        if (typeof condition === 'object') {
          return { nextIndex: index, error: condition };
        }

        const blockToRun = condition ? ifBlock : elseBlock;

        if (blockToRun?.ok) {
          const { error } = executeBlock(blockToRun.bodyLines, 0, blockToRun.bodyIndent);

          if (error) {
            return { nextIndex: index, error };
          }
        }

        index = elseBlock?.ok ? elseBlock.bodyEnd : ifBlock.bodyEnd;
        continue;
      }

      if (trimmed === 'else:') {
        return {
          nextIndex: index,
          error: {
            code: 'python_error',
            line: lineNumber,
            message: `Zeile ${lineNumber}: else braucht eine passende if-Anweisung direkt davor.`,
          },
        };
      }

      const paintMatch = trimmed.match(/^paint_field\(\s*["']([a-z]+)["']\s*\)$/);

      if (paintMatch) {
        const error = paintField(paintMatch[1], lineNumber);

        if (error) {
          return { nextIndex: index, error };
        }

        index += 1;
        continue;
      }

      const parsedCommand = parseCommand(line, lineNumber);

      if (parsedCommand === null) {
        index += 1;
        continue;
      }

      if (typeof parsedCommand === 'object') {
        return { nextIndex: index, error: parsedCommand };
      }

      const error = executeCommand(parsedCommand, lineNumber);

      if (error) {
        return { nextIndex: index, error };
      }

      index += 1;
    }

    return { nextIndex: index, error: null };
  }

  function executeFunction(fn: ParsedFunction): KarelRuntimeError | null {
    callDepth += 1;

    if (callDepth > 50) {
      callDepth -= 1;

      return {
        code: 'step_limit_exceeded',
        line: fn.lineNumber,
        message: `Die Funktion ${fn.name}() ruft zu viele weitere Funktionen auf.`,
      };
    }

    const firstLine = findNextExecutableLine(fn.body, 0, -1);

    if (!firstLine) {
      callDepth -= 1;
      return null;
    }

    const { error } = executeBlock(fn.body, 0, firstLine.indent);

    if (error) {
      callDepth -= 1;
      return error;
    }

    callDepth -= 1;
    return null;
  }

  const error = executeFunction(mainFunction);

  if (error) {
    return {
      ok: false,
      world,
      commands,
      steps,
      error,
    };
  }

  return {
    ok: true,
    world,
    commands,
    steps,
  };
}
