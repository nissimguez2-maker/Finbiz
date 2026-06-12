import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "finbiz.notes.v1";
const DEBOUNCE_MS = 600;

/** Field keys in the order they should appear / be copied. */
export const NOTE_FIELDS = [
  { key: "name", label: "Name / business", multiline: false },
  { key: "revenue", label: "Monthly revenue", multiline: false },
  { key: "tenure", label: "Time in business", multiline: false },
  { key: "ifMoney", label: "If money wasn't the bottleneck…", multiline: true },
  { key: "pain", label: "The pain (what's holding them back)", multiline: true },
  { key: "nextStep", label: "Next step / commitment", multiline: false },
  { key: "scratch", label: "Scratch", multiline: true },
] as const;

export type NoteKey = (typeof NOTE_FIELDS)[number]["key"];
export type Notes = Record<NoteKey, string>;

export type SaveState = "idle" | "saving" | "saved";

const EMPTY_NOTES: Notes = {
  name: "",
  revenue: "",
  tenure: "",
  ifMoney: "",
  pain: "",
  nextStep: "",
  scratch: "",
};

function readStored(): Notes {
  if (typeof window === "undefined") return { ...EMPTY_NOTES };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_NOTES };
    const parsed = JSON.parse(raw) as Partial<Record<NoteKey, unknown>>;
    const next: Notes = { ...EMPTY_NOTES };
    for (const { key } of NOTE_FIELDS) {
      const value = parsed[key];
      if (typeof value === "string") next[key] = value;
    }
    return next;
  } catch {
    return { ...EMPTY_NOTES };
  }
}

export interface UseNotes {
  notes: Notes;
  setField: (key: NoteKey, value: string) => void;
  clear: () => void;
  /** Whether any field currently holds text. */
  hasContent: boolean;
  /** localStorage write status, for the tiny "saved" indicator. */
  saveState: SaveState;
  /** Labeled plain-text block of the filled-in fields. */
  toPlainText: () => string;
}

/** Controlled notes state persisted to localStorage with debounced writes. */
export function useNotes(): UseNotes {
  // Lazy init so we read storage exactly once on mount.
  const [notes, setNotes] = useState<Notes>(readStored);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Skip the persist effect on the very first render (nothing changed yet).
  const hydrated = useRef(false);

  const setField = useCallback((key: NoteKey, value: string) => {
    setNotes((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const clear = useCallback(() => {
    if (writeTimer.current !== null) clearTimeout(writeTimer.current);
    if (savedTimer.current !== null) clearTimeout(savedTimer.current);
    setNotes({ ...EMPTY_NOTES });
    setSaveState("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — in-memory clear still applies */
    }
  }, []);

  // Debounced persistence + transient "saving" → "saved" indicator.
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    setSaveState("saving");
    if (writeTimer.current !== null) clearTimeout(writeTimer.current);
    if (savedTimer.current !== null) clearTimeout(savedTimer.current);

    writeTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch {
        /* storage unavailable / quota — ignore, state stays in memory */
      }
      setSaveState("saved");
      savedTimer.current = setTimeout(() => setSaveState("idle"), 1600);
    }, DEBOUNCE_MS);

    return () => {
      if (writeTimer.current !== null) clearTimeout(writeTimer.current);
    };
  }, [notes]);

  // Final cleanup of any lingering "saved" timer on unmount.
  useEffect(
    () => () => {
      if (savedTimer.current !== null) clearTimeout(savedTimer.current);
    },
    [],
  );

  const hasContent = useMemo(
    () => NOTE_FIELDS.some(({ key }) => notes[key].trim().length > 0),
    [notes],
  );

  const toPlainText = useCallback(() => {
    const lines = NOTE_FIELDS.filter(({ key }) => notes[key].trim().length > 0).map(
      ({ key, label }) => `${label}: ${notes[key].trim()}`,
    );
    return lines.join("\n");
  }, [notes]);

  return { notes, setField, clear, hasContent, saveState, toPlainText };
}
