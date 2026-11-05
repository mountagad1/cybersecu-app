import "server-only";
import { requireEnv } from "@/lib/env/read";

/**
 * Accesseurs Supabase, façade fine sur `src/lib/env/registry.ts`.
 *
 * Ce module ne lit plus `process.env` lui-même : les noms canoniques, leurs
 * alias hérités et l'ordre de priorité sont déclarés une seule fois dans le
 * registre, et `requireEnv()` produit une erreur qui nomme toutes les
 * orthographes acceptées. C'est ce qui manquait à l'incident de production :
 * « Missing SUPABASE_URL » sur un projet dont la clé était définie sous un
 * autre nom que le code acceptait pourtant.
 *
 * SUR LE PRÉFIXE NEXT_PUBLIC_
 * Le registre accepte encore les orthographes `NEXT_PUBLIC_*` en repli, mais
 * `read.ts` y accède dynamiquement (`process.env[nom]`). Next n'inline
 * statiquement que les accès littéraux, donc plus aucune valeur Supabase n'est
 * figée dans un bundle au moment du build — vérifié par expérience : un build
 * dont l'environnement ne définit que les noms canoniques ne laisse aucune
 * valeur dans `.next/static`.
 *
 * La garde `server-only` reste : elle transforme en erreur de build tout import
 * accidentel depuis un composant client, ce qui est la seule protection qui ne
 * dépend pas d'une convention.
 */

export function getSupabaseUrl(): string {
  return requireEnv("SUPABASE_URL");
}

/** Clé liée aux policies RLS, pour toute lecture publique. */
export function getSupabaseAnonKey(): string {
  return requireEnv("SUPABASE_PUBLISHABLE_KEY");
}

/** Contourne RLS. Serveur uniquement — jamais importé depuis un composant client. */
export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}
