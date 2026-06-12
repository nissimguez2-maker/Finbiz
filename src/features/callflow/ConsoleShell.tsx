import { useCallback, useState } from "react";
import { NotesDrawer } from "@/features/notes/NotesDrawer";
import { useCallTimer } from "@/features/notes/useCallTimer";
import { TopBar } from "./TopBar";
import { ModeBar, type ConsoleMode } from "./ModeBar";
import { CallConsole } from "./CallConsole";
import { LookupMode } from "./LookupMode";

/**
 * ConsoleShell — the root of the 2.0 "tabs for different uses" IA.
 *
 * It owns the cross-mode shell state: the active `mode` (Live Call · Quick
 * Lookup — the two approved top-level modes, default Live), the single shared
 * `useCallTimer()` (so the timer survives a hop into Lookup and back), and the
 * shared `notesOpen` drawer. A persistent top region (TopBar + ModeBar +
 * CommandBar + timer) sits above whichever mode body is active, with the Notes
 * drawer rendered once at the shell level.
 *
 * Mode is switched by clicking the ModeBar tabs — no keyboard shortcut. Arrows
 * drive the call (stage to stage); the mouse drives the modes.
 */
export function ConsoleShell() {
  const [mode, setMode] = useState<ConsoleMode>("live");
  const [notesOpen, setNotesOpen] = useState(false);
  const timer = useCallTimer();

  const openNotes = useCallback(() => setNotesOpen(true), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <TopBar timer={timer} modeBar={<ModeBar mode={mode} onChange={setMode} />} />

      {mode === "live" ? (
        <CallConsole timer={timer} notesOpen={notesOpen} onOpenNotes={openNotes} />
      ) : (
        <LookupMode />
      )}

      <NotesDrawer open={notesOpen} onClose={closeNotes} timer={timer} />
    </div>
  );
}
