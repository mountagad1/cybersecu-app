import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const engine = await import("./engine");
const { listAttacks } = await import("@/content/attacks");
const { listAudiences, audienceAttacks, audiencePath } =
  await import("@/content/audiences");
const { listGuides, listGuidesEn } = await import("@/content/guides");
const { listSimulations } = await import("@/content/simulations");
const { listSimulationsEn } = await import("@/content/simulations-en");
const { listTools } = await import("@/content/tools");
const { buildUrlRegistry } = await import("@/domain/seo/indexability");
const { AUDIENCE_LINKS } = await import("@/components/home/audience-links");
const { getUiStrings } = await import("@/domain/i18n/dictionary");

type Link = import("./engine").ContextLink;

const indexable = new Set(
  buildUrlRegistry()
    .filter((e) => e.indexable)
    .map((e) => e.path),
);
const GENERIC =
  /^(cliquez ici|ici|en savoir plus|lire la suite|voir plus|click here|here|read more|learn more|lancer la simulation|start the simulation)$/i;

/** The properties every link set the engine returns must have. */
function expectSound(
  self: string,
  groups: Record<string, Link[]>,
  locale: "fr" | "en",
) {
  const links = Object.values(groups).flat();
  const hrefs = links.map((l) => l.href);
  expect(hrefs, self).not.toContain(self);
  expect(new Set(hrefs).size, `${self} : lien en double`).toBe(hrefs.length);
  for (const link of links) {
    expect(
      indexable.has(link.href.split(/[?#]/)[0]),
      `${self} → ${link.href}`,
    ).toBe(true);
    expect(
      link.href.startsWith("/en/") || link.href === "/en",
      `${self} → ${link.href}`,
    ).toBe(locale === "en");
    expect(link.anchor.trim().length, `${self} → ${link.href}`).toBeGreaterThan(
      3,
    );
    expect(
      GENERIC.test(link.anchor.trim()),
      `${self} : ancre générique « ${link.anchor} »`,
    ).toBe(false);
  }
}

describe.each(["fr", "en"] as const)("linking engine (%s)", (locale) => {
  it("gives every fiche sound links, and a way out if it already happened", () => {
    for (const attack of listAttacks()) {
      const self = attackHref(attack.code, locale);
      if (!self) continue; // not translated: no English page
      const links = engine.linksForAttack(attack, locale);
      expectSound(self, links, locale);
      expect(links.protection.length, self).toBe(2);
      // Tools never repeat what the checklists or protection actions already offer.
      expect(
        links.tools.every((t) => t.kind === "tool"),
        self,
      ).toBe(true);
    }
  });

  it("is deterministic", () => {
    const attack = listAttacks()[0];
    expect(engine.linksForAttack(attack, locale)).toEqual(
      engine.linksForAttack(attack, locale),
    );
    const audience = listAudiences()[0];
    expect(engine.linksForAudience(audience, locale)).toEqual(
      engine.linksForAudience(audience, locale),
    );
  });

  it("links each audience checklist to its fiches, simulations, guides and siblings", () => {
    for (const audience of listAudiences()) {
      const links = engine.linksForAudience(audience, locale);
      const self = audiencePath(audience, locale);
      expectSound(self, links, locale);
      expect(links.attacks.length, self).toBe(audienceAttacks(audience).length);
      expect(links.simulations.length, self).toBeGreaterThan(2);
      expect(links.guides.length, self).toBeGreaterThan(0);
      expect(links.guides.length, self).toBeLessThanOrEqual(3);
      expect(links.audiences.length, self).toBe(listAudiences().length - 1);
    }
  });

  it("only shows an audience the simulations written for it, or training a fiche it cites", () => {
    for (const audience of listAudiences()) {
      const cited = new Set(audienceAttacks(audience).map((a) => a.code));
      for (const sim of engine.audienceSimulations(audience, locale)) {
        if (audience.profile) expect(sim.targetProfile).toBe(audience.profile);
        else expect(cited.has(sim.attackCode), sim.slug).toBe(true);
      }
    }
  });

  it("keeps fiche ↔ checklist and simulation ↔ checklist links reciprocal", () => {
    for (const audience of listAudiences()) {
      const self = audiencePath(audience, locale);
      const links = engine.linksForAudience(audience, locale);
      for (const attack of audienceAttacks(audience)) {
        const back = engine
          .linksForAttack(attack, locale)
          .audiences.map((l) => l.href);
        expect(back, `${attack.code} → ${self}`).toContain(self);
      }
      const sims = locale === "fr" ? listSimulations() : listSimulationsEn();
      for (const link of links.simulations) {
        const sim = sims.find((s) =>
          link.href.endsWith(`/simulations/${s.slug}`),
        )!;
        const back = engine
          .linksForSimulation(sim, locale)
          .audiences.map((l) => l.href);
        expect(back, `${sim.slug} → ${self}`).toContain(self);
      }
    }
  });

  it("gives every simulation its fiche, and guides the checklist links back to", () => {
    for (const sim of locale === "fr"
      ? listSimulations()
      : listSimulationsEn()) {
      const links = engine.linksForSimulation(sim, locale);
      expectSound(
        `${locale === "en" ? "/en" : ""}/simulations/${sim.slug}`,
        links,
        locale,
      );
      expect(links.attack.length, sim.slug).toBe(1);
    }
    const guides = locale === "fr" ? listGuides() : listGuidesEn();
    for (const guide of guides) {
      expectSound(
        `${locale === "en" ? "/en" : ""}/guides/${guide.slug}`,
        engine.linksForGuide(guide, locale),
        locale,
      );
    }
  });

  it("offers each tool at most three other tools, then the index, never itself or a checklist", () => {
    const checklists = new Set(
      listAudiences().map((a) => audiencePath(a, locale)),
    );
    for (const tool of listTools()) {
      const { tools } = engine.linksForTool(tool.slug, locale);
      expect(tools.length).toBeLessThanOrEqual(4);
      expect(tools.at(-1)?.href).toBe(
        locale === "fr" ? "/outils" : "/en/tools",
      );
      expect(
        tools.some((t) => checklists.has(t.href)),
        tool.slug,
      ).toBe(false);
      expectSound(
        locale === "fr" ? `/outils/${tool.slug}` : `/en/tools/${tool.slug}`,
        { tools },
        locale,
      );
    }
  });

  it("links the homepage to existing pages, each target once", () => {
    const targets = [
      ...Object.values(AUDIENCE_LINKS[locale]).map((l) => l!.href),
      ...getUiStrings(locale).home.cards.flatMap((c) =>
        c.link ? [c.link.href] : [],
      ),
    ];
    for (const href of targets) expect(indexable.has(href), href).toBe(true);
    expect(new Set(targets).size).toBe(targets.length);
  });
});

describe("finalize", () => {
  it("drops self-links and keeps the first occurrence of a target", () => {
    const a = { kind: "tool" as const, href: "/a", anchor: "Outil A" };
    const b = { kind: "tool" as const, href: "/b", anchor: "Outil B" };
    const out = engine.finalize("/self", {
      first: [a, { ...b, href: "/self" }],
      second: [{ ...a, anchor: "Autre texte" }, b],
    });
    expect(out.first).toEqual([a]);
    expect(out.second).toEqual([b]);
  });
});

function attackHref(code: string, locale: "fr" | "en"): string {
  const attack = listAttacks().find((a) => a.code === code)!;
  if (locale === "fr") return `/attaques/${attack.slug}`;
  const en = attack.translations?.en?.slug;
  return en ? `/en/attaques/${en}` : "";
}

describe.each(["fr", "en"] as const)(
  "« test yourself » coverage (%s)",
  (locale) => {
    it("gives every fiche a simulation to practice on: its own, or a neighbor's", () => {
      const without: string[] = [];
      for (const attack of listAttacks()) {
        if (!attackHref(attack.code, locale)) continue;
        const links = engine.linksForAttack(attack, locale);
        // Never both: the neighbor only stands in when there is no own simulation.
        expect(
          links.simulations.length + links.nearbySimulation.length,
          attack.code,
        ).toBeLessThanOrEqual(1);
        if (links.simulations.length + links.nearbySimulation.length === 0)
          without.push(attack.code);
        const [nearby] = links.nearbySimulation;
        if (nearby) {
          expect(nearby.code, attack.code).not.toBe(attack.code);
          const neighbor = listAttacks().find((a) => a.code === nearby.code)!;
          const related = attack.relatedAttackCodes.includes(neighbor.code);
          expect(
            related || neighbor.categorySlug === attack.categorySlug,
            attack.code,
          ).toBe(true);
        }
      }
      expect(without).toEqual([]);
    });

    it("offers on each guide the simulation of a fiche it covers", () => {
      const guides = locale === "fr" ? listGuides() : listGuidesEn();
      for (const guide of guides) {
        const [practice] = engine.linksForGuide(guide, locale).practice;
        expect(practice, guide.slug).toBeDefined();
        expect(guide.relatedAttackCodes).toContain(practice!.code);
        expect(indexable.has(practice!.href), practice!.href).toBe(true);
      }
    });
  },
);
