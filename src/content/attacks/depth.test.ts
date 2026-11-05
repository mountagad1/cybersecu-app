import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { auditDepthFields, findAttackBySlug, listAttacks } = await import("@/content/attacks");
const { getLocalizedAttack } = await import("@/content/attacks/localize");
const { findSimulationBySlug } = await import("@/content/simulations");

/**
 * The fiches upgraded so far, batch by batch, as listed in
 * docs/content/TOP_20_CONTENT_UPGRADE_PLAN.md. Each must answer the whole page
 * contract (docs/content/CONTENT_QUALITY_STANDARD.md §1), including the four
 * depth fields and a simulation to practise on (or the reason there is none).
 */
const BATCH_1 = [
  "phishing",
  "smishing",
  "vishing",
  "faux-conseiller-bancaire",
  "faux-livreur-colis",
  "faux-support-technique",
  "usurpation-d-un-proche",
  "arnaque-sentimentale",
  "fausse-boutique-en-ligne",
  "faux-site-web",
  "faux-remboursement",
  "fausse-amende",
  "arnaque-a-l-investissement",
  "offre-d-emploi-frauduleuse",
  "quishing",
  "piratage-de-messagerie",
  "piratage-de-compte-de-reseau-social",
  "faux-ordre-de-virement",
  "clonage-vocal",
  "arnaque-a-la-petite-annonce",
];

const BATCH_2 = [
  "contournement-double-authentification",
  "typosquatting",
  "homoglyphes",
  "faux-agent-administratif",
  "fraude-au-changement-de-rib",
  "fausse-facture",
  "arnaque-a-la-location",
  "echange-de-carte-sim",
  "pretexting",
  "bourrage-d-identifiants",
  "fausse-mise-a-jour",
  "malvertising",
  "scareware",
  "deepfake-video",
  "hameconnage-genere-par-ia",
  "fausse-loterie",
  "chantage-au-faux-piratage",
  "deepfake-en-visioconference",
  "detournement-de-la-recuperation-de-compte",
  "application-malveillante",
];

const BATCH_3 = [
  "baiting",
  "extension-de-navigateur-malveillante",
  "faux-telechargement",
  "cheval-de-troie",
  "chatbot-malveillant",
  "faux-profil-genere-par-ia",
  "attaque-par-force-brute",
  "camera-de-surveillance-piratee",
  "fausse-application-d-ia",
  "faux-site-d-information-genere-par-ia",
  "rancongiciel",
  "tabnabbing",
  "sms-surtaxe",
  "attaque-par-superposition",
  "abus-d-autorisation-oauth",
  "faux-point-d-acces-wifi",
  "fraude-aux-documents-d-identite",
  "portail-captif-malveillant",
  "usurpation-de-profil-sur-les-reseaux-sociaux",
  "chantage-apres-fuite-de-donnees",
];

/**
 * Batch 4 includes fiches without a simulation: each states why in
 * noSimulationReason, which answers question 10 of the contract instead.
 */
const BATCH_4 = [
  "infostealer",
  "detournement-de-session",
  "usurpation-d-identite",
  "vol-d-identite",
  "fuite-de-donnees",
  "routeur-domestique-compromis",
  "virus-informatique",
  "logiciel-espion",
  "enregistreur-de-frappe",
  "permissions-abusives",
  "pulverisation-de-mots-de-passe",
  "detournement-de-navigateur",
  "clickjacking",
  "objet-connecte-compromis",
  "attaque-bluetooth",
  "juice-jacking",
  "empoisonnement-dns",
  "attaque-de-l-homme-du-milieu",
  "exposition-de-donnees-personnelles",
  "revente-de-donnees-personnelles",
];

/**
 * Batch 5 completes the catalogue. It includes the harassment and intimacy
 * fiches, written under stricter rules (plan §9).
 */
const BATCH_5 = [
  "attaque-par-deauthentification",
  "botnet",
  "cryptojacking",
  "cyberharcelement",
  "deni-de-service",
  "detournement-de-photos-par-ia",
  "diffusion-non-consentie-d-images",
  "doxxing",
  "interception-de-trafic",
  "moissonnage-de-donnees",
  "raid-de-harcelement",
  "reidentification",
  "rootkit",
  "sextorsion",
  "stalkerware",
  "swatting",
  "tracage-par-balise",
  "tracage-publicitaire-abusif",
  "usurpation-arp",
  "ver-informatique",
];

const UPGRADED = [...BATCH_1, ...BATCH_2, ...BATCH_3, ...BATCH_4, ...BATCH_5];

