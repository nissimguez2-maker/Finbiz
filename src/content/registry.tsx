import type { RegisteredSection } from "@/types/content";
import { nav } from "@/content/meta";
import { Section } from "@/components/ui";

/**
 * TEMPORARY foundation registry.
 *
 * Renders a placeholder for each planned section so the shell + design system
 * build and render before the specialist agents deliver the real sections.
 * This file is rewritten to import the real section components once they land.
 */
const placeholders: RegisteredSection[] = nav.map((n) => ({
  meta: {
    id: n.id,
    navNo: n.navNo,
    navLabel: n.navLabel,
    eyebrow: "Pending",
    title: `${n.navLabel}`,
    lead: "This section is being built by a specialist agent.",
  },
  Component: function Placeholder() {
    return (
      <Section
        meta={{
          id: n.id,
          navNo: n.navNo,
          navLabel: n.navLabel,
          eyebrow: "Pending",
          title: n.navLabel,
          lead: "This section is being built by a specialist agent.",
        }}
      >
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center font-mono text-sm text-muted-foreground">
          {n.navNo} · {n.navLabel} — coming online
        </div>
      </Section>
    );
  },
}));

export const sections: RegisteredSection[] = placeholders;
