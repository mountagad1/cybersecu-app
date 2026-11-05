import type { Locale } from "@/domain/i18n/locale";
import type { AttackCategory } from "@/domain/attack/categories";
import { findAttackByCode } from "./index";
import type { AttackDepth, AttackEntry, EditorialStatus } from "./types";
import type { AttackerObjective } from "./types";
import type { AttackVectorCode, CyberReflexDimensionCode } from "@/domain/scenario/types";

/**
 * A localized read of an `AttackEntry`. Reuses the same field names as
 * `AttackEntry` itself — code that already renders French content can
 * mostly be pointed at this instead without a rewrite — but is a
 * separate type: `relatedAttackCodes` here has been filtered to what
 * actually resolves in the requested locale, which `AttackEntry.
 * relatedAttackCodes` deliberately does not do (it is locale-invariant
 * source data, not a presentation projection).
 */
export interface LocalizedAttack extends AttackDepth {
  code: string;
  slug: string;
  name: string;
  categorySlug: string;
  editorialStatus: EditorialStatus;
  plainLanguageDefinition: string;
  attackerObjective: AttackerObjective;
  aliases?: string[];
  primaryVector: AttackVectorCode;
  primaryDimension: CyberReflexDimensionCode;
  simulationSlug?: string;
  noSimulationReason?: string;
  updatedAt: string;
  definition: string;
  howItWorks: string;
  warningSigns: string[];
  indicators: string[];
  howToVerify: string;
  whatToDo: string;
  whatToDoIfVictim: string;
  relatedAttackCodes: string[];
  faq: { question: string; answer: string }[];
  references: { label: string; url: string }[];
}

/**
 * `null` for `en` means exactly one thing: this attack has no English
 * translation yet. Callers must treat that as a real 404, not fall back
 * to French — see docs/decisions/0009-i18n-pilot.md §2.
 */
export function getLocalizedAttack(attack: AttackEntry, locale: Locale): LocalizedAttack | null {
  if (locale === "fr") {
    return {
      code: attack.code,
      slug: attack.slug,
      name: attack.name,
      categorySlug: attack.categorySlug,
      editorialStatus: attack.editorialStatus,
      plainLanguageDefinition: attack.plainLanguageDefinition,
      attackerObjective: attack.attackerObjective,
      aliases: attack.aliases,
      primaryVector: attack.primaryVector,
      primaryDimension: attack.primaryDimension,
      simulationSlug: attack.simulationSlug,
      noSimulationReason: attack.noSimulationReason,
      updatedAt: attack.updatedAt,
      definition: attack.definition,
      howItWorks: attack.howItWorks,
      warningSigns: attack.warningSigns,
      indicators: attack.indicators,
      howToVerify: attack.howToVerify,
      whatToDo: attack.whatToDo,
      whatToDoIfVictim: attack.whatToDoIfVictim,
      relatedAttackCodes: attack.relatedAttackCodes,
      faq: attack.faq,
      references: attack.references,
      whyItWorks: attack.whyItWorks,
      example: attack.example,
      decisionChecklist: attack.decisionChecklist,
      prevention: attack.prevention,
    };
  }

  const t = attack.translations?.en;
  if (!t) return null;

  return {
    code: attack.code,
    slug: t.slug,
    name: t.name,
    categorySlug: attack.categorySlug,
    editorialStatus: attack.editorialStatus,
    plainLanguageDefinition: t.plainLanguageDefinition,
    attackerObjective: attack.attackerObjective,
    aliases: t.aliases,
    primaryVector: attack.primaryVector,
    primaryDimension: attack.primaryDimension,
    simulationSlug: t.simulationSlug,
    noSimulationReason: t.noSimulationReason,
    updatedAt: attack.updatedAt,
    definition: t.definition,
    howItWorks: t.howItWorks,
    warningSigns: t.warningSigns,
    indicators: t.indicators ?? [],
    howToVerify: t.howToVerify,
    whatToDo: t.whatToDo,
    whatToDoIfVictim: t.whatToDoIfVictim,
    relatedAttackCodes: attack.relatedAttackCodes,
    faq: t.faq,
    references: t.references,
    whyItWorks: t.whyItWorks,
    example: t.example,
    decisionChecklist: t.decisionChecklist,
    prevention: t.prevention,
  };
}

export interface LocalizedCategory {
  slug: string;
  name: string;
  definition: string;
  whatUnitesThem: string;
}

export function getLocalizedCategory(category: AttackCategory, locale: Locale): LocalizedCategory | null {
  if (locale === "fr") {
    return { slug: category.slug, name: category.name, definition: category.definition, whatUnitesThem: category.whatUnitesThem };
  }
  const t = category.translations?.en;
  if (!t) return null;
  return { slug: t.slug, name: t.name, definition: t.definition, whatUnitesThem: t.whatUnitesThem };
}

/**
 * `relatedAttackCodes` resolved to entries that are actually reachable in
 * this locale. An English page must never link to a French-only fiche —
 * that is a dead end for a reader who does not read French, and a
 * hreflang-incoherent link for a crawler. Silently narrowing the list
 * (rather than showing a broken or mismatched link) is the same choice
 * `relatedAttacks()` in src/content/attacks/index.ts already makes for
 * the French catalogue's own dangling-code guarantee.
 */
export function localizedRelatedAttacks(attack: AttackEntry, locale: Locale): LocalizedAttack[] {
  return attack.relatedAttackCodes
    .map((code) => findAttackByCode(code))
    .filter((a): a is AttackEntry => a !== undefined)
    .map((a) => getLocalizedAttack(a, locale))
    .filter((a): a is LocalizedAttack => a !== null);
}
