import { describe, expect, it } from "vitest";
import { REDIRECTS } from "@/content/redirects";
import {
  attacksUsingLever,
  auditLevers,
  isLeverPublishable,
  listAllLevers,
  listLevers,
  LEVER_PUBLICATION_THRESHOLD,
} from "@/content/levers";
import { attacksForGuide, auditGuides, listGuides } from "@/content/guides";
import { ATTACK_CATEGORIES, CATEGORY_PUBLICATION_THRESHOLD } from "@/domain/attack/categories";
import {
  auditCatalogue,
  findNearDuplicates,
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
  listCategoriesWithAttacks,
  relatedAttacks,
} from "@/content/attacks";
import type { AttackEntry } from "@/content/attacks";
import { auditSimulations, listSimulations, toPublicScenario } from "@/content/simulations";
import type { SimulationEntry } from "@/content/simulations";
import {
  auditContentGraph,
  buildUrlRegistry,
  findOrphanPaths,
  indexableEntries,
} from "@/domain/seo/indexability";

/**
 * These tests exist because the content catalogue is now the thing that
 * makes pages appear at all: a structural fault in it is a blank page in
 * production, which is precisely the incident this architecture was meant
 * to end (docs/BLANK_PAGES_ROOT_CAUSE.md).
 *
 * Each audit is tested twice — once against the real catalogue, and once
 * against a deliberately broken fixture, so a check that silently stopped
 * working would fail here rather than pass vacuously.
 */

const sampleAttack: AttackEntry = {
  code: "TEST-1",
  slug: "test-1",
  name: "Test 1",
  categorySlug: "ingenierie-sociale",
  editorialStatus: "published",
  plainLanguageDefinition: "Ce qui vous arrive, en une phrase simple et différente de la définition.",
  attackerObjective: "identifiants",
  primaryVector: "email",
  primaryDimension: "phishing_recognition",
  updatedAt: "2026-01-01",
  publishedAt: "2026-01-01",
  definition: "Une définition de test suffisamment longue pour être comparable à une autre.",
  howItWorks: "Un mécanisme de test décrit avec assez de mots pour alimenter la comparaison.",
  warningSigns: ["s"],
  triggers: ["urgency"],
  indicators: [],
  howToVerify: "v",
  whatToDo: "w",
  whatToDoIfVictim: "wv",
  relatedAttackCodes: [],
  faq: [],
  references: [],
};

