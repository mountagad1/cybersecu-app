import { findAttackByCode, type AttackEntry } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import type { Locale } from "@/domain/i18n/locale";
import type { TargetProfile } from "@/domain/scenario/types";

/**
 * Printable checklists by audience (A4, docs/growth/ENGINEERING_AS_MARKETING_ROADMAP.md
 * étape 5): a family, an older relative, a small business.
 *
 * NO NEW ADVICE. Each item is a reference to a fiche's `prevention` entry —
 * the sentence is read from the fiche, in French or from its English
 * overlay, and links back to it. What the audience page adds is the
 * selection and the order: the habits that concern that audience, grouped
 * by situation, on one page that can be printed and handed over.
 *
 * The matrix condition (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv, candidate
 * A4) is enforced by `auditAudiences`: no item appears on two checklists,
 * so the three pages never share their text.
 */

export type AudienceCode = "famille" | "seniors" | "petite-entreprise";

export interface AudienceItemRef {
  attackCode: string;
  /** Index in the fiche's `prevention` list (same index in its translation). */
  prevention: number;
}

export interface AudienceSection {
  id: string;
  title: Record<Locale, string>;
  items: AudienceItemRef[];
}

export interface AudienceEntry {
  code: AudienceCode;
  /** French tool slug, under /outils. */
  slug: string;
  /** English tool slug, under /en/tools. */
  enSlug: string;
  /**
   * The simulations written for this audience (`targetProfile`), when there
   * are any. Without one, the page shows the simulations of the fiches its
   * checklist cites.
   */
  profile?: TargetProfile;
  /** Short name, used in the other pages' links (« pour un parent âgé »). */
  name: Record<Locale, string>;
  title: Record<Locale, string>;
  h1: Record<Locale, string>;
  description: Record<Locale, string>;
  intro: Record<Locale, string>;
  sections: AudienceSection[];
}

const ref = (attackCode: string, prevention: number): AudienceItemRef => ({
  attackCode,
  prevention,
});

