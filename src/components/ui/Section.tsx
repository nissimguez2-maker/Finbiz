import { cn } from "@/lib/cn";
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
    <section id={meta.id} className={cn("scroll-mt-24 motion-safe:animate-fade-in-up", className)}>
      <div>
        <SectionLabel pulse={pulse}>
          {meta.navNo} · {meta.eyebrow}
        </SectionLabel>
      </div>
      <div className="mt-4">
        <Headline as="h2">{meta.title}</Headline>
      </div>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
        {meta.lead}
      </p>
      <div className="mt-7">{children}</div>
    </section>
  );
}
