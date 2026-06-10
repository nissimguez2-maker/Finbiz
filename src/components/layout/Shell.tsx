import { Sidebar } from "./Sidebar";
import { Masthead } from "./Masthead";
import { RailsStrip } from "./RailsStrip";
import { CommandBar } from "@/features/search/CommandBar";
import { NotesDrawer } from "@/features/notes/NotesDrawer";

/** App frame: index rail + main column (command bar, rails, hero, content). */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen max-w-[1320px] grid-cols-1 lg:grid-cols-[248px_1fr]">
      <Sidebar />
      <main className="min-w-0">
        <CommandBar />
        <RailsStrip />
        <Masthead />
        <div className="space-y-16 px-6 pb-28 pt-10 sm:px-10">{children}</div>
        <NotesDrawer />
      </main>
    </div>
  );
}
