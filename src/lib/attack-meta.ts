import type { Locale } from "@/domain/i18n/locale";
import { metaDescription } from "@/lib/meta";

/**
 * Search-result title and description of an attack fiche.
 *
 * Search Console (docs/growth/EXPERIMENT_LOG.md, cycles 3 and 5) shows the
 * fiches are found on « X definition » queries, at positions 3 to 7 with no
 * click, under titles that were the bare entity name (« Scareware |
 * cybersecu.app »). The title now says what the page answers — the
 * definition, the signs, what to do — which the fiche really contains.
 */

/** Page part of the title; the layout appends « | cybersecu.app » (16 characters). */
export const ATTACK_TITLE_MAX = 50;

const SUFFIXES: Record<Locale, readonly string[]> = {
  fr: [" : définition, signes et que faire", " : définition et que faire"],
  en: [": Definition, Signs and What to Do", ": Definition and What to Do"],
};

/** « Pretexting (fabricated scenario) » → « Pretexting ». */
function withoutGloss(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export function attackTitle(name: string, locale: Locale): string {
  const short = withoutGloss(name);
  const names = short !== name ? [name, short] : [name];
  for (const n of names) {
    for (const suffix of SUFFIXES[locale]) {
      const title = `${n}${suffix}`;
      if (title.length <= ATTACK_TITLE_MAX) return title;
    }
  }
  return name;
}

/** A hand-written description when the fiche has one, otherwise the definition, cut cleanly. */
export function attackDescription(definition: string, written?: string): string {
  return written ?? metaDescription(definition);
}

/**
 * Title of a family hub: the family and how many fiches it explains, both
 * read from the catalogue. A bare family name (« Ingénierie sociale ») said
 * nothing about what the page holds.
 */
export function categoryTitle(name: string, attackCount: number, locale: Locale): string {
  return locale === "fr" ? `${name} : ${attackCount} attaques expliquées` : `${name}: ${attackCount} attacks explained`;
}
