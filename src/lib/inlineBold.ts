/**
 * inlineMarkup — the one shared renderer for the lightweight inline markup the
 * locked content embeds inside strings:
 *   **bold**   → emphasised run (near-black, semibold)
 *   [[note]]   → a quiet parenthetical aside (muted)
 *
 * Escapes HTML first (content is first-party but we never inject markup), then
 * applies the two runs. Returns a `{ __html }` object for
 * `dangerouslySetInnerHTML`. Centralised so the escape rules never drift apart
 * between the panels.
 */
export function inlineMarkup(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="text-muted-foreground">($1)</span>');
  return { __html: html };
}
