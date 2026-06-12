import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { objectionList, dealKillers, compliancePairs } from "./callScript";
import type { Objection } from "@/types/content";

/**
 * The objection comebacks — folded into the LEFT (script) side, shown when the
 * rep toggles "Objections" (`o`). A filterable list of `q` → `reframe`, with
 * deal-killers one tap down. The current line stays visible above this.
 */
export function ObjectionsPanel() {
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The panel mounts fresh each time objections open (`o`), so a mount-time
  // focus lands the cursor in the filter — type-to-find without a second reach.
  // isTypingTarget then guards the rest of the keymap while focus is here.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return objectionList;
    return objectionList.filter((o) => o.q.toLowerCase().includes(q));
  }, [filter]);

  return (
    <div className="flex h-full flex-col gap-3">
      <input
        ref={inputRef}
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        placeholder="Filter — what's he saying?"
        aria-label="Filter objections"
        className="focus-ring w-full shrink-0 rounded-lg border border-surface-2-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-surface-2-foreground/70 focus:border-accent/40"
      />

      <ul className="space-y-1">
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

      <div className="space-y-2 border-t border-border/60 pt-3">
        <Disclosure label="Deal killers" count={dealKillers.length}>
          <ul className="space-y-2">
            {dealKillers.map((dk) => (
              <li key={dk.issue} className="rounded-lg border border-surface-2-border bg-surface-2 px-3 py-2">
                <span className="block text-[13px] font-semibold text-foreground">{dk.issue}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-surface-2-foreground">{dk.move}</span>
              </li>
            ))}
          </ul>
        </Disclosure>

        {/* Compliance reference — the "don't say X → say Y" pairs, one tap down
            so the live objection list stays clean (GUIDED-FLOW §2 objections). */}
        <Disclosure label="Compliance" count={compliancePairs.length}>
          <ul className="space-y-2">
            {compliancePairs.map((pair) => (
              <li key={pair.dont} className="rounded-lg border border-surface-2-border bg-surface-2 px-3 py-2">
                <span className="block text-[12.5px] leading-snug text-surface-2-foreground">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-clay">
                    Don&rsquo;t
                  </span>{" "}
                  {pair.dont}
                </span>
                <span className="mt-1 block text-[13px] font-semibold leading-snug text-foreground">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-go">
                    Say
                  </span>{" "}
                  {pair.say}
                </span>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </div>
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
          "focus-ring flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
          open ? "border-accent bg-accent/[0.05]" : "border-surface-2-border hover:border-border hover:bg-muted/40",
        )}
      >
        <span aria-hidden="true" className={cn("mt-[3px] font-mono text-[11px] text-accent-strong", open && "rotate-90")}>
          ▸
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-foreground">“{objection.q}”</span>
          {open && (
            <>
              <span className="mt-2 block text-[16px] leading-relaxed text-foreground">{objection.reframe}</span>
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

function Disclosure({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
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
        <span className="text-accent-strong">({count})</span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}
