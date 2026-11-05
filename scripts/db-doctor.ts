/**
 * Read-only production diagnostics for the blank /attaques and /simulations
 * pages (docs/BLANK_PAGES_ROOT_CAUSE.md).
 *
 * Run:  pnpm db:doctor
 *
 * Reads `.env.local`, or whatever the shell already exports. Performs SELECTs
 * only — no writes, no DDL, no destructive statements.
 *
 * It queries with the ANON key on purpose: that is the identity a search
 * engine and a logged-out visitor actually use, so it reproduces what the
 * public sees rather than what an admin can see. A table that returns rows to
 * the service role but nothing to anon is an RLS problem, and this is how that
 * distinction becomes visible.
 */

import { createClient } from "@supabase/supabase-js";
import { missingRequired, reportEnv, requireEnv } from "../src/lib/env/read";

type Status = "ok" | "fail" | "skip";
type Check = { label: string; ok: boolean; detail: string };

const MARKER: Record<Status, string> = { ok: "✓", fail: "✗", skip: "·" };

const checks: Check[] = [];
/**
 * `skip` est un troisième état délibéré : une variable optionnelle absente
 * n'est ni un succès ni un échec, et l'afficher « ✓ absent » demandait au
 * lecteur de réconcilier une coche verte avec le mot « absent ».
 */
function record(label: string, status: Status | boolean, detail: string): void {
  const resolved: Status = typeof status === "boolean" ? (status ? "ok" : "fail") : status;
  checks.push({ label, ok: resolved !== "fail", detail });
  console.log(`  ${MARKER[resolved]} ${label.padEnd(38)} ${detail}`);
}

async function main(): Promise<void> {
  console.log("cybersecu.app — diagnostic base de données (lecture seule)");
  console.log("=========================================================\n");

  console.log("ENVIRONNEMENT");
  // Dérivé de src/lib/env/registry.ts : une variable ajoutée là-bas apparaît
  // ici sans modifier ce script, et les alias acceptés sont les mêmes que ceux
  // que l'application utilisera réellement.
  for (const entry of reportEnv()) {
    const status: Status =
      entry.present && !entry.valid ? "fail" : entry.present ? "ok" : entry.required ? "fail" : "skip";
    const detail = !entry.present
      ? entry.required
        ? "ABSENT (requis)"
        : "non configuré (optionnel)"
      : !entry.valid
        ? `INVALIDE — ${entry.problem}`
        : entry.usingLegacyAlias
          ? `défini via l'ancien nom ${entry.resolvedVia} — renommer en ${entry.name}`
          : "défini";
    record(entry.name, status, detail);
  }

  const blocking = missingRequired("public-read");
  if (blocking.length > 0) {
    console.log(
      `\n✗ ARRÊT : sans ${blocking.join(" et ")}, l'application lève une exception au rendu.`,
    );
    console.log(
      "  C'est une cause suffisante de page blanche. Renseignez ces variables",
      "\n  dans l'environnement de déploiement (Production ET Preview), puis REDÉPLOYEZ.",
    );
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_PUBLISHABLE_KEY"));

  console.log("\nSCHÉMA REQUIS POUR JOUER UNE SIMULATION (vu avec la clé publique)");

  // Only the per-visitor tables. The content tables are no longer read at
  // runtime: fiches d'attaques et simulations sont versionnées dans
  // src/content (docs/decisions/0007-content-in-repository.md), donc leur
  // état en base ne dit plus rien sur ce que le public voit.
  const tables = [
    "anonymous_sessions", // introduced by migration 0003
    "attempts",
    "attempt_decisions",
    "simulation_usage",
    "entitlements",
  ] as const;

  let missingTables = 0;
  let unreachable = 0;
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      const code = (error as { code?: string }).code;
      if (code === "42P01") {
        missingTables += 1;
        record(`table ${table}`, false, "ABSENTE — migration non appliquée");
      } else if (code === "42501") {
        // Attendu sur plusieurs de ces tables : la clé publique n'a pas de
        // policy de lecture sur les lignes d'autrui. La table existe, ce qui
        // est précisément ce que ce contrôle cherche à établir.
        record(`table ${table}`, "ok", "présente (lecture publique restreinte par RLS)");
      } else if (!code && !error.message) {
        // supabase-js reports an unreachable host as an error whose only
        // property is an empty `message`. Printed verbatim that produced
        // "erreur — " and, worse, fell through to the "aucun contenu publié"
        // diagnosis below: a database nobody could reach was reported as an
        // empty one.
        unreachable += 1;
        record(`table ${table}`, false, "HÔTE INJOIGNABLE — aucune réponse de Supabase");
      } else {
        record(`table ${table}`, false, `${code ?? "erreur"} — ${error.message || "(sans message)"}`);
      }
      continue;
    }
    record(`table ${table}`, true, `${count ?? 0} ligne(s) visibles`);
  }

  console.log("\nCONTENU");
  console.log("  · fiches d'attaques et simulations : versionnées dans src/content,");
  console.log("    livrées par le build. Indépendantes de cette base — `pnpm seo:audit`");
  console.log("    en donne l'inventaire.");

  console.log("\nDIAGNOSTIC");

  if (unreachable > 0) {
    console.log("  ✗ CAUSE : le projet Supabase ne répond pas.");
    console.log("    Rien ne peut être conclu sur le schéma ni sur le contenu tant que");
    console.log("    l'hôte est injoignable. Vérifiez, dans cet ordre :");
    console.log("      1. SUPABASE_URL pointe bien sur le projet attendu ;");
    console.log("      2. le projet n'est pas en pause dans le tableau de bord Supabase ;");
    console.log("      3. le réseau sortant de cet environnement autorise *.supabase.co.");
    process.exitCode = 1;
    return;
  }

  if (missingTables > 0) {
    console.log("  ✗ CAUSE : le schéma n'est pas (entièrement) appliqué.");
    console.log("    Les pages de contenu s'affichent quand même ; c'est le jeu d'une");
    console.log("    simulation (tentative, quota, droits) qui est impossible.");
    console.log("    Appliquez supabase/bootstrap.sql, ou dans l'ordre :");
    console.log("      psql \"$SUPABASE_DB_URL\" -f supabase/migrations/0001_init.sql");
    console.log("      psql \"$SUPABASE_DB_URL\" -f supabase/migrations/0002_rls.sql");
    console.log("      psql \"$SUPABASE_DB_URL\" -f supabase/migrations/0003_no_login_pivot.sql");
    console.log("      psql \"$SUPABASE_DB_URL\" -f supabase/migrations/0004_scenario_content_integrity.sql");
    console.log("      psql \"$SUPABASE_DB_URL\" -f supabase/migrations/0005_content_moves_to_repository.sql");
    process.exitCode = 1;
    return;
  }

  const failures = checks.filter((c) => !c.ok);
  if (failures.length > 0) {
    console.log("  ✗ Anomalies détectées :");
    for (const failure of failures) console.log(`    - ${failure.label} : ${failure.detail}`);
    process.exitCode = 1;
    return;
  }

  console.log("  ✓ Base joignable et schéma présent : les simulations peuvent être jouées.");
  console.log("    Les pages de contenu ne dépendent pas de ce résultat.");
}

main().catch((error) => {
  console.error("\n✗ Diagnostic interrompu :", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