describe("attack catalogue", () => {
  it("the shipped catalogue is structurally sound", () => {
    expect(auditCatalogue(listAttacks())).toEqual([]);
  });

  it("refuses a fiche that both has a simulation and explains why it has none", () => {
    // The two fields answer the same question. Declaring both means one of
    // them is stale, and nothing downstream can tell which.
    const problems = auditCatalogue([
      {
        ...sampleAttack,
        simulationSlug: "email-banque",
        noSimulationReason:
          "Une raison assez longue pour passer le seuil de relecture imposé par l'audit.",
      },
    ]);
    expect(problems.join(" ")).toMatch(/à la fois une simulation et une raison/);
  });

  it("refuses a no-simulation reason too short to be reviewed", () => {
    // « pas pertinent » is not a decision anyone can check later.
    const problems = auditCatalogue([{ ...sampleAttack, noSimulationReason: "pas pertinent" }]);
    expect(problems.join(" ")).toMatch(/noSimulationReason trop court/);
  });

  it("treats a fiche with neither as still to be written, not as settled", () => {
    // The absence of both fields is the normal state of unwritten work and
    // must not fail the build — `pnpm seo:audit` counts them instead.
    expect(auditCatalogue([sampleAttack])).toEqual([]);
  });

  it("routes a family only once it has enough fiches to be worth a page", () => {
    // A hub listing one or two fiches duplicates what it links to. Families
    // declared ahead of their content are expected here — they simply must
    // not be routed until they clear the threshold.
    for (const category of ATTACK_CATEGORIES) {
      const count = listAttacksInCategory(category.slug).length;
      expect(isCategoryPublishable(category), `${category.slug} (${count} fiches)`).toBe(
        count >= CATEGORY_PUBLICATION_THRESHOLD,
      );
    }
  });

  it("keeps every published fiche inside a routed family, so none is orphaned", () => {
    expect(findOrphanPaths()).toEqual([]);
  });

  it("gives every fiche an « En clair » that says something the definition does not", () => {
    for (const attack of listAttacks()) {
      expect(attack.plainLanguageDefinition.length, attack.code).toBeGreaterThan(40);
      expect(attack.definition, attack.code).not.toContain(
        attack.plainLanguageDefinition.slice(0, 60),
      );
    }
  });

  it("flags an « En clair » that is only a trimmed copy of the definition", () => {
    const excerpt = sampleAttack.definition.slice(0, 60);
    const problems = auditCatalogue([
      {
        ...sampleAttack,
        definition: `${excerpt} et la suite de la définition complète.`,
        plainLanguageDefinition: excerpt,
      },
    ]);
    expect(problems.some((p) => p.includes("extrait de definition"))).toBe(true);
  });

  it("detects two fiches whose prose has converged", () => {
    // Long enough to clear MIN_WORDS_FOR_COMPARISON: short imperatives are
    // deliberately exempt, because "ne saisissez aucune coordonnée
    // bancaire" is the right advice in a dozen fiches.
    const prose =
      "Un message frauduleux imite fidèlement un organisme connu, reprend son identité visuelle complète, " +
      "annonce une difficulté administrative pressante concernant votre dossier personnel, puis propose un " +
      "lien menant vers une page de connexion contrefaite destinée à collecter vos identifiants bancaires " +
      "ainsi que vos coordonnées personnelles détaillées, exploitées immédiatement ensuite.";
    const problems = auditCatalogue([
      { ...sampleAttack, howItWorks: prose },
      { ...sampleAttack, code: "TEST-2", slug: "test-2", howItWorks: prose },
    ]);
    expect(problems.some((p) => p.includes("identique à"))).toBe(true);
  });

  it("does not flag two genuinely different fiches as near-duplicates", () => {
    expect(findNearDuplicates(listAttacks())).toEqual([]);
  });

  it("compares the action fields, not only the descriptive ones", () => {
    // Regression test for a real gap: the audit scanned definition,
    // howItWorks and plainLanguageDefinition only, and two fiches reached
    // 88% on `whatToDo` without the build noticing.
    const action =
      "Ne réglez strictement rien depuis le message reçu, ne communiquez aucune coordonnée bancaire " +
      "personnelle, et rejoignez systématiquement le service officiel concerné par un chemin que vous " +
      "maîtrisez vous-même, comme un favori enregistré préalablement ou l'application installée depuis " +
      "un magasin officiel, avant toute décision engageante.";
    const problems = auditCatalogue([
      { ...sampleAttack, whatToDo: action },
      { ...sampleAttack, code: "TEST-2", slug: "test-2", whatToDo: action },
    ]);
    expect(problems.some((p) => p.includes("whatToDo"))).toBe(true);
  });

  it("exempts short imperatives, which legitimately repeat across fiches", () => {
    const short = "Ne payez pas. Supprimez le message.";
    const problems = auditCatalogue([
      { ...sampleAttack, whatToDo: short },
      { ...sampleAttack, code: "TEST-2", slug: "test-2", whatToDo: short },
    ]);
    expect(problems.some((p) => p.includes("whatToDo"))).toBe(false);
  });

  it("resolves every related-attack link to a real page", () => {
    for (const attack of listAttacks()) {
      expect(relatedAttacks(attack)).toHaveLength(attack.relatedAttackCodes.length);
    }
  });

  it("rejects a duplicate slug", () => {
    const problems = auditCatalogue([sampleAttack, { ...sampleAttack, code: "TEST-2" }]);
    expect(problems.some((p) => p.includes("slug dupliqué"))).toBe(true);
  });

  it("rejects a dangling internal link", () => {
    const problems = auditCatalogue([{ ...sampleAttack, relatedAttackCodes: ["NOPE-1"] }]);
    expect(problems.some((p) => p.includes("NOPE-1"))).toBe(true);
  });

  it("rejects an entry too thin to publish", () => {
    const problems = auditCatalogue([{ ...sampleAttack, warningSigns: [] }]);
    expect(problems.some((p) => p.includes("warningSigns"))).toBe(true);
  });

  it("rejects an unknown category", () => {
    const problems = auditCatalogue([
      { ...sampleAttack, categorySlug: "inexistante" as AttackEntry["categorySlug"] },
    ]);
    expect(problems.some((p) => p.includes("catégorie inconnue"))).toBe(true);
  });

  it("never uses a slug that collides with a category hub", () => {
    const categorySlugs = new Set(ATTACK_CATEGORIES.map((c) => c.slug));
    for (const attack of listAttacks()) {
      expect(categorySlugs.has(attack.slug), attack.slug).toBe(false);
    }
  });
});

