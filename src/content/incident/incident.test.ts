import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const {
  INCIDENT_SITUATIONS,
  INCIDENT_ALWAYS,
  checklistSituations,
  decodeIncidentCodes,
} = await import("./index");
const { listGuides, englishGuideSlug } = await import("@/content/guides");
const { findAttackByCode } = await import("@/content/attacks");

describe("incident situations", () => {
  it("have unique codes and unique anchors in each language", () => {
    const codes = INCIDENT_SITUATIONS.map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const locale of ["fr", "en"] as const) {
      const ids = INCIDENT_SITUATIONS.map((s) => s[locale].id);
      expect(new Set(ids).size, locale).toBe(ids.length);
    }
  });

  it("say the same thing in French and English, step for step", () => {
    for (const s of INCIDENT_SITUATIONS) {
      expect(s.en.actions.length, s.code).toBe(s.fr.actions.length);
      expect(s.en.choice, s.code).not.toBe(s.fr.choice);
    }
    expect(INCIDENT_ALWAYS.en.length).toBe(INCIDENT_ALWAYS.fr.length);
  });

  it("point to guides that exist in both languages", () => {
    const guides = new Set(listGuides().map((g) => g.slug));
    for (const s of INCIDENT_SITUATIONS) {
      if (!s.guideSlug) continue;
      expect(guides.has(s.guideSlug), s.code).toBe(true);
      expect(englishGuideSlug(s.guideSlug), s.code).toBeTruthy();
    }
  });

  it("link only to tools that exist in both languages, on steps that need them", async () => {
    const { listTools, englishToolSlug } = await import("@/content/tools");
    const tools = new Set(listTools().map((t) => t.slug));
    const withTool = INCIDENT_SITUATIONS.filter((s) => s.tool);
    expect(withTool.map((s) => s.code)).toEqual(["appareil", "mot-de-passe", "compte"]);
    for (const s of withTool) {
      expect(tools.has(s.tool!.slug), s.code).toBe(true);
      expect(englishToolSlug(s.tool!.slug), s.code).toBeTruthy();
      // The link is offered where a step actually asks to change a password.
      expect(s.fr.actions.some((a) => /mots? de passe/.test(a)), s.code).toBe(true);
    }
  });

  it("keep the checklist as published: five situations, money first", () => {
    expect(checklistSituations().map((s) => s.code)).toEqual([
      "argent",
      "banque",
      "mot-de-passe",
      "compte",
      "appareil",
    ]);
  });

  it("take the « only clicked » advice from the phishing fiche's FAQ, not from nowhere", () => {
    const clic = INCIDENT_SITUATIONS.find((s) => s.code === "clic")!;
    const phishing = findAttackByCode("PHISH-000001")!;
    const fr = phishing.faq.map((f) => f.answer).join(" ");
    const en = (phishing.translations?.en?.faq ?? [])
      .map((f) => f.answer)
      .join(" ");
    expect(fr).toContain(clic.fr.note);
    expect(en).toContain(clic.en.note);
  });
});

describe("shared assistant URL", () => {
  it("drops « only clicked » when something else was done", () => {
    expect(decodeIncidentCodes("clic,banque")).toEqual(["banque"]);
    expect(decodeIncidentCodes("clic")).toEqual(["clic"]);
  });

  it("keeps known codes only, in urgency order", () => {
    expect(
      decodeIncidentCodes("clic,banque,<script>,mot-de-passe,banque"),
    ).toEqual(["banque", "mot-de-passe"]);
    expect(decodeIncidentCodes(null)).toEqual([]);
  });
});
