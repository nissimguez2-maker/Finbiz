import { useCallback, useMemo, useState } from "react";
import {
  pathFor,
  stepLines,
  type Step,
  type BranchId,
  type AfterCallTab,
} from "./callScript";

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
}

/**
 * The guided call-flow state machine. Stage + branch + a line cursor so the rep
 * advances one spoken line at a time, then on to the next stage. Session-only
 * (resets on reload / "New call"); Notes + timer keep their own persistence.
 */
export function useCallFlow(): UseCallFlow {
  const [stage, setStage] = useState<Step>("open");
  const [branch, setBranchState] = useState<BranchId>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [objectionsOpen, setObjectionsOpen] = useState(false);
  const [afterCallOpen, setAfterCallOpen] = useState(false);
  const [afterCallTab, setAfterCallTab] = useState<AfterCallTab>("statements");

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
    // at last line → advance to the next step (unless the Gate needs a branch)
    if (stage === "gate" && branch === null) return;
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
  };
}
