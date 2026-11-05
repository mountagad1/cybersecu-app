/**
 * Génère `supabase/bootstrap.sql` — les migrations et les seeds concaténés
 * dans l'ordre, en un seul fichier à coller dans l'éditeur SQL de Supabase.
 *
 * Run: `pnpm db:bootstrap`
 *
 * POURQUOI
 * Le README demande sept `psql` successifs, ce qui suppose `SUPABASE_DB_URL`
 * et un client local. L'éditeur SQL du dashboard ne demande ni l'un ni l'autre,
 * mais n'accepte qu'un seul bloc : d'où ce fichier.
 *
 * Il est GÉNÉRÉ, jamais édité à la main — c'est la même règle que
 * `.env.example`, et pour la même raison : deux copies d'une vérité finissent
 * toujours par diverger. Un test échoue si le fichier commité s'écarte de
 * cette sortie.
 *
 * Chaque fichier source est rejouable, donc ce bundle l'est aussi : il converge
 * vers l'état cible quel que soit l'état de départ, et ne détruit rien.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** L'ordre est significatif : le pivot dépend du schéma initial, les seeds du pivot. */
export const BOOTSTRAP_FILES = [
  "migrations/0001_init.sql",
  "migrations/0002_rls.sql",
  "migrations/0003_no_login_pivot.sql",
  "migrations/0004_scenario_content_integrity.sql",
  "seed/0001_taxonomy_and_content.sql",
  "seed/0002_attack_content.sql",
  "seed/0003_simulation_content.sql",
] as const;

export function renderBootstrap(root = process.cwd()): string {
  const header = [
    "-- =====================================================================",
    "-- cybersecu.app — installation complète du schéma et du contenu.",
    "--",
    "-- GÉNÉRÉ par `pnpm db:bootstrap`. Ne pas éditer à la main : modifiez le",
    "-- fichier source concerné dans supabase/, puis régénérez.",
    "--",
    "-- À coller tel quel dans l'éditeur SQL de Supabase, ou :",
    '--   psql "$SUPABASE_DB_URL" -f supabase/bootstrap.sql',
    "--",
    "-- REJOUABLE et NON DESTRUCTIF : chaque instruction est gardée. Sur une",
    "-- base vide il installe tout ; sur une base partielle il complète ce qui",
    "-- manque ; sur une base déjà à jour il ne change rien. Aucune donnée",
    "-- existante n'est supprimée.",
    "--",
    `-- Contenu : ${BOOTSTRAP_FILES.length} fichiers, dans cet ordre.`,
    ...BOOTSTRAP_FILES.map((f) => `--   - ${f}`),
    "-- =====================================================================",
    "",
  ].join("\n");

  const bodies = BOOTSTRAP_FILES.map((relative) => {
    const content = readFileSync(join(root, "supabase", relative), "utf8").trimEnd();
    return [
      "",
      "-- ---------------------------------------------------------------------",
      `-- ${relative}`,
      "-- ---------------------------------------------------------------------",
      content,
      "",
    ].join("\n");
  });

  return header + bodies.join("\n") + "\n";
}

if (process.argv[1]?.endsWith("generate-bootstrap-sql.ts")) {
  const target = join(process.cwd(), "supabase/bootstrap.sql");
  writeFileSync(target, renderBootstrap(), "utf8");
  console.log(`supabase/bootstrap.sql régénéré (${BOOTSTRAP_FILES.length} fichiers).`);
}
