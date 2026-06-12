import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A single small copy-to-clipboard affordance for the literal text-message
 * blocks in the Close beat. Quiet by default; the accent shows only on
 * hover/focus and the confirmation tick. On success a visually-hidden live
 * region announces "Copied" so screen-reader users get the same feedback the
 * tick gives sighted users; if the clipboard API is unavailable it no-ops
 * without throwing.
 */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable (no API / insecure context) — fail quietly */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : label}
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground",
          "transition-colors hover:text-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {copied ? (
          <Check aria-hidden className="h-4 w-4 text-accent" />
        ) : (
          <Copy aria-hidden className="h-4 w-4" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}
