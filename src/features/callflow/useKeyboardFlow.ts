import { useEffect } from "react";
import { isTypingTarget } from "@/features/search/useSearch";
import type { UseCallFlow } from "./useCallFlow";

/**
 * Binds the live-call keyboard map to a useCallFlow instance.
 *
 *   → / Space  next()        ← back()
 *   1 qualifies  2 light  3 funded   (only meaningful at the Gate)
 *   o toggle objections      a toggle After-the-call
 *
 * Guarded by isTypingTarget so typing in Notes/search never jumps the stage.
 * "/" (search focus) and Esc are handled by the existing CommandBar/overlays.
 */
export function useKeyboardFlow(flow: UseCallFlow): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          flow.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          flow.back();
          break;
        case "1":
          if (flow.stage === "gate") {
            e.preventDefault();
            flow.setBranch("qualifies");
          }
          break;
        case "2":
          if (flow.stage === "gate") {
            e.preventDefault();
            flow.setBranch("light");
          }
          break;
        case "3":
          if (flow.stage === "gate") {
            e.preventDefault();
            flow.setBranch("funded");
          }
          break;
        case "o":
        case "O":
          e.preventDefault();
          flow.toggleObjections();
          break;
        case "a":
        case "A":
          e.preventDefault();
          if (flow.afterCallOpen) flow.closeAfterCall();
          else flow.openAfterCall();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [flow]);
}
