'use client';

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

import type { Exercise, TestResult } from '@/domain/course';
import type { KarelCommand, KarelRuntimeError, KarelWorld } from '@/domain/karel';
import { type KarelExecutionStep, runKarelCode } from '@/lib/karel/code-runner';
import { describeGoalWorld } from '@/lib/karel/describe-goal';
import { worldMatchesGoal } from '@/lib/karel/goal';
import { KarelWorldView } from '@/components/karel/karel-world-view';

type KarelCommandPanelProps = {
  exercise: Exercise;
};

export function KarelCommandPanel({ exercise }: KarelCommandPanelProps) {
  const [code, setCode] = useState(exercise.starterCode);
  const [world, setWorld] = useState(exercise.initialWorld);
  const [history, setHistory] = useState<KarelCommand[]>([]);
  const [error, setError] = useState<KarelRuntimeError | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [stepMode, setStepMode] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [replay, setReplay] = useState<{
    steps: KarelExecutionStep[];
    index: number;
    finalWorld: KarelWorld;
    finalError: KarelRuntimeError | null;
  } | null>(null);
  const highlightLayerRef = useRef<HTMLPreElement>(null);
  const lineNumberLayerRef = useRef<HTMLPreElement>(null);
  const solved = useMemo(() => worldMatchesGoal(world, exercise.goalWorld), [exercise.goalWorld, world]);
  const goalDescription = useMemo(() => describeGoalWorld(exercise.goalWorld), [exercise.goalWorld]);
  const codeLines = useMemo(() => code.split('\n'), [code]);
  const isReplaying = replay !== null;
  const shouldStackWorlds = Math.max(exercise.initialWorld.cols, exercise.goalWorld.cols) >= 8;
  const passedTests = testResults.filter((result) => result.status === 'passed').length;

  function runTests(nextCode: string): TestResult[] {
    return exercise.tests.map((test) => {
      const result = runKarelCode(test.initialWorld, nextCode);

      if (!result.ok) {
        return {
          name: test.name,
          status: 'error',
          message: result.error.message,
          stepCount: result.commands.length,
        };
      }

      const passed = worldMatchesGoal(result.world, test.goalWorld);

      return {
        name: test.name,
        status: passed ? 'passed' : 'failed',
        message: passed ? undefined : 'Zielwelt nicht erreicht.',
        stepCount: result.commands.length,
      };
    });
  }

  useEffect(() => {
    if (!replay) {
      return;
    }

    if (replay.index >= replay.steps.length) {
      const timeout = window.setTimeout(() => {
        setWorld(replay.finalWorld);
        setError(replay.finalError);
        setActiveLine(replay.finalError?.line ?? null);
        setReplay(null);
      }, 650);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      const step = replay.steps[replay.index];

      setActiveLine(step.lineNumber);
      setWorld(step.after);
      setHistory(replay.steps.slice(0, replay.index + 1).map((item) => item.command));
      setReplay({ ...replay, index: replay.index + 1 });
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [replay]);

  function runCode() {
    const result = runKarelCode(exercise.initialWorld, code);
    const nextTestResults = runTests(code);
    setTestResults(nextTestResults);

    if (!stepMode) {
      setReplay(null);
      setActiveLine(result.ok ? null : result.error.line ?? null);
      setWorld(result.world);
      setHistory(result.commands);
      setError(result.ok ? null : result.error);
      return;
    }

    setWorld(exercise.initialWorld);
    setHistory([]);
    setError(null);
    setActiveLine(null);

    if (result.steps.length === 0) {
      setWorld(result.world);
      setError(result.ok ? null : result.error);
      setActiveLine(result.ok ? null : result.error.line ?? null);
      return;
    }

    setReplay({
      steps: result.steps,
      index: 0,
      finalWorld: result.world,
      finalError: result.ok ? null : result.error,
    });
  }

  function updateCode(nextCode: string) {
    setReplay(null);
    setActiveLine(null);
    setTestResults([]);
    setCode(nextCode);
  }

  function handleCodeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    const editor = event.currentTarget;
    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;
    const textBeforeCursor = code.slice(0, selectionStart);
    const textAfterCursor = code.slice(selectionEnd);
    const currentLine = textBeforeCursor.split('\n').at(-1) ?? '';
    const currentIndent = currentLine.match(/^\s*/)?.[0] ?? '';
    const extraIndent = currentLine.trimEnd().endsWith(':') ? '    ' : '';
    const insertion = `\n${currentIndent}${extraIndent}`;
    const nextCursorPosition = selectionStart + insertion.length;

    updateCode(`${textBeforeCursor}${insertion}${textAfterCursor}`);

    requestAnimationFrame(() => {
      editor.selectionStart = nextCursorPosition;
      editor.selectionEnd = nextCursorPosition;
    });
  }

  function resetWorld() {
    setReplay(null);
    setWorld(exercise.initialWorld);
    setHistory([]);
    setError(null);
    setActiveLine(null);
    setTestResults([]);
  }

  return (
    <div className="mt-6 border border-[#d8d0bd] bg-[#faf8f1] p-5">
      <div className="mb-5 border border-[#e3dccd] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
          Ziel
        </p>
        <ul className="mt-3 space-y-1 text-sm leading-6 text-[#4d554c]">
          {goalDescription.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={`grid gap-5 ${shouldStackWorlds ? '' : 'md:grid-cols-2'}`}>
        <KarelWorldView title="Aktuelle Welt" world={world} />
        <KarelWorldView title="Zielwelt" world={exercise.goalWorld} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]"
              htmlFor={`${exercise.slug}-code`}
            >
              Code
            </label>
            <div className="relative mt-3 h-64 overflow-hidden border border-[#cfc6b4] bg-[#20231f] focus-within:border-[#3d6f5a]">
              <pre
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-12 overflow-hidden border-r border-[#3a3d37] bg-[#1a1d19] py-4 pr-3 text-right font-mono text-sm leading-6 text-[#8f968d]"
                ref={lineNumberLayerRef}
              >
                {codeLines.map((_, index) => {
                  const lineNumber = index + 1;

                  return (
                    <span
                      className={`block min-h-6 ${
                        activeLine === lineNumber ? 'bg-[#3d6f5a]/45 text-[#f6f3ea]' : ''
                      }`}
                      key={lineNumber}
                    >
                      {lineNumber}
                    </span>
                  );
                })}
              </pre>
              <pre
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre p-4 pl-16 font-mono text-sm leading-6 text-transparent"
                ref={highlightLayerRef}
              >
                {codeLines.map((line, index) => {
                  const lineNumber = index + 1;

                  return (
                    <span
                      className={`block min-h-6 ${
                        activeLine === lineNumber ? 'bg-[#3d6f5a]/45' : ''
                      }`}
                      key={`${lineNumber}-${line}`}
                    >
                      {line || ' '}
                    </span>
                  );
                })}
              </pre>
              <textarea
                className="relative h-full w-full resize-none overflow-auto bg-transparent p-4 pl-16 font-mono text-sm leading-6 text-[#f6f3ea] outline-none"
                disabled={isReplaying}
                id={`${exercise.slug}-code`}
                onChange={(event) => updateCode(event.target.value)}
                onKeyDown={handleCodeKeyDown}
                onScroll={(event) => {
                  if (highlightLayerRef.current) {
                    highlightLayerRef.current.scrollLeft = event.currentTarget.scrollLeft;
                    highlightLayerRef.current.scrollTop = event.currentTarget.scrollTop;
                  }

                  if (lineNumberLayerRef.current) {
                    lineNumberLayerRef.current.scrollTop = event.currentTarget.scrollTop;
                  }
                }}
                spellCheck={false}
                value={code}
                wrap="off"
              />
            </div>
            <p className="mt-2 text-xs leading-5 text-[#5f665e]">
              Aktuell unterstützt der Runner Karel-Befehle, eigene Funktionen und einfache
              for- und while-Schleifen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              aria-label={`Code für ${exercise.title} ausführen`}
              className="border border-[#20231f] bg-[#20231f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6f5a] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isReplaying}
              onClick={runCode}
              type="button"
            >
              {isReplaying ? 'Läuft...' : 'Code ausführen'}
            </button>
            <button
              aria-label={`${exercise.title} zurücksetzen`}
              className="border border-[#20231f] px-4 py-2 text-sm font-semibold text-[#20231f] transition-colors hover:bg-white"
              onClick={resetWorld}
              type="button"
            >
              Zurücksetzen
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#20231f]">
              <input
                checked={stepMode}
                className="h-4 w-4 accent-[#3d6f5a]"
                onChange={(event) => {
                  setStepMode(event.target.checked);
                  setReplay(null);
                  setActiveLine(null);
                }}
                type="checkbox"
              />
              Einzelschritte
            </label>
          </div>
        </div>
        <div className="border border-[#e3dccd] bg-white p-4 text-sm leading-6 text-[#4d554c]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">
            Feedback
          </p>
          <div className="mt-3 space-y-1">
            <p>
              Schritte: <span className="font-semibold text-[#20231f]">{history.length}</span>
            </p>
            <p>
              Status:{' '}
              <span className={solved ? 'font-semibold text-[#2d6b3f]' : 'font-semibold text-[#8a6424]'}>
                {solved ? 'Ziel erreicht' : 'Noch nicht gelöst'}
              </span>
            </p>
            {error ? <p className="mt-2 font-semibold text-[#9a2f2f]">{error.message}</p> : null}
            {testResults.length > 0 ? (
              <div className="mt-4 border-t border-[#eee7d8] pt-3">
                <p className="font-semibold text-[#20231f]">
                  Tests: {passedTests}/{testResults.length} bestanden
                </p>
                <ul className="mt-2 space-y-1">
                  {testResults.map((result) => (
                    <li
                      className={result.status === 'passed' ? 'text-[#2d6b3f]' : 'text-[#9a2f2f]'}
                      key={result.name}
                    >
                      {result.status === 'passed' ? '✓' : '×'} {result.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