describe("page contract — upgraded fiches", () => {
  it.each(UPGRADED)("%s answers every question of the contract", (slug) => {
    const a = findAttackBySlug(slug);
    expect(a, slug).toBeDefined();
    if (!a) return;
    expect(a.plainLanguageDefinition, "Qu'est-ce que c'est ?").toBeTruthy();
    expect(a.howItWorks, "Comment ça fonctionne ?").toBeTruthy();
    expect(a.whyItWorks, "Pourquoi ça marche ?").toBeTruthy();
    expect(a.warningSigns.length, "Quels signaux ?").toBeGreaterThanOrEqual(3);
    expect(a.decisionChecklist?.length, "Que vérifier ?").toBeGreaterThanOrEqual(2);
    expect(a.whatToDo, "Que faire ?").toBeTruthy();
    expect(a.whatToDoIfVictim, "Si c'est déjà arrivé ?").toBeTruthy();
    expect(a.prevention?.length, "Éviter que ça se reproduise ?").toBeGreaterThanOrEqual(2);
    expect(a.references.length, "Où en savoir plus ?").toBeGreaterThan(0);
    expect(a.example?.giveaways.length, "Exemple concret").toBeGreaterThanOrEqual(2);
    // Où s'entraîner ? — a simulation, or the stated reason there is none.
    if (a.simulationSlug) expect(findSimulationBySlug(a.simulationSlug), "Où s'entraîner ?").toBeTruthy();
    else expect(a.noSimulationReason, "Où s'entraîner ? (ou pourquoi pas)").toBeTruthy();
  });

  it("never lists a fiche in two batches", () => {
    expect(new Set(UPGRADED).size).toBe(UPGRADED.length);
  });

  it("covers the whole catalogue", () => {
    expect([...UPGRADED].sort()).toEqual(listAttacks().map((a) => a.slug).sort());
  });

  it("keeps the depth fields to the reviewed batches", () => {
    // Fiches are upgraded deliberately, one reviewed batch at a time, never by
    // bulk generation: a new fiche with depth fields must join a batch above.
    const withDepth = listAttacks().filter((a) => a.whyItWorks || a.example || a.decisionChecklist || a.prevention);
    expect(withDepth.map((a) => a.slug).sort()).toEqual([...UPGRADED].sort());
  });
});

describe("page contract — English overlay", () => {
  it.each(UPGRADED)("%s carries its depth fields in English", (slug) => {
    const a = findAttackBySlug(slug)!;
    const en = getLocalizedAttack(a, "en");
    expect(en, `${slug} has no English page`).not.toBeNull();
    expect(en!.whyItWorks).toBeTruthy();
    expect(en!.example?.giveaways.length).toBe(a.example!.giveaways.length);
    expect(en!.decisionChecklist?.length).toBe(a.decisionChecklist!.length);
    expect(en!.prevention?.length).toBe(a.prevention!.length);
  });

  it("reads the French depth fields for French and the English ones for English", () => {
    const a = findAttackBySlug("smishing")!;
    expect(getLocalizedAttack(a, "fr")!.whyItWorks).toBe(a.whyItWorks);
    expect(getLocalizedAttack(a, "en")!.whyItWorks).toBe(a.translations!.en!.whyItWorks);
    expect(a.translations!.en!.whyItWorks).not.toBe(a.whyItWorks);
  });
});

describe("auditDepthFields", () => {
  const base = findAttackBySlug("smishing")!;

  it("accepts the published catalogue", () => {
    expect(auditDepthFields(listAttacks())).toEqual([]);
  });

  it("rejects a real-looking domain in a fictional example", () => {
    const bad = { ...base, example: { ...base.example!, message: "Payez sur banque-exemple.fr/payer" } };
    expect(auditDepthFields([bad]).join()).toMatch(/hors \.test/);
  });

  it("rejects a statistic in a factual field", () => {
    const bad = { ...base, whyItWorks: "Elle touche 40 % des personnes." };
    expect(auditDepthFields([bad]).join()).toMatch(/pourcentage/);
  });

  it("allows a percentage inside a fictional example", () => {
    const ok = { ...base, example: { ...base.example!, message: "−68 % sur tout le site : promo.example-not-real.test" } };
    expect(auditDepthFields([ok])).toEqual([]);
  });

  it("requires checklist items to be questions, and lists to stay short", () => {
    const bad = {
      ...base,
      decisionChecklist: [{ check: "Vérifiez le domaine", then: "x" }, { check: "Un autre ?", then: "y" }],
      prevention: ["a", "b", "c", "d", "e"],
    };
    const problems = auditDepthFields([bad]).join(" | ");
    expect(problems).toMatch(/est une question/);
    expect(problems).toMatch(/2 à 4 habitudes/);
  });

  it("holds the English overlay to the same rules", () => {
    const en = base.translations!.en!;
    const bad = { ...base, translations: { en: { ...en, example: { ...en.example!, message: "Pay at bank-example.com/pay" } } } };
    expect(auditDepthFields([bad]).join()).toMatch(/\(en\) : domaine hors \.test/);
  });

  it("rejects an English overlay that drops an item from the French one", () => {
    const en = base.translations!.en!;
    const bad = { ...base, translations: { en: { ...en, decisionChecklist: en.decisionChecklist!.slice(0, 2) } } };
    expect(auditDepthFields([bad]).join()).toMatch(/ne suit pas le français sur checklist \(3 ≠ 2\)/);
  });

  it("rejects a whyItWorks copied from howItWorks", () => {
    const bad = { ...base, whyItWorks: base.howItWorks.slice(0, 120) };
    expect(auditDepthFields([bad]).join()).toMatch(/recopie howItWorks/);
  });
});
