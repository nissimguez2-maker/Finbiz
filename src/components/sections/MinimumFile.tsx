import { Section, DataTable, Callout } from "@/components/ui";
import { minimumFile } from "@/content/minimumFile";

/** 06 — Minimum File: the core package plus the conditional extras. */
export function MinimumFile() {
  const { meta, columns, rows, callouts, note } = minimumFile;
  return (
    <Section meta={meta}>
      <div className="space-y-6">
        <DataTable columns={columns} rows={rows} />
        {callouts?.map((c) => (
          <Callout key={c.label} {...c} />
        ))}
        {note && (
          <p
            className="text-[14px] leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={noteHtml(note)}
          />
        )}
      </div>
    </Section>
  );
}

/**
 * Renders inline **bold** emphasis in the note. Escapes HTML first — data is
 * first-party (authored in repo), mirroring DataTable's cellHtml treatment.
 */
function noteHtml(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  return { __html: html };
}