const ALL_AUDIENCES: readonly AudienceEntry[] = [
  {
    code: "seniors",
    slug: "checklist-seniors",
    enSlug: "seniors-checklist",
    profile: "senior",
    name: { fr: "pour un parent âgé", en: "for an older relative" },
    title: {
      fr: "Checklist seniors : les réflexes contre les arnaques, à imprimer",
      en: "Seniors checklist: the reflexes against scams, to print",
    },
    h1: {
      fr: "Les réflexes à garder près du téléphone",
      en: "The reflexes to keep next to the phone",
    },
    description: {
      fr: "Faux conseiller bancaire, faux support technique, faux gain, SMS surtaxé : les réflexes qui protègent, sur une page à imprimer et à donner à un parent.",
      en: "Fake bank advisor, fake tech support, fake prize, premium-rate text: the reflexes that protect, on one page to print and give to a relative.",
    },
    intro: {
      fr: "Chaque réflexe de cette page est repris, mot pour mot, d'une fiche de l'encyclopédie : celles des arnaques par téléphone, par ordinateur et par courrier que nos simulations « seniors » mettent en scène. Imprimez-la, cochez ce qui est déjà en place, et gardez-la près du téléphone.",
      en: "Each reflex on this page is taken word for word from an article in the encyclopedia: those on the phone, computer and mail scams our “seniors” simulations stage. Print it, tick what is already in place, and keep it next to the phone.",
    },
    sections: [
      {
        id: "telephone",
        title: { fr: "Au téléphone", en: "On the phone" },
        items: [
          ref("SOCIAL-000006", 0),
          ref("SOCIAL-000001", 0),
          ref("SOCIAL-000001", 2),
          ref("SOCIAL-000010", 1),
          ref("AI-000002", 0),
        ],
      },
      {
        id: "ordinateur",
        title: { fr: "Devant l'ordinateur", en: "At the computer" },
        items: [
          ref("SOCIAL-000003", 0),
          ref("SOCIAL-000003", 1),
          ref("SOCIAL-000003", 2),
          ref("MAL-000010", 0),
          ref("MAL-000010", 1),
        ],
      },
      {
        id: "gains-et-courrier",
        title: { fr: "Gains, SMS et courrier", en: "Prizes, texts and mail" },
        items: [
          ref("PAYMENT-000006", 0),
          ref("PAYMENT-000006", 1),
          ref("PAYMENT-000006", 2),
          ref("MOB-000006", 0),
          ref("MOB-000006", 2),
          ref("SOCIAL-000010", 2),
        ],
      },
    ],
  },
  {
    code: "famille",
    slug: "checklist-famille",
    enSlug: "family-checklist",
    name: { fr: "pour votre famille", en: "for your family" },
    title: {
      fr: "Checklist famille : les règles à convenir contre les arnaques, à imprimer",
      en: "Family checklist: the rules to agree on against scams, to print",
    },
    h1: {
      fr: "Les règles à convenir en famille",
      en: "The rules to agree on as a family",
    },
    description: {
      fr: "Un mot de passe familial, un nouveau numéro qui se confirme à l'ancien, en parler sans attendre : les règles qui protègent une famille, sur une page à imprimer.",
      en: "A family password, a new number confirmed on the old one, talking about it right away: the rules that protect a family, on one page to print.",
    },
    intro: {
      fr: "Plusieurs arnaques reposent sur un proche qu'on imite ou sur quelqu'un qu'on isole. Les fiches de l'encyclopédie y répondent par des règles à convenir ensemble : elles sont réunies ici, mot pour mot, avec un lien vers la fiche d'où chacune vient. À imprimer et à relire ensemble.",
      en: "Several scams rely on imitating someone close or on isolating someone. The encyclopedia's articles answer them with rules to agree on together: they are gathered here, word for word, with a link to the article each comes from. To print and read through together.",
    },
    sections: [
      {
        id: "regles",
        title: {
          fr: "Des règles convenues ensemble",
          en: "Rules agreed on together",
        },
        items: [
          ref("SOCIAL-000005", 0),
          ref("SOCIAL-000005", 1),
          ref("SOCIAL-000009", 2),
          ref("AI-000002", 2),
        ],
      },
      {
        id: "en-parler",
        title: {
          fr: "En parler, sans attendre",
          en: "Talk about it, right away",
        },
        items: [
          ref("SOCIAL-000004", 0),
          ref("PAYMENT-000003", 2),
          ref("AI-000009", 2),
          ref("PERS-000001", 2),
          ref("PERS-000006", 2),
        ],
      },
      {
        id: "en-ligne",
        title: {
          fr: "Ce que l'on montre en ligne",
          en: "What you show online",
        },
        items: [
          ref("DATA-000003", 1),
          ref("PERS-000007", 0),
          ref("AI-000009", 0),
        ],
      },
      {
        id: "quand-ca-arrive",
        title: {
          fr: "Quand ça arrive à l'un de vous",
          en: "When it happens to one of you",
        },
        items: [ref("SOCIAL-000005", 2), ref("PERS-000006", 1)],
      },
    ],
  },
  {
    code: "petite-entreprise",
    slug: "checklist-petite-entreprise",
    enSlug: "small-business-checklist",
    profile: "business",
    name: { fr: "pour une petite entreprise", en: "for a small business" },
    title: {
      fr: "Checklist petite entreprise : virements, factures, équipe, à imprimer",
      en: "Small business checklist: transfers, invoices, team, to print",
    },
    h1: {
      fr: "Les procédures qui protègent une petite entreprise",
      en: "The procedures that protect a small business",
    },
    description: {
      fr: "Double validation des virements, changement d'IBAN confirmé au numéro connu, factures sans bon de commande : les procédures d'une TPE, à imprimer.",
      en: "Dual approval for transfers, IBAN changes confirmed on the known number, invoices without a purchase order: a small business's procedures, to print.",
    },
    intro: {
      fr: "Faux ordre de virement, changement de RIB, fausse facture : les fiches de l'encyclopédie et nos simulations « entreprise » y répondent d'abord par des procédures. Les voici, reprises mot pour mot, avec un lien vers la fiche d'où chacune vient. À imprimer et à afficher près de ceux qui paient.",
      en: "CEO fraud, bank details change, fake invoice: the encyclopedia's articles and our “business” simulations answer them first with procedures. Here they are, word for word, with a link to the article each comes from. To print and post near the people who make payments.",
    },
    sections: [
      {
        id: "virements",
        title: {
          fr: "Virements et coordonnées bancaires",
          en: "Transfers and bank details",
        },
        items: [
          ref("PAYMENT-000002", 0),
          ref("PAYMENT-000002", 1),
          ref("PAYMENT-000004", 0),
          ref("PAYMENT-000004", 1),
          ref("AI-000008", 0),
          ref("AI-000008", 2),
        ],
      },
      {
        id: "factures",
        title: { fr: "Factures et fournisseurs", en: "Invoices and suppliers" },
        items: [
          ref("PAYMENT-000005", 0),
          ref("PAYMENT-000005", 1),
          ref("PAYMENT-000005", 2),
          ref("PAYMENT-000004", 2),
        ],
      },
      {
        id: "equipe",
        title: { fr: "L'équipe", en: "The team" },
        items: [
          ref("SOCIAL-000007", 0),
          ref("SOCIAL-000007", 1),
          ref("SOCIAL-000007", 2),
          ref("PAYMENT-000002", 2),
        ],
      },
      {
        id: "postes",
        title: {
          fr: "Postes, logiciels et sauvegardes",
          en: "Computers, software and backups",
        },
        items: [
          ref("MAL-000001", 0),
          ref("MAL-000001", 1),
          ref("SOCIAL-000008", 0),
          ref("WEB-000003", 0),
          ref("WEB-000003", 1),
        ],
      },
    ],
  },
];

