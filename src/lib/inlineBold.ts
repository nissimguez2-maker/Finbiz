/**
 * inlineBold — the one shared `**bold**` → <strong> escaper used wherever the
 * locked content embeds emphasis inside a string (product terms, file rows…).
 *
 * Escapes HTML first (so content text can never inject markup), then turns
 * `**…**` runs into bold. Returns a `{ __html }` object for
 * `dangerouslySetInnerHTML`. Centralised so the escape rules never drift apart
 * between the matrix and the reference list.
 */
export function inlineBold(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  return { __html: html };
}
