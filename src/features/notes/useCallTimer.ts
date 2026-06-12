import { useCallback, useEffect, useRef, useState } from "react";

export interface CallTimer {
  /** Elapsed seconds across all start/stop cycles. */
  seconds: number;
  /** Whether the timer is currently counting. */
  running: boolean;
  /** Formatted MM:SS (or H:MM:SS past an hour). */
  display: string;
  /** Toggle between running and paused. */
  toggle: () => void;
  start: () => void;
  stop: () => void;
  /** Stop and zero the elapsed time. */
  reset: () => void;
}

/** MM:SS, expanding to H:MM:SS once past an hour. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/**
 * Call timer that survives start/stop cycles. Tracks elapsed time from a
 * wall-clock anchor (so a backgrounded tab that throttles the interval still
 * reports the true elapsed time), with a 1s interval driving re-renders.
 */
export function useCallTimer(): CallTimer {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Wall-clock anchor: when the current run began, and the elapsed time
  // accumulated before this run started.
  const startedAtRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const base = accumulatedRef.current;
    const since = startedAtRef.current === null ? 0 : (Date.now() - startedAtRef.current) / 1000;
    setSeconds(Math.floor(base + since));
  }, []);

  const start = useCallback(() => {
    setRunning((prev) => {
      if (prev) return prev;
      startedAtRef.current = Date.now();
      return true;
    });
  }, []);

  const stop = useCallback(() => {
    setRunning((prev) => {
      if (!prev) return prev;
      if (startedAtRef.current !== null) {
        accumulatedRef.current += (Date.now() - startedAtRef.current) / 1000;
        startedAtRef.current = null;
      }
      setSeconds(Math.floor(accumulatedRef.current));
      return false;
    });
  }, []);

  const toggle = useCallback(() => {
    if (running) stop();
    else start();
  }, [running, start, stop]);

  const reset = useCallback(() => {
    clear();
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setRunning(false);
    setSeconds(0);
  }, [clear]);

  // Drive ticks while running; always clean up on unmount or pause.
  useEffect(() => {
    if (!running) {
      clear();
      return;
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return clear;
  }, [running, tick, clear]);

  return { seconds, running, display: formatDuration(seconds), toggle, start, stop, reset };
}