/** The sentence an item refers to, in one language — null if it does not resolve. */
export function audienceItemText(
  item: AudienceItemRef,
  locale: Locale,
): string | null {
  const attack = findAttackByCode(item.attackCode);
  if (!attack) return null;
  const list =
    locale === "fr"
      ? attack.prevention
      : getLocalizedAttack(attack, locale)?.prevention;
  return list?.[item.prevention] ?? null;
}

export function auditAudiences(audiences: readonly AudienceEntry[]): string[] {
  const problems: string[] = [];
  const owner = new Map<string, AudienceCode>();
  for (const audience of audiences) {
    for (const section of audience.sections) {
      for (const item of section.items) {
        const key = `${item.attackCode}#${item.prevention}`;
        for (const locale of ["fr", "en"] as const) {
          if (!audienceItemText(item, locale))
            problems.push(`${audience.code} : ${key} introuvable (${locale})`);
        }
        const previous = owner.get(key);
        if (previous)
          problems.push(
            `${key} figure sur deux checklists : ${previous} et ${audience.code}`,
          );
        owner.set(key, audience.code);
      }
    }
  }
  return problems;
}

const problems = auditAudiences(ALL_AUDIENCES);
if (problems.length > 0) {
  throw new Error(
    `Checklists par public invalides :\n  - ${problems.join("\n  - ")}`,
  );
}

export function listAudiences(): AudienceEntry[] {
  return [...ALL_AUDIENCES];
}

export function findAudience(code: AudienceCode): AudienceEntry {
  return ALL_AUDIENCES.find((a) => a.code === code)!;
}

export function findAudienceBySlug(
  slug: string,
  locale: Locale,
): AudienceEntry | undefined {
  return ALL_AUDIENCES.find(
    (a) => (locale === "fr" ? a.slug : a.enSlug) === slug,
  );
}

export function audiencePath(audience: AudienceEntry, locale: Locale): string {
  return locale === "fr"
    ? `/outils/${audience.slug}`
    : `/en/tools/${audience.enSlug}`;
}

/** The fiches a checklist cites, in the order they first appear. */
export function audienceAttacks(audience: AudienceEntry): AttackEntry[] {
  const codes = [
    ...new Set(
      audience.sections.flatMap((s) => s.items.map((i) => i.attackCode)),
    ),
  ];
  return codes
    .map((c) => findAttackByCode(c))
    .filter((a): a is AttackEntry => a !== undefined);
}
