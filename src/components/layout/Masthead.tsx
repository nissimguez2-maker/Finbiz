import { motion } from "framer-motion";
import { Headline } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";
import { brand, ticker } from "@/content/meta";

/** Hero masthead: gradient headline + the always-visible ticker stats. */
export function Masthead() {
  return (
    <header className="relative overflow-hidden border-b border-border px-6 pt-12 pb-8 sm:px-10">
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

        <motion.div
          variants={fadeInUp}
          className="mt-7 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 lg:grid-cols-5"
        >
          {ticker.map((t, i) => (
            <div key={i} className="border-b border-r border-border/70 px-4 py-3 last:border-r-0">
              <div className="font-mono text-[9.5px] uppercase tracking-label text-muted-foreground">
                {t.k}
              </div>
              <div className="mt-1 font-mono text-lg font-semibold tnum">
                {t.v}
                {t.sub && <span className="ml-0.5 text-[11px] text-muted-foreground">{t.sub}</span>}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </header>
  );
}
