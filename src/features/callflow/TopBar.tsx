import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { CommandBar } from "@/features/search/CommandBar";
import { useCallTimer } from "@/features/notes/useCallTimer";
import { cn } from "@/lib/cn";
import { brand } from "@/content/meta";

/**
 * Sticky top bar (h-14): compact FinBiz brand mark, the existing CommandBar
 * (find-on-page / "what do I say"), and the console's single live call-timer
 * readout + controls (the same timer the Notes drawer shows). Chrome — never
 * printed.
 */
export function TopBar({ timer }: { timer: ReturnType<typeof useCallTimer> }) {
  return (
    <header className="no-print sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      {/* Brand mark — collapsed from the masthead per spec §7. */}
      <a
        href="#"
        aria-label={`${brand.name}${brand.mark} — operator console`}
        className="focus-ring flex shrink-0 items-baseline gap-px rounded-md font-display text-lg leading-none"
      >
        {brand.name}
        <span className="text-accent">{brand.mark}</span>
      </a>

      {/* The existing CommandBar is itself a sticky h-14 bar; here we mount only
          its search field by neutralising those wrapper styles via a flex slot.
          CommandBar renders its own chrome, so we let it fill the middle. */}
      <div className="relative flex min-w-0 flex-1 items-center [&>div]:static [&>div]:h-auto [&>div]:flex-1 [&>div]:border-0 [&>div]:bg-transparent [&>div]:px-0 [&>div]:backdrop-blur-none">
        <CommandBar />
      </div>

      <TimerReadout timer={timer} />
    </header>
  );
}

function TimerReadout({ timer }: { timer: ReturnType<typeof useCallTimer> }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {timer.running ? (
        <span className="live-dot" aria-hidden="true" />
      ) : (
        <span
          className="font-mono text-[10px] uppercase tracking-label text-muted-foreground sm:inline"
          aria-hidden="true"
        >
          Call
        </span>
      )}
      <span
        className={cn(
          "tnum font-mono text-base font-semibold leading-none tabular-nums",
          timer.running ? "text-foreground" : "text-muted-foreground",
        )}
        role="timer"
        aria-live="off"
        aria-label={`Elapsed ${timer.display}`}
      >
        {timer.display}
      </span>
      <Button
        variant={timer.running ? "outline" : "primary"}
        size="sm"
        onClick={timer.toggle}
        aria-pressed={timer.running}
        aria-label={timer.running ? "Stop call timer" : "Start call timer"}
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
        aria-label="Reset call timer"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