describe("simulation catalogue", () => {
  it("the shipped catalogue is structurally sound", () => {
    expect(auditSimulations(listSimulations())).toEqual([]);
  });

  it("uses only the reserved .test TLD, so no scenario can be reused as real phishing", () => {
    for (const sim of listSimulations()) {
      for (const url of sim.content.body.match(/https?:\/\/[^\s)]+/g) ?? []) {
        expect(url, `${sim.slug} : ${url}`).toMatch(/^https?:\/\/[^/\s]*\.test(\/|$|\?)/);
      }
    }
  });

  it("rejects a URL outside the .test TLD", () => {
    const [first] = listSimulations();
    const broken: SimulationEntry = {
      ...first,
      content: { ...first.content, body: "Cliquez ici : https://banque-reelle.example.com/x" },
    };
    expect(auditSimulations([broken]).some((p) => p.includes("TLD réservé"))).toBe(true);
  });

  it("rejects a correct answer that is not among the choices", () => {
    const [first] = listSimulations();
    const broken: SimulationEntry = { ...first, correctChoiceIds: ["absent"] };
    expect(auditSimulations([broken]).some((p) => p.includes("absent"))).toBe(true);
  });

  it("never leaks the answer through the public projection", () => {
    for (const sim of listSimulations()) {
      const publicScenario = toPublicScenario(sim);
      const serialised = JSON.stringify(publicScenario);
      expect(serialised).not.toContain("correctChoiceIds");
      expect(serialised).not.toContain("mistakePatternCodes");
      expect(serialised).not.toContain("isRecommended");
      for (const explanation of Object.values(sim.explanations)) {
        expect(serialised).not.toContain(explanation.whyDangerous);
      }
    }
  });

  it("always offers « Je ne sais pas », so nobody is forced to guess", () => {
    for (const sim of listSimulations()) {
      expect(sim.choices.some((c) => c.isUnsure), sim.slug).toBe(true);
    }
  });
});

describe("url registry", () => {
  it("has no cross-catalogue faults", () => {
    expect(auditContentGraph()).toEqual([]);
  });

  it("lists every attack page, every category hub and every simulation exactly once", () => {
    const paths = buildUrlRegistry().map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const attack of listAttacks()) expect(paths).toContain(`/attaques/${attack.slug}`);
    for (const category of ATTACK_CATEGORIES.filter(isCategoryPublishable)) {
      expect(paths).toContain(`/attaques/${category.slug}`);
    }
    for (const sim of listSimulations()) expect(paths).toContain(`/simulations/${sim.slug}`);
  });

  it("dates exactly the entries that have an editorial date, so lastmod is never invented", () => {
    // Fiches, hubs, levers, guides and the indexes of those catalogues carry
    // a review date. Simulations, tools, the homepage and legal pages have
    // none, and must send none rather than borrow another page's date. The
    // scam gallery shows the fiches' own examples, so it takes their date.
    const DATED_STATIC = new Set([
      "/attaques",
      "/en/attaques",
      "/guides",
      "/en/guides",
      "/leviers",
      "/en/levers",
      "/exemples",
      "/en/examples",
    ]);
    for (const entry of indexableEntries(buildUrlRegistry())) {
      const dated = ["attack", "category", "lever", "guide"].includes(entry.type) || DATED_STATIC.has(entry.path);
      if (dated) expect(entry.lastModified, entry.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      else expect(entry.lastModified ?? null, entry.path).toBeNull();
    }
  });
});

describe("slug redirects", () => {
  it("never redirects away from a slug that is still live", () => {
    // A `from` that is also a live entity or hub slug is a loop: the page
    // stops being reachable instead of being moved.
    const live = new Set([
      ...listAttacks().map((a) => `/attaques/${a.slug}`),
      ...ATTACK_CATEGORIES.filter(isCategoryPublishable).map((c) => `/attaques/${c.slug}`),
      ...buildUrlRegistry().map((e) => e.path),
    ]);
    for (const redirect of REDIRECTS) {
      expect(live.has(redirect.from), redirect.from).toBe(false);
    }
  });

  it("points every redirect at a page that exists", () => {
    const live = new Set([
      "/attaques",
      "/simulations",
      ...listAttacks().map((a) => `/attaques/${a.slug}`),
      ...ATTACK_CATEGORIES.filter(isCategoryPublishable).map((c) => `/attaques/${c.slug}`),
      ...buildUrlRegistry()
        .filter((e) => e.indexable)
        .map((e) => e.path),
    ]);
    for (const redirect of REDIRECTS) {
      expect(live.has(redirect.to), `${redirect.from} → ${redirect.to}`).toBe(true);
    }
  });

  it("declares no redirect twice, and none that chains into another", () => {
    const froms = REDIRECTS.map((r) => r.from);
    expect(new Set(froms).size).toBe(froms.length);
    for (const redirect of REDIRECTS) {
      expect(froms, `${redirect.to} est lui-même redirigé`).not.toContain(redirect.to);
    }
  });
});

