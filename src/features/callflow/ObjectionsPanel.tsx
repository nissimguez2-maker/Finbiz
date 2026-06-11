import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  objectionList,
  dealKillers,
  compliancePairs,
} from "./callScript";
import type { Objection } from "@/types/content";
import type { UseCallFlow } from "./useCallFlow";

/**
 * The always-on right pane (GUIDED-FLOW §2 "Always-on: Objections pane").
 *
 *  - A filterable list of objections (`q` → `reframe`); typing narrows by `q`.
 *  - Clicking an objection expands its reframe large enough to read aloud.
 *  - Two collapsed sub-sections: deal killers (issue → move) and compliance
 *    pairs (don't → say), the latter clay/go tinted. Compliance wording is
 *    locked — rendered verbatim.
 *
 * On desktop it stays visible regardless of `flow.objectionsOpen`; that flag
 * only drives focus/emphasis (and hiding on narrow screens, handled by layout).
 */
export function ObjectionsPanel({ flow }: { flow: UseCallFlow }) {
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return objectionList;
    return objectionList.filter((o) => o.q.toLowerCase().includes(q));
  }, [filter]);

  return (
    <aside
      aria-label="Objections — say-this reference"
      className={cn(
        "flex h-full flex-col gap-3 transition-opacity",
        !flow.objectionsOpen && "opacity-60",
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-3">
        <h2 className="eyebrow flex items-center gap-2">
          Objections
          <span className="font-sans text-[10px] font-normal normal-case tracking-normal text-muted-foreground/70">
            {objectionList.length} reframes
          </span>
        </h2>
        <kbd className="kbd-hint" aria-hidden="true">
          o
        </kbd>
      </header>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        placeholder="Filter — what's he saying?"
        aria-label="Filter objections"
        className="focus-ring w-full shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/40"
      />

      <ul className="scroll-thin min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {filtered.map((o) => (
          <ObjectionItem
            key={o.q}
            objection={o}
            open={openId === o.q}
            onToggle={() => setOpenId((cur) => (cur === o.q ? null : o.q))}
          />
        ))}
        {filtered.length === 0 && (
          <li className="px-1 py-3 text-[13px] text-muted-foreground">
            No objection matches “{filter}”.
          </li>
        )}
      </ul>

      <div className="shrink-0 space-y-2 border-t border-border/60 pt-3">
        <DealKillers />
        <Compliance />
      </div>
    </aside>
  );
}

function ObjectionItem({
  objection,
  open,
  onToggle,
}: {
  objection: Objection;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "focus-ring flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors",
          open
            ? "console-card-accent shadow-none"
            : "border-transparent hover:border-border hover:bg-muted/40",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-[3px] font-mono text-[11px] text-accent transition-transform",
            open && "rotate-90",
          )}
        >
          ▸
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold leading-snug text-foreground">
            “{objection.q}”
          </span>
          {open && (
            <>
              <span className="mt-2 block text-[15px] leading-relaxed text-foreground">
                {objection.reframe}
              </span>
              {objection.note && (
                <span className="mt-1.5 block text-[12.5px] italic leading-snug text-muted-foreground">
                  {objection.note}
                </span>
              )}
            </>
          )}
        </span>
      </button>
    </li>
  );
}

function Disclosure({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="eyebrow focus-ring flex w-full items-center gap-1.5 rounded-md py-1 transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">{open ? "▾" : "▸"}</span>
        {label}
        <span className="text-accent">({count})</span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

function DealKillers() {
  return (
    <Disclosure label="Deal killers" count={dealKillers.length}>
      <ul className="space-y-2">
        {dealKillers.map((dk) => (
          <li key={dk.issue} className="console-card px-3 py-2">
            <span className="block text-[13px] font-semibold text-foreground">
              {dk.issue}
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">
              {dk.move}
            </span>
          </li>
        ))}
      </ul>
    </Disclosure>
  );
}

function Compliance() {
  return (
    <Disclosure label="Compliance" count={compliancePairs.length}>
      <ul className="space-y-2">
        {compliancePairs.map((c) => (
          <li
            key={c.dont}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className="border-b border-border bg-clay/[0.06] px-3 py-1.5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-label text-clay">
                Don't
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-foreground">
                {c.dont}
              </span>
            </div>
            <div className="bg-go/[0.06] px-3 py-1.5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-label text-go">
                Say
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-foreground">
                {c.say}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Disclosure>
  );
}
