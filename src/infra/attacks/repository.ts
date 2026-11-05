import "server-only";
import type { AttackDetail, AttackSummary } from "@/domain/attack/types";
import { findAttackBySlug, listAttacks } from "@/content/attacks";

/**
 * Reads of the attack encyclopedia.
 *
 * These used to query Supabase. They no longer do: the encyclopedia is
 * editorial content and now lives in the repository under
 * `src/content/attacks` (docs/decisions/0007-content-in-repository.md).
 * A deploy therefore publishes it, with no SQL step that can be skipped
 * and no configuration under which /attaques renders empty — which is
 * exactly the failure documented in docs/BLANK_PAGES_ROOT_CAUSE.md.
 *
 * The functions stay `async` so callers (Server Components, the sitemap)
 * keep their shape, and so a future move back to a CMS is a change here
 * rather than a change everywhere.
 */

export async function listPublishedAttacks(): Promise<AttackSummary[]> {
  return listAttacks().map((attack) => ({
    code: attack.code,
    slug: attack.slug,
    name: attack.name,
    primaryVector: attack.primaryVector,
    primaryDimension: attack.primaryDimension,
    publishedAt: attack.publishedAt,
  }));
}

export async function getPublishedAttackBySlug(slug: string): Promise<AttackDetail | null> {
  return findAttackBySlug(slug) ?? null;
}
