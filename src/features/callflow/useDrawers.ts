import { useCallback, useEffect, useState } from "react";

/**
 * Drawer state + the one keyboard convention the owner kept:
 *   [   toggle the left panel ("Products")
 *   ]   toggle the right panel ("Objections")
 *   Esc close whichever panel is open
 *
 * Nothing is persisted — there is no call state to remember. Focus management
 * (moving focus into an opened panel, returning it to the toggle on close) lives
 * in the panel component; this hook only owns which panel is open.
 */
export type DrawerSide = "left" | "right" | null;

/**
 * True when the event target is a text input / editable element. Exported so the
 * script cursor (useScriptCursor) reuses the SAME guard — arrows/space typed in
 * the objection filter must never move the reading cursor.
 */
export function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export interface Drawers {
  open: DrawerSide;
  toggleLeft: () => void;
  toggleRight: () => void;
  close: () => void;
}

export function useDrawers(): Drawers {
  const [open, setOpen] = useState<DrawerSide>(null);

  const toggleLeft = useCallback(
    () => setOpen((cur) => (cur === "left" ? null : "left")),
    [],
  );
  const toggleRight = useCallback(
    () => setOpen((cur) => (cur === "right" ? null : "right")),
    [],
  );
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Esc closes an open panel; otherwise let it pass through.
        setOpen((cur) => (cur ? null : cur));
        return;
      }
      // The bracket shortcuts never fire while typing in the filter input.
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "[") {
        e.preventDefault();
        toggleLeft();
      } else if (e.key === "]") {
        e.preventDefault();
        toggleRight();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleLeft, toggleRight]);

  return { open, toggleLeft, toggleRight, close };
}
