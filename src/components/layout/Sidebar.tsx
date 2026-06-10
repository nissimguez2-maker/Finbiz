import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { brand, nav } from "@/content/meta";

/** Sticky left index rail with scroll-spy active state. */
export function Sidebar() {
  const [active, setActive] = useState(nav[0]?.id ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="no-print sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-border bg-muted/40 py-7 scroll-thin lg:flex">
      <div className="border-b border-border px-6 pb-5">
        <p className="font-display text-xl leading-none">
          {brand.name}
          <span className="text-accent">{brand.mark}</span>
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-muted-foreground">
          {brand.kicker}
        </p>
      </div>

      <div className="mt-3 flex-1 px-3">
        {nav.map((n) => {
          const isActive = active === n.id;
          return (
            <a
              key={n.id}
              href={`#${n.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "focus-ring relative flex items-baseline gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors",
                isActive
                  ? "bg-accent/[0.07] font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {/* signature accent bar marks the active section */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent-gradient transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold tnum",
                  isActive ? "text-accent" : "text-muted-foreground/70",
                )}
              >
                {n.navNo}
              </span>
              {n.navLabel}
            </a>
          );
        })}
      </div>

      <p className="mx-6 mt-4 border-t border-border pt-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
        YOUR EYES ONLY — confidence sells; defensiveness sounds guilty. The file
        wins the argument, not your volume.
      </p>
    </nav>
  );
}
