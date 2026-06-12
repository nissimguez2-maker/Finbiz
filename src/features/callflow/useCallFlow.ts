import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  pathFor,
  stepLines,
  STEP_LABELS,
  type Step,
  type BranchId,
  type AfterCallTab,
} from "./callScript";

/** localStorage key for the resumable slice of call-flow state. */
const STORAGE_KEY = "finbiz.callflow.v1";

/** Only stage/branch/lineIndex survive a reload (objections/after-call are
 *  session-only). */
interface PersistedFlow {
  stage: Step;
  branch: BranchId;
  lineIndex: number;
}

const FRESH: PersistedFlow = { stage: "open", branch: null, lineIndex: 0 };

const VALID_BRANCHES: BranchId[] = ["qualifies", "light", "funded", null];

/**
 * Read the persisted slice, tolerating an older/garbage shape: any unknown
 * `stage` (e.g. a stage id from a previous Step union) or out-of-range
 * `lineIndex` falls back to a fresh "open" so a stale value never strands the
 * rep on a screen the current build can't render.
 */
function readStored(): PersistedFlow {
  if (typeof window === "undefined") return { ...FRESH };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...FRESH };
    const parsed = JSON.parse(raw) as Partial<PersistedFlow>;

    // Validate stage against the CURRENT Step union (STEP_LABELS is its source).
    const stage =
      typeof parsed.stage === "string" && parsed.stage in STEP_LABELS
        ? (parsed.stage as Step)
        : "open";
    const branch = VALID_BRANCHES.includes(parsed.branch as BranchId)
      ? (parsed.branch as BranchId)
      : null;

    // A stored stage must be reachable on the stored branch's path; otherwise
    // (e.g. branch=null but stage=pitch from an older shape) reset to open.
    const path = pathFor(branch);
    if (!path.includes(stage)) return { ...FRESH };

    // Clamp the line cursor to the stage's real line count.
    const maxLine = stepLines(stage).length - 1;
    const lineIndex =
      typeof parsed.lineIndex === "number" && parsed.lineIndex >= 0
        ? Math.min(parsed.lineIndex, maxLine)
        : 0;

    return { stage, branch, lineIndex };
  } catch {
    return { ...FRESH };
  }
}

export interface CallFlowState {
  /** Current step (a stage or a branch screen). */
  stage: Step;
  /** Branch resolved at the Gate; drives the path + branch screens. */
  branch: BranchId;
  /** Cursor over the current step's spoken lines (the hero line). */
  lineIndex: number;
  /** Right pane visibility (desktop: persistent; toggles focus/emphasis). */
  objectionsOpen: boolean;
  /** "After the call" overlay. */
  afterCallOpen: boolean;
  afterCallTab: AfterCallTab;
}

export interface UseCallFlow extends CallFlowState {
  /** The active path of steps for the current branch. */
  path: Step[];
  next(): void;
  back(): void;
  goTo(step: Step): void;
  setBranch(b: Exclude<BranchId, null>): void;
  resetCall(): void;
  toggleObjections(): void;
  openAfterCall(tab?: AfterCallTab): void;
  closeAfterCall(): void;
  canNext: boolean;
  canBack: boolean;
  /** True at the Gate's last line with no branch chosen yet (must pick). */
  awaitingBranch: boolean;
  /** Bumps each time `next()` is refused because a branch is owed — lets the
   *  branch controls flash a one-shot "pick a lane" ring instead of dead-ending. */
  branchNudge: number;
}

/**
 * The guided call-flow state machine. Stage + branch + a line cursor so the rep
 * advances one spoken line at a time, then on to the next stage.
 *
 * Stage/branch/lineIndex persist to localStorage (mirroring useNotes) so an
 * accidental mid-call reload resumes where the rep was; "New call" clears it.
 * objectionsOpen + the after-call overlay stay session-only.
 */
export function useCallFlow(): UseCallFlow {
  // Lazy init so we read storage exactly once on mount.
  const initial = useRef<PersistedFlow>(readStored());
  const [stage, setStage] = useState<Step>(initial.current.stage);
  const [branch, setBranchState] = useState<BranchId>(initial.current.branch);
  const [lineIndex, setLineIndex] = useState(initial.current.lineIndex);
  const [objectionsOpen, setObjectionsOpen] = useState(false);
  const [afterCallOpen, setAfterCallOpen] = useState(false);
  const [afterCallTab, setAfterCallTab] = useState<AfterCallTab>("statements");
  // One-shot signal: a refused `next()` at the Gate bumps this so the branch
  // controls can flash. Session-only; never persisted.
  const [branchNudge, setBranchNudge] = useState(0);

  // Persist the resumable slice whenever it changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage, branch, lineIndex }),
      );
    } catch {
      /* storage unavailable / quota — state stays in memory */
    }
  }, [stage, branch, lineIndex]);

  const path = useMemo(() => pathFor(branch), [branch]);

  const lastLine = stepLines(stage).length - 1;
  const stepIdx = path.indexOf(stage);
  const awaitingBranch = stage === "gate" && branch === null && lineIndex >= lastLine;

  const next = useCallback(() => {
    const lines = stepLines(stage).length;
    if (lineIndex < lines - 1) {
      setLineIndex(lineIndex + 1);
      return;
    }
    // at last line → advance to the next step (unless the Gate needs a branch:
    // instead of a silent dead-end, bump the nudge so the controls flash).
    if (stage === "gate" && branch === null) {
      setBranchNudge((n) => n + 1);
      return;
    }
    const idx = path.indexOf(stage);
    if (idx >= 0 && idx < path.length - 1) {
      setStage(path[idx + 1]);
      setLineIndex(0);
    }
  }, [stage, branch, path, lineIndex]);

  const back = useCallback(() => {
    if (lineIndex > 0) {
      setLineIndex(lineIndex - 1);
      return;
    }
    const idx = path.indexOf(stage);
    if (idx > 0) {
      const prev = path[idx - 1];
      setStage(prev);
      setLineIndex(Math.max(0, stepLines(prev).length - 1));
    }
  }, [stage, path, lineIndex]);

  const goTo = useCallback(
    (target: Step) => {
      if (path.includes(target)) {
        setStage(target);
        setLineIndex(0);
      }
    },
    [path],
  );

  const setBranch = useCallback((b: Exclude<BranchId, null>) => {
    setBranchState(b);
    const np = pathFor(b);
    const gi = np.indexOf("gate");
    setStage(np[gi + 1] ?? "close");
    setLineIndex(0);
  }, []);

  const resetCall = useCallback(() => {
    setBranchState(null);
    setStage("open");
    setLineIndex(0);
    setAfterCallOpen(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — in-memory reset still applies */
    }
  }, []);

  const toggleObjections = useCallback(() => setObjectionsOpen((o) => !o), []);
  const openAfterCall = useCallback((tab?: AfterCallTab) => {
    if (tab) setAfterCallTab(tab);
    setAfterCallOpen(true);
  }, []);
  const closeAfterCall = useCallback(() => setAfterCallOpen(false), []);

  const canBack = lineIndex > 0 || stepIdx > 0;
  const canNext =
    lineIndex < lastLine || (!awaitingBranch && stepIdx >= 0 && stepIdx < path.length - 1);

  return {
    stage,
    branch,
    lineIndex,
    objectionsOpen,
    afterCallOpen,
    afterCallTab,
    path,
    next,
    back,
    goTo,
    setBranch,
    resetCall,
    toggleObjections,
    openAfterCall,
    closeAfterCall,
    canNext,
    canBack,
    awaitingBranch,
    branchNudge,
  };
}
