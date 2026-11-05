import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { listAttacks } = await import("@/content/attacks");

/**
 * Guards for the corrections of docs/audits/official-resources-audit.md.
 * They pin what was removed or narrowed so it does not quietly come back
 * through a later edit or translation.
 */
const fiches = listAttacks().map((a) => ({ slug: a.slug, text: JSON.stringify(a) }));

describe("official resources — audit 2026-10", () => {
  it("never sends readers to the telephone opt-out list (obsolete since 11 August 2026)", () => {
    const offending = fiches.filter((f) => /liste d'opposition au démarchage|do-not-call list|Bloctel/i.test(f.text));
    expect(offending.map((f) => f.slug)).toEqual([]);
  });

  it("only offers the 114 as an emergency SMS for someone who cannot speak, never as a reporting line", () => {
    const with114 = fiches.filter((f) => /\b114\b/.test(f.text));
    expect(with114.map((f) => f.slug)).toEqual(["stalkerware"]);
    // Every sentence that tells the reader to text the 114 says when.
    const sentences = with114[0].text.match(/[^."]*\b114\b[^."]*/g) ?? [];
    const instructions = sentences.filter((s) => /SMS|text 114/.test(s));
    expect(instructions.length).toBeGreaterThan(0);
    for (const s of instructions) expect(s).toMatch(/ne pouvez pas parler|can't speak/);
  });

  it("does not state a price or a gratuity for the 33700, which depends on the carrier", () => {
    const offending = fiches.filter((f) => /33700[^."]*(gratuit|free of charge|\bfree\b)/i.test(f.text));
    expect(offending.map((f) => f.slug)).toEqual([]);
  });
});
