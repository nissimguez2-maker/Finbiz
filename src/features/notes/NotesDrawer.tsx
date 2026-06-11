import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, NotebookPen, Pause, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { NOTE_FIELDS, useNotes, type NoteKey, type SaveState } from "./useNotes";
import { useCallTimer } from "./useCallTimer";

/**
 * Live call-notes scratchpad + call timer — a controlled right-side drawer.
 *
 * Opened/closed by the parent (the footer "Notes" button) and sharing the
 * console's single call timer, so there's exactly one timer and one Notes entry
 * point (no floating dock). Notes persist via `useNotes` (localStorage).
 */
export function NotesDrawer({
  open,
  onClose,
  timer,
}: {
  open: boolean;
  onClose: () => void;
  timer: ReturnType<typeof useCallTimer>;
}) {
  const reduceMotion = useReducedMotion();
  const notes = useNotes();

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = onClose;

  // Esc closes the drawer — but never steal Escape from an open search field
  // (e.g. the command bar) by only acting when focus is inside the drawer or
  // on its trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      const insideDrawer = panelRef.current?.contains(active) ?? false;
      if (insideDrawer || active === document.body || active === null) {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel once it has animated in.
  const onPanelEnter = useCallback(() => {
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, []);

  return (
    <div className="no-print">
      <AnimatePresence>
        {open && (
          <>
            {/* Click-away scrim — non-visual, just an accessibility-neutral catch. */}
            <motion.div
              key="notes-scrim"
              className="fixed inset-0 z-40 bg-foreground/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              key="notes-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col",
                "border-l border-border bg-card shadow-xl",
              )}
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.32, ease: easeOut }
              }
              onAnimationComplete={onPanelEnter}
            >
              <DrawerHeader titleId={titleId} onClose={close} />
              <TimerBar timer={timer} />
              <div className="scroll-thin flex-1 space-y-4 overflow-y-auto px-5 py-4">
                {NOTE_FIELDS.map((field) => (
                  <NoteField
                    key={field.key}
                    fieldKey={field.key}
                    label={field.label}
                    multiline={field.multiline}
                    value={notes.notes[field.key]}
                    onChange={notes.setField}
                  />
                ))}
              </div>
              <DrawerFooter
                hasContent={notes.hasContent}
                saveState={notes.saveState}
                toPlainText={notes.toPlainText}
                onClear={notes.clear}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DrawerHeader({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="flex items-center gap-2">
        <NotebookPen className="h-4 w-4 text-accent" aria-hidden="true" />
        <h2 id={titleId} className="font-mono text-[13px] font-semibold text-foreground">
          Call notes
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        data-autofocus
        aria-label="Close call notes"
        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function TimerBar({ timer }: { timer: ReturnType<typeof useCallTimer> }) {
  return (
    <div className="border-b border-border bg-muted/40 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
            Call timer
          </p>
          <p
            className="tnum mt-1 font-mono text-3xl font-semibold leading-none text-foreground"
            role="timer"
            aria-live="off"
            aria-label={`Elapsed ${timer.display}`}
          >
            {timer.display}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timer.running ? "outline" : "primary"}
            size="sm"
            onClick={timer.toggle}
            aria-pressed={timer.running}
          >
            {timer.running ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={timer.reset}
            disabled={timer.seconds === 0 && !timer.running}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

function NoteField({
  fieldKey,
  label,
  multiline,
  value,
  onChange,
}: {
  fieldKey: NoteKey;
  label: string;
  multiline: boolean;
  value: string;
  onChange: (key: NoteKey, value: string) => void;
}) {
  const id = useId();
  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors hover:border-accent/30 focus-ring focus-visible:border-accent/40";
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-label text-muted-foreground"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(fieldKey, event.target.value)}
          rows={fieldKey === "scratch" ? 4 : 3}
          className={cn(fieldClass, "scroll-thin resize-y leading-relaxed")}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(fieldKey, event.target.value)}
          className={fieldClass}
        />
      )}
    </div>
  );
}

function DrawerFooter({
  hasContent,
  saveState,
  toPlainText,
  onClear,
}: {
  hasContent: boolean;
  saveState: SaveState;
  toPlainText: () => string;
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const flashCopied = useCallback(() => {
    setCopied(true);
    if (copiedTimer.current !== null) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1600);
  }, []);

  const handleCopy = useCallback(async () => {
    const text = toPlainText();
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        flashCopied();
        return;
      }
    } catch {
      /* fall through to the textarea fallback below */
    }
    // Fallback for non-secure contexts / missing Clipboard API.
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      flashCopied();
    } catch {
      /* nothing more we can do — leave indicator untouched */
    }
  }, [toPlainText, flashCopied]);

  const handleClear = useCallback(() => {
    if (window.confirm("Clear all call notes? This can't be undone.")) onClear();
  }, [onClear]);

  return (
    <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
      <span
        className="font-mono text-[10px] text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {saveState === "saving" ? (
          "Saving…"
        ) : saveState === "saved" ? (
          <span className="inline-flex items-center gap-1 text-go">
            <Check className="h-3 w-3" aria-hidden="true" />
            Saved
          </span>
        ) : (
          "Auto-saved locally"
        )}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={!hasContent}
        >
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!hasContent}
          aria-label="Copy notes to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            "Copy"
          )}
        </Button>
      </div>
    </div>
  );
}
