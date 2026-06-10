import { useState } from "react";
import { Section, Card } from "@/components/ui";
import { followUps } from "@/content/followUps";
import type { SmsTemplate } from "@/types/content";

/** 09 — Chase: ready-to-send follow-up texts, one card per scenario. */
export function FollowUps() {
  const { meta, scenarios } = followUps;
  return (
    <Section meta={meta}>
      <div className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => (
          <Card key={s.scenario} interactive>
            <h4 className="mb-4 font-display text-lg leading-tight">{s.scenario}</h4>
            <div className="space-y-3">
              {s.templates.map((t) => (
                <TemplateRow key={t.label} template={t} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/** A single SMS template: mono label + the quoted message, with a copy affordance. */
function TemplateRow({ template }: { template: SmsTemplate }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(template.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-accent">
          {template.label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : `Copy ${template.label} message`}
          className="focus-ring shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="font-mono text-[12.5px] leading-relaxed text-foreground">
        <span className="text-accent">&ldquo;</span>
        {template.text}
        <span className="text-accent">&rdquo;</span>
      </p>
    </div>
  );
}
