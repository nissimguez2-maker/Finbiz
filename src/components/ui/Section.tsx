import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";
import { Headline } from "./Headline";
import type { SectionMeta } from "@/types/content";

/** Consistent section shell: anchor + eyebrow badge + gradient headline + lead. */
export function Section({
  meta,
  children,
  pulse,
  className,
}: {
  meta: SectionMeta;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <motion.section
      id={meta.id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger}
      className={cn("scroll-mt-24", className)}
    >
      <motion.div variants={fadeInUp}>
        <SectionLabel pulse={pulse}>
          {meta.navNo} · {meta.eyebrow}
        </SectionLabel>
      </motion.div>
      <motion.div variants={fadeInUp} className="mt-4">
        <Headline as="h2">{meta.title}</Headline>
      </motion.div>
      <motion.p
        variants={fadeInUp}
        className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground"
      >
        {meta.lead}
      </motion.p>
      <motion.div variants={fadeInUp} className="mt-7">
        {children}
      </motion.div>
    </motion.section>
  );
}
