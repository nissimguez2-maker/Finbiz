import { Activity, PhoneCall, TrendingUp } from "lucide-react";

/**
 * HeroGraphic — the signature animated cockpit motif for the masthead.
 *
 * A "Bold Factor" composition rendered on desktop only (the masthead places it
 * behind `hidden lg:block`). It layers, back-to-front:
 *   1. a soft radial Electric-Blue glow (breathing)
 *   2. a slowly rotating dashed ring (~60s) + a counter-rotating inner ring
 *   3. a solid accent corner block with an accent-tinted shadow
 *   4. a 3×3 dot grid
 *   5. two/three floating "telemetry" cards (gently drifting, staggered)
 *
 * Everything is built from design tokens + the shared keyframes
 * (spin-slow / spin-reverse / float / drift / glow-pulse) and is fully decorative
 * — `aria-hidden` and `pointer-events-none`. All motion is wrapped in
 * `motion-safe:` so it freezes under prefers-reduced-motion.
 */
export function HeroGraphic() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-[320px] w-full select-none"
    >
      {/* radial accent bloom */}
      <div className="radial-glow absolute inset-0 motion-safe:animate-glow-pulse" />

      {/* rotating dashed ring system, centred */}
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-dashed border-accent/25 motion-safe:animate-spin-slow" />
        <div className="absolute inset-7 rounded-full border border-dashed border-accent-secondary/20 motion-safe:animate-spin-reverse" />
        {/* inner solid ring + hub */}
        <div className="absolute inset-[58px] rounded-full border border-accent/10" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gradient shadow-accent" />
      </div>

      {/* 3×3 dot grid — bottom-left anchor */}
      <div className="absolute bottom-6 left-2 grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent/30" />
        ))}
      </div>

      {/* solid accent corner block — top-right, with accent shadow */}
      <div className="absolute right-3 top-2 h-14 w-14 rounded-2xl bg-accent-gradient-br shadow-accent-lg motion-safe:animate-float-slow" />

      {/* floating telemetry cards, staggered drift */}
      <FloatCard
        className="absolute left-0 top-10 motion-safe:animate-float"
        icon={<PhoneCall className="h-3.5 w-3.5" />}
        label="Live call"
        value="00:42"
        live
      />
      <FloatCard
        className="absolute right-2 top-[120px] motion-safe:animate-drift"
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        label="Connect rate"
        value="38%"
      />
      <FloatCard
        className="absolute bottom-2 left-12 motion-safe:animate-float-slower"
        icon={<Activity className="h-3.5 w-3.5" />}
        label="Pipeline"
        value="$1.4M"
      />
    </div>
  );
}

/** A small floating glass card with a gradient icon chip — pure decoration. */
function FloatCard({
  icon,
  label,
  value,
  live,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  live?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/90 px-3 py-2 shadow-accent-soft backdrop-blur-sm " +
        (className ?? "")
      }
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-gradient-br text-accent-foreground shadow-accent">
        {icon}
      </span>
      <div className="leading-none">
        <div className="flex items-center gap-1.5">
          {live && (
            <span className="h-1.5 w-1.5 rounded-full bg-go motion-safe:animate-pulse-dot" />
          )}
          <span className="font-mono text-[8.5px] uppercase tracking-label text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="mt-1 font-mono text-sm font-semibold tnum text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}
