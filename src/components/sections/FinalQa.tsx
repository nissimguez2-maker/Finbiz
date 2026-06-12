import { Section, DataTable, Callout } from "@/components/ui";
import { finalQa } from "@/content/finalQa";

const SITE_URL = "https://finbizfunding.com/";
const SITE_LABEL = "finbizfunding.com";

/** 10 — Pre-flight: the four-block checklist a file clears before submission. */
export function FinalQa() {
  const { meta, columns, rows, callouts, note } = finalQa;
  return (
    <Section meta={meta}>
      <div className="space-y-5">
        <DataTable columns={columns} rows={rows} />

        {callouts?.map((c) => (
          <Callout key={c.label} {...c} />
        ))}

        {note && (
          <footer className="text-[13px] leading-relaxed text-muted-foreground">
            {renderNote(note)}
          </footer>
        )}
      </div>
    </Section>
  );
}

/** Renders the compliance note, turning the site mention into a real accent link. */
function renderNote(note: string): React.ReactNode {
  const [before, after] = note.split(SITE_LABEL);
  if (after === undefined) return note;
  return (
    <>
      {before}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noreferrer"
        className="focus-ring rounded-sm font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
      >
        {SITE_LABEL}
      </a>
      {after}
    </>
  );
}
