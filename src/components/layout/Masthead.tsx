import { motion } from "framer-motion";
import { Headline } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";
import { brand, ticker } from "@/content/meta";

/**
 * Hero masthead — the cockpit's opening statement: gradient headline + lead,
 * with "the floor" below — an inverted (deep-slate) ticker band with a dot-grid
 * texture and a radial accent glow (the system's one dramatic colour-inversion).
 */
export function Masthead() {
  return (
    <header className="relative overflow-hidden border-b border-border px-6 pt-12 pb-9 sm:px-10">
      {/* ambient accent glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.06] blur-[120px]" />

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative">
        <motion.div variants={fadeInUp}>
          <Headline as="h1">{brand.title}</Headline>
        </motion.div>
        <motion.p
          variants={fadeInUp}
          className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
        >
          {brand.tagline}
        </motion.p>
      </motion.div>

      {/* "The floor" — the one inverted band: deep slate + dot texture + glow. */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative mt-8 overflow-hidden rounded-2xl border border-foreground/80 bg-foreground shadow-xl"
      >
        <div className="dot-texture-bold pointer-events-none absolute inset-0" />
        <div className="radial-glow pointer-events-none absolute -left-16 -top-16 h-56 w-56 opacity-60 motion-safe:animate-glow-pulse" />

        <div className="relative flex items-center gap-2.5 border-b border-white/10 px-5 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-go motion-safe:animate-pulse-dot" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-accent-secondary">
            The floor
          </span>
          <span className="font-mono text-[10px] uppercase tracking-label text-white/40">
            · live
          </span>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {ticker.map((t, i) => (
            <div
              key={i}
              className="border-b border-r border-white/10 px-5 py-4 last:border-r-0"
            >
              <div className="font-mono text-[9.5px] uppercase tracking-label text-white/50">
                {t.k}
              </div>
              <div className="mt-1.5 font-mono text-xl font-semibold tnum text-white">
                {t.v}
                {t.sub && (
                  <span className="ml-0.5 text-[11px] font-normal text-white/45">{t.sub}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
