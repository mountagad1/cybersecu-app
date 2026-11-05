import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { listAttacks } = await import("@/content/attacks");
const { listGuides } = await import("@/content/guides");
const { attacksUsingLever, getLocalizedLever, listLevers } =
  await import("@/content/levers");

/**
 * Retrieval tests (docs/seo/GEO_RETRIEVAL_TESTS.md).
 *
 * For each fiche, the six questions a reader — or a search or answer
 * engine on their behalf — asks about an attack must each have their own,
 * self-contained answer on the page, in both languages. These tests do not
 * measure any engine: they check that the answer exists, in the section
 * the page is built around, long enough to stand on its own when quoted.
 *
 * Thresholds are floors, set well below the shortest current answer: they
 * catch a section that was emptied or reduced to a fragment, not style.
 */
const QUESTIONS = [
  {
    question: "What is X?",
    check: (t: Fiche) =>
      t.plainLanguageDefinition.length >= 80 && t.definition.length >= 100,
  },
  {
    question: "How does X work?",
    check: (t: Fiche) => t.howItWorks.length >= 200,
  },
  {
    question: "How can I recognize X?",
    check: (t: Fiche) =>
      t.warningSigns.length >= 3 && (t.example?.giveaways.length ?? 0) >= 2,
  },
  {
    question: "How do I protect myself from X?",
    check: (t: Fiche) =>
      t.howToVerify.length >= 80 &&
      (t.prevention?.length ?? 0) >= 2 &&
      (t.decisionChecklist?.length ?? 0) >= 2,
  },
  {
    question: "What should I do if I clicked / fell for X?",
    check: (t: Fiche) => t.whatToDoIfVictim.length >= 100,
  },
  {
    question: "What are examples of X?",
    check: (t: Fiche) => Boolean(t.example?.message.trim()),
  },
] as const;

type Fiche = {
  plainLanguageDefinition: string;
  definition: string;
  howItWorks: string;
  warningSigns: string[];
  howToVerify: string;
  whatToDoIfVictim: string;
  example?: { message: string; giveaways: string[] };
  prevention?: string[];
  decisionChecklist?: unknown[];
  name: string;
  aliases?: string[];
};

const attacks = listAttacks();
const fiches = (locale: "fr" | "en") =>
  attacks.map((a) => ({
    slug: a.slug,
    fiche: (locale === "fr" ? a : a.translations?.en) as Fiche | undefined,
  }));

describe.each(["fr", "en"] as const)(
  "retrieval — every fiche answers the six questions (%s)",
  (locale) => {
    it("has a fiche in this language for every published attack", () => {
      expect(
        fiches(locale)
          .filter((f) => !f.fiche)
          .map((f) => f.slug),
      ).toEqual([]);
    });

    for (const { question, check } of QUESTIONS) {
      it(question, () => {
        const missing = fiches(locale)
          .filter((f) => f.fiche && !check(f.fiche))
          .map((f) => f.slug);
        expect(missing).toEqual([]);
      });
    }

    it("never gives the same name or synonym to two fiches (one term, one entity)", () => {
      const norm = (s: string) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s*\(.*?\)\s*/g, " ")
          .trim();
      const owners = new Map<string, Set<string>>();
      for (const { slug, fiche } of fiches(locale)) {
        if (!fiche) continue;
        const terms = new Set([fiche.name, ...(fiche.aliases ?? [])].map(norm));
        for (const m of fiche.name.matchAll(/\(([^)]+)\)/g))
          terms.add(norm(m[1]));
        for (const term of terms)
          owners.set(term, (owners.get(term) ?? new Set()).add(slug));
      }
      const shared = [...owners]
        .filter(([, slugs]) => slugs.size > 1)
        .map(([term, slugs]) => `${term}: ${[...slugs].join(", ")}`);
      expect(shared).toEqual([]);
    });
  },
);

describe("retrieval — every guide answers its own question", () => {
  it.each(listGuides().map((g) => [g.slug, g] as const))("%s", (_, guide) => {
    expect(guide.question.trim().endsWith("?")).toBe(true);
    expect(guide.shortAnswer.length).toBeGreaterThanOrEqual(120);
    expect(guide.steps.length).toBeGreaterThanOrEqual(3);
    expect(guide.references.length).toBeGreaterThanOrEqual(1);
  });
});

/**
 * A lever page answers the questions asked about a psychological lever
 * (« what is urgency in a scam », « why does it work », « how do I resist
 * it », « which scams use it »), in both languages.
 */
describe.each(["fr", "en"] as const)(
  "retrieval — every lever answers its questions (%s)",
  (locale) => {
    it.each(listLevers().map((l) => [l.slug, l] as const))("%s", (_, lever) => {
      const text = locale === "fr" ? lever : getLocalizedLever(lever);
      expect(text, "translated").toBeTruthy();
      if (!text) return;
      // What is it?
      expect(text.plainLanguageDefinition.length).toBeGreaterThanOrEqual(80);
      expect(text.definition.length).toBeGreaterThanOrEqual(80);
      // Why does it work?
      expect(text.whyItWorks.length).toBeGreaterThanOrEqual(200);
      // How do I resist it?
      expect(text.howToResist.length).toBeGreaterThanOrEqual(120);
      expect(text.counterQuestion.trim().endsWith("?")).toBe(true);
      // Which scams use it? (examples, through the fiches that rely on it)
      expect(attacksUsingLever(lever.code).length).toBeGreaterThanOrEqual(1);
    });
  },
);
