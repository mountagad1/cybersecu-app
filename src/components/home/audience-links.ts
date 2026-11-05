import type { Locale } from "@/domain/i18n/locale";

/**
 * Where each « Pour qui ? » card of the homepage leads: the printable
 * checklist for that audience (src/content/audiences). Kept out of the
 * client component so a test can check every target is a registered page.
 * Cards with no checklist of their own get no link rather than a loose one,
 * and no two cards point to the same page.
 */
export const AUDIENCE_LINKS: Record<
  Locale,
  Partial<Record<string, { href: string; label: string }>>
> = {
  fr: {
    Seniors: {
      href: "/outils/checklist-seniors",
      label: "Les réflexes à garder près du téléphone",
    },
    "TPE / PME": {
      href: "/outils/checklist-petite-entreprise",
      label: "La checklist petite entreprise, à imprimer",
    },
    "Particuliers & familles": {
      href: "/outils/checklist-famille",
      label: "Les règles à convenir en famille",
    },
  },
  en: {
    Seniors: {
      href: "/en/tools/seniors-checklist",
      label: "The reflexes to keep next to the phone",
    },
    "Small businesses": {
      href: "/en/tools/small-business-checklist",
      label: "The small business checklist, to print",
    },
    "Individuals & families": {
      href: "/en/tools/family-checklist",
      label: "The rules to agree on as a family",
    },
  },
};
