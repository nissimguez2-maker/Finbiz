import { forwardRef, useRef } from "react";
import { cn } from "@/lib/cn";
import { Script } from "./Script";
import { Panel } from "./Panel";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { useDrawers } from "./useDrawers";
import { brandName, brandMark } from "./content";

/**
 * The reading console: one centered script column with two quiet edges.
 *
 * Layout
 *  - lg+ : the open panel is a static flex sibling that PUSHES the script; the
 *          script stays centered in the space that remains and never hides
 *          behind anything.
 *  - <lg : the panel OVERLAYS the script as a fixed drawer over a scrim.
 *          useDrawers only ever holds one side open, so both can never show.
 *
 * Chrome is a single slim sticky bar: the brand wordmark and two toggles.
 */
export function CallConsole() {
  const { open, toggleLeft, toggleRight, close } = useDrawers();
  const leftToggleRef = useRef<HTMLButtonElement>(null);
  const rightToggleRef = useRef<HTMLButtonElement>(null);

  const leftOpen = open === "left";
  const rightOpen = open === "right";

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Top bar — the only chrome on screen. */}
      <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <Toggle
          ref={leftToggleRef}
          label="Products"
          hint="["
          controls="panel-left"
          expanded={leftOpen}
          onClick={toggleLeft}
        />

        <span className="select-none text-sm font-medium tracking-tight text-foreground">
          {brandName} <span className="text-muted-foreground">· {brandMark}</span>
        </span>

        <Toggle
          label="Objections"
          hint="]"
          controls="panel-right"
          expanded={rightOpen}
          onClick={toggleRight}
          ref={rightToggleRef}
          trailing
        />
      </header>

      {/* Body: panels push at lg+, overlay below lg. */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          className={cn(
            "z-20 w-full max-w-[400px] shrink-0 overflow-hidden",
            "fixed bottom-0 left-0 top-12 lg:static",
            leftOpen ? "block animate-slide-in-left" : "hidden",
          )}
        >
          <Panel
            side="left"
            open={leftOpen}
            id="panel-left"
            title="What you sell"
            onClose={close}
            returnFocusTo={leftToggleRef}
          >
            <LeftPanel />
          </Panel>
        </div>

        {/* Center script — always the focal column. */}
        <main className="scroll-thin min-w-0 flex-1 overflow-y-auto">
          <Script />
        </main>

        {/* Right panel */}
        <div
          className={cn(
            "z-20 w-full max-w-[400px] shrink-0 overflow-hidden",
            "fixed bottom-0 right-0 top-12 lg:static",
            rightOpen ? "block animate-slide-in-right" : "hidden",
          )}
        >
          <Panel
            side="right"
            open={rightOpen}
            id="panel-right"
            title="Run the call"
            onClose={close}
            returnFocusTo={rightToggleRef}
          >
            <RightPanel />
          </Panel>
        </div>

        {/* Scrim — only below lg, only when a panel overlays the script. */}
        {open && (
          <button
            type="button"
            aria-label="Close panel"
            onClick={close}
            className="fixed inset-0 top-12 z-10 animate-fade-in bg-foreground/20 lg:hidden"
          />
        )}
      </div>
    </div>
  );
}

/** A top-bar toggle with a tiny kbd hint. */
interface ToggleProps {
  label: string;
  hint: string;
  controls: string;
  expanded: boolean;
  onClick: () => void;
  trailing?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ label, hint, controls, expanded, onClick, trailing }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        expanded ? "text-accent" : "text-muted-foreground hover:text-accent",
      )}
    >
      {trailing && <span>{label}</span>}
      <span className="kbd-hint" aria-hidden>
        {hint}
      </span>
      {!trailing && <span>{label}</span>}
    </button>
  ),
);
Toggle.displayName = "Toggle";
