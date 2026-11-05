import { describe, expect, it, vi } from "vitest";
import {
  analyzeMessage,
  decodeSharedResult,
  encodeSharedResult,
  MAX_MESSAGE_LENGTH,
} from "./analyze";
import { SIGNALS } from "./signals";

vi.mock("server-only", () => ({}));

const { listAttacks } = await import("@/content/attacks");
const { findSimulationBySlug } = await import("@/content/simulations");
const { findSimulationEnBySlug } = await import("@/content/simulations-en");
const { listSignals } = await import("./signals");

function codes(text: string, channel?: Parameters<typeof analyzeMessage>[1]) {
  const result = analyzeMessage(text, channel);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe("analyzeMessage", () => {
  it("rejects empty and oversized input", () => {
    expect(analyzeMessage("   ")).toEqual({ ok: false, error: "empty" });
    expect(analyzeMessage("a".repeat(MAX_MESSAGE_LENGTH + 1))).toEqual({
      ok: false,
      error: "too-long",
    });
  });

  it("reads the fictional parcel text the way the fiche describes it", () => {
    const sim = findSimulationBySlug("sms-colis")!;
    const result = codes(sim.content.body, "sms");
    const found = result.signals.map((s) => s.code);
    expect(found).toEqual(expect.arrayContaining(["frais", "colis", "lien"]));
    expect(result.similarAttackCodes[0]).toBe("SOCIAL-000002");
    expect(result.links[0].analysis.registrableDomain).toBe(
      "example-not-real.test",
    );
  });

  it("recognises the relative-with-a-new-number scenario", () => {
    const result = codes(
      "Coucou maman, c'est moi, j'ai un nouveau numéro, mon téléphone est cassé. Tu peux me faire un virement ? N'en parle pas à papa.",
      "messaging",
    );
    const found = result.signals.map((s) => s.code);
    expect(found).toEqual(
      expect.arrayContaining(["proche", "paiement", "secret"]),
    );
    expect(result.similarAttackCodes[0]).toBe("SOCIAL-000005");
  });

  it("recognises a request for a one-time code", () => {
    const result = codes(
      "Pour bloquer la connexion frauduleuse, lisez-moi le code que vous venez de recevoir.",
    );
    expect(result.signals.map((s) => s.code)).toContain("code");
  });

  it("quotes excerpts exactly as typed, accents and case included", () => {
    const result = codes("Réglez IMMÉDIATEMENT les frais de réexpédition.");
    const urgence = result.signals.find((s) => s.code === "urgence")!;
    expect(urgence.excerpts).toEqual(["IMMÉDIATEMENT"]);
    const frais = result.signals.find((s) => s.code === "frais")!;
    expect(frais.excerpts).toEqual(["frais de réexpédition"]);
  });

  it("finds bare domains but not email addresses or amounts", () => {
    const result = codes(
      "Payez 1.95 sur amende-paiement.example-not-real.test/payer ou écrivez à contact@exemple.fr",
    );
    expect(result.links.map((l) => l.raw)).toEqual([
      "amende-paiement.example-not-real.test/payer",
    ]);
  });

  it("does not read words inside a link as part of the message", () => {
    const result = codes(
      "Bonjour, voici le lien : https://suivi.example-not-real.test/reglement-urgent",
    );
    expect(result.signals.map((s) => s.code)).toEqual(["lien"]);
  });

  it("points a link in a text message to smishing, elsewhere to phishing", () => {
    const text = "Voir https://suivi.example-not-real.test";
    expect(codes(text, "sms").similarAttackCodes).toContain("SMS-000001");
    expect(codes(text, "email").similarAttackCodes).toContain("PHISH-000001");
  });

  it("finds nothing in an ordinary message, and never claims it is safe", () => {
    const result = codes("Salut, on se retrouve à 19 h devant le cinéma ?");
    expect(result.signals).toEqual([]);
    expect(result.similarAttackCodes).toEqual([]);
    expect(JSON.stringify(result)).not.toMatch(/safe|sûr|fiable|legit/i);
  });

  it("recognises the procedures of every French SMS and email simulation it should", () => {
    // Each fictional message the site uses to teach a scam should trigger at
    // least one signal; if not, the analyzer misses a procedure the site
    // itself documents.
    for (const slug of [
      "sms-banque",
      "email-banque",
      "sms-amende-stationnement-impayee",
      "email-virement-urgent-direction",
      "email-changement-de-rib",
      "gain-loterie-frais-de-dossier",
    ]) {
      const sim = findSimulationBySlug(slug)!;
      const channel = sim.content.ui === "sms" ? "sms" : "email";
      expect(
        codes(sim.content.body, channel).signals.length,
        slug,
      ).toBeGreaterThan(0);
    }
  });
});

describe("similar attacks", () => {
  it("names the fiche each fictional message was written for, first", () => {
    // Regression floor: the site's own teaching messages, read back by the
    // analyzer, must point to the fiche they illustrate.
    for (const slug of [
      "sms-colis",
      "email-banque",
      "sms-banque",
      "gain-loterie-frais-de-dossier",
      "location-appartement-sans-visite",
      "message-proche-nouveau-numero",
      "placement-rendement-garanti",
      "sms-amende-stationnement-impayee",
      "code-a-usage-unique-demande",
      "email-virement-urgent-direction",
      "email-changement-de-rib",
    ]) {
      const sim = findSimulationBySlug(slug)!;
      const channel =
        sim.content.ui === "sms"
          ? "sms"
          : sim.content.ui === "email"
            ? "email"
            : "other";
      expect(codes(sim.content.body, channel).similarAttackCodes[0], slug).toBe(
        sim.attackCode,
      );
    }
  });
});

describe("signal catalogue", () => {
  it("only points to published fiches", () => {
    const published = new Set(listAttacks().map((a) => a.code));
    for (const signal of SIGNALS) {
      for (const code of signal.attackCodes)
        expect(published.has(code), `${signal.code} → ${code}`).toBe(true);
    }
  });

  it("has unique codes and an explanation for each", () => {
    expect(new Set(SIGNALS.map((s) => s.code)).size).toBe(SIGNALS.length);
    for (const s of SIGNALS)
      expect(s.explanation.length, s.code).toBeGreaterThan(80);
  });
});

describe("shared result", () => {
  it("carries signal codes only, and drops unknown ones", () => {
    const result = codes(
      "Urgent : payez les frais de livraison sur https://x.example-not-real.test",
    );
    const param = encodeSharedResult(result.signals);
    expect(param).not.toMatch(/example|payez|https/);
    expect(decodeSharedResult(param)).toEqual(
      result.signals.map((s) => s.code),
    );
    expect(decodeSharedResult("urgence,<script>,lien,urgence")).toEqual([
      "urgence",
      "lien",
    ]);
    expect(decodeSharedResult(null)).toEqual([]);
  });
});

describe("analyzeMessage in English", () => {
  const en = (text: string, channel?: Parameters<typeof analyzeMessage>[1]) => {
    const result = analyzeMessage(text, channel, "en");
    if (!result.ok) throw new Error(result.error);
    return result;
  };

  it("names the fiche each English fictional message was written for, first", () => {
    for (const slug of [
      "parcel-text-message",
      "bank-email",
      "bank-sms",
      "lottery-win-processing-fee",
      "relative-new-number-message",
      "guaranteed-return-investment",
      "unpaid-parking-fine-text",
      "one-time-code-request",
      "urgent-transfer-from-management",
      "supplier-bank-details-change",
      "domain-renewal-invoice",
      "sim-change-confirmation-text",
    ]) {
      const sim = findSimulationEnBySlug(slug)!;
      const channel =
        sim.content.ui === "sms"
          ? "sms"
          : sim.content.ui === "email"
            ? "email"
            : "other";
      expect(en(sim.content.body, channel).similarAttackCodes[0], slug).toBe(
        sim.attackCode,
      );
    }
  });

  it("reads « €1,480 » as a large sum, not as small fees", () => {
    expect(
      en("We are blocking a €1,480 transfer.").signals.map((s) => s.code),
    ).not.toContain("frais");
    expect(
      en("A redelivery fee of €1.95 is due.").signals.map((s) => s.code),
    ).toContain("frais");
  });

  it("finds nothing in an ordinary message", () => {
    expect(en("Hi! See you at 7 outside the cinema?").signals).toEqual([]);
  });

  it("explains every signal in English", () => {
    const fr = listSignals("fr");
    const english = listSignals("en");
    expect(english.map((s) => s.code)).toEqual(fr.map((s) => s.code));
    english.forEach((s, i) => {
      expect(s.label, s.code).not.toBe(fr[i].label);
      expect(s.explanation.length, s.code).toBeGreaterThan(80);
    });
  });
});
