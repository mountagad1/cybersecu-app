/**
 * Copy text the visitor asked to copy — only ever called from a click.
 *
 * Reports what really happened: « copied » only once the Clipboard API has
 * resolved, never optimistically. There is no `execCommand("copy")`
 * fallback: it would need the text in a hidden, focused field, and its
 * return value is unreliable across browsers. When copying is impossible
 * the visitor is told to select the text by hand instead.
 */

export type CopyResult = "copied" | "unavailable" | "failed";

export interface ClipboardLike {
  writeText(text: string): Promise<void>;
}

export async function copyText(text: string, clipboard: ClipboardLike | null | undefined = globalThis.navigator?.clipboard): Promise<CopyResult> {
  if (!clipboard || typeof clipboard.writeText !== "function") return "unavailable";
  try {
    await clipboard.writeText(text);
    return "copied";
  } catch {
    // Permission refused, insecure context, document not focused. The
    // error is not logged: it could be shown alongside the text.
    return "failed";
  }
}
