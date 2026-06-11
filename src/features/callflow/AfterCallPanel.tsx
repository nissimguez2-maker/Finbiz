import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Statements } from "@/components/sections/Statements";
import { FinalQa } from "@/components/sections/FinalQa";
import { OfferDesk } from "@/components/sections/OfferDesk";
import { Pipeline } from "@/components/sections/Pipeline";
import { Mca } from "@/components/sections/Mca";
import { afterCallTabs, type AfterCallTab } from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/** The body for each tab reuses the existing (read-only) section component. */
const TAB_BODY: Record<AfterCallTab, React.ComponentType> = {
  statements: Statements,
  qa: FinalQa,
  offer: OfferDesk,
  pipeline: Pipeline,
  mca: Mca,
};

/**
 * The "After the call" overlay (GUIDED-FLOW §3). A right-side drawer, animated
 * with Framer, dismissed on Esc or the close button (`flow.closeAfterCall()`).
 * Tabs come from `afterCallTabs`; the active tab renders the matching existing
 * section component — the allowed exception to "don't import content directly".
 */
export function AfterCallPanel({ flow }: { flow: UseCallFlow }) {
  const reduce = useReducedMotion();
  const { afterCallOpen, afterCallTab, closeAfterCall, openAfterCall } = flow;

  useEffect(() => {
    if (!afterCallOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeAfterCall();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [afterCallOpen, closeAfterCall]);

  const Body = TAB_BODY[afterCallTab];

  return (
    <AnimatePresence>
      {afterCallOpen && (
        <motion.div
          className="no-print fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
        >
          {/* scrim */}
          <button
            type="button"
            aria-label="Close after-call panel"
            onClick={closeAfterCall}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="After the call"
            initial={reduce ? { x: 0 } : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { x: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full max-w-3xl flex-col border-l border-border bg-background shadow-2xl"
          >
            <header className="no-print flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
              <h2 className="font-display text-lg text-foreground">After the call</h2>
              <button
                type="button"
                onClick={closeAfterCall}
                aria-label="Close"
                className="focus-ring rounded-lg border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
              >
                Esc · Close
              </button>
            </header>

            <nav
              aria-label="After-call sections"
              className="no-print flex shrink-0 gap-1 overflow-x-auto border-b border-border px-4 py-2"
            >
              {afterCallTabs.map((tab) => {
                const active = tab.id === afterCallTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => openAfterCall(tab.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      active
                        ? "bg-accent-gradient text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <Body />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