describe("hub routing", () => {
  it("routes no hub for a family below the publication threshold", async () => {
    // Regression test for a real defect: `generateStaticParams` listed every
    // declared family, so the six families declared ahead of their content
    // each served a hub with an empty list — HTTP 200 on a page with nothing
    // on it, which is the soft 404 the whole threshold exists to prevent.
    const { generateStaticParams } = await import("@/app/(marketing)/attaques/[slug]/page");
    const routed = new Set((await generateStaticParams()).map((p) => p.slug));

    for (const category of ATTACK_CATEGORIES) {
      expect(routed.has(category.slug), category.slug).toBe(isCategoryPublishable(category));
    }
    for (const attack of listAttacks()) {
      expect(routed.has(attack.slug), attack.slug).toBe(true);
    }
  });
});

describe("levers", () => {
  it("the shipped levers are structurally sound", () => {
    expect(auditLevers(listAllLevers())).toEqual([]);
  });

  it("publishes a lever only once enough fiches declare it", () => {
    for (const lever of listAllLevers()) {
      const count = attacksUsingLever(lever.code).length;
      const published =
        lever.editorialStatus === "published" && count >= LEVER_PUBLICATION_THRESHOLD;
      expect(isLeverPublishable(lever), `${lever.slug} (${count} fiches)`).toBe(published);
    }
  });

  it("derives a lever's fiches from the triggers they already declare", () => {
    // The point of deriving rather than declaring: the two lists cannot
    // disagree, because there is only one.
    for (const lever of listLevers()) {
      for (const attack of attacksUsingLever(lever.code)) {
        expect(attack.triggers, attack.code).toContain(lever.code);
      }
    }
  });

  it("gives every lever a counter-question the reader can carry away", () => {
    for (const lever of listAllLevers()) {
      expect(lever.counterQuestion.trim().endsWith("?"), lever.slug).toBe(true);
      expect(lever.counterQuestion.length, lever.slug).toBeGreaterThan(30);
    }
  });

  it("rejects a lever whose counter-question is not a question", () => {
    const [first] = listAllLevers();
    const problems = auditLevers([{ ...first, counterQuestion: "Réfléchissez avant d'agir." }]);
    expect(problems.some((p) => p.includes("counterQuestion"))).toBe(true);
  });
});

describe("guides", () => {
  it("the shipped guides are structurally sound", () => {
    expect(auditGuides(listGuides())).toEqual([]);
  });

  it("attaches every guide to at least one published fiche", () => {
    // Fiches derive their guides from this list, so a guide naming no
    // fiche is reachable only from /guides — a single point of entry.
    for (const guide of listGuides()) {
      expect(attacksForGuide(guide).length, guide.slug).toBeGreaterThan(0);
    }
  });

  it("rejects a guide pointing at an attack that does not exist", () => {
    const [first] = listGuides();
    const problems = auditGuides([{ ...first, relatedAttackCodes: ["NOPE-000001"] }]);
    expect(problems.some((p) => p.includes("NOPE-000001"))).toBe(true);
  });

  it("gives each guide one dominant question, ending in a question mark", () => {
    const questions = listGuides().map((g) => g.question);
    expect(new Set(questions).size).toBe(questions.length);
    for (const guide of listGuides()) {
      expect(guide.question.trim().endsWith("?"), guide.slug).toBe(true);
    }
  });

  it("keeps guides and fiches out of each other's intent", () => {
    // A guide answers "how do I do this", a fiche answers "what is this".
    // If a guide's short answer reads like a fiche's definition, the split
    // is wrong — this is the cannibalisation the plan warns about.
    for (const guide of listGuides()) {
      for (const attack of attacksForGuide(guide)) {
        expect(guide.shortAnswer, `${guide.slug} / ${attack.code}`).not.toBe(attack.definition);
        expect(guide.title, `${guide.slug} / ${attack.code}`).not.toBe(attack.name);
      }
    }
  });
});

describe("outbound links", () => {
  it("never lists a family whose hub is not routed", () => {
    // Regression test for a real defect found by crawling the built site:
    // /attaques rendered a heading and two links for all ten families,
    // and the five below the publication threshold returned 404. Five
    // broken links on the site's main page, invisible to an orphan check
    // that only looks at incoming links.
    for (const { category } of listCategoriesWithAttacks()) {
      expect(isCategoryPublishable(category), category.slug).toBe(true);
    }
  });

  it("lists every routed family, so none becomes unreachable", () => {
    const listed = new Set(listCategoriesWithAttacks().map((c) => c.category.slug));
    for (const category of ATTACK_CATEGORIES.filter(isCategoryPublishable)) {
      expect(listed.has(category.slug), category.slug).toBe(true);
    }
  });
});
