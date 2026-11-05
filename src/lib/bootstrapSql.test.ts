import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOOTSTRAP_FILES, renderBootstrap } from "../../scripts/generate-bootstrap-sql";

/**
 * `supabase/bootstrap.sql` est une copie concaténée des migrations et des
 * seeds. Une copie que rien ne compare à son original finit toujours par
 * diverger — et ici la divergence signifierait qu'un opérateur installe une
 * version du schéma qui n'est plus celle du dépôt.
 */
describe("bootstrap.sql", () => {
  it("reste identique à la concaténation des sources", () => {
    const committed = readFileSync(join(process.cwd(), "supabase/bootstrap.sql"), "utf8");
    expect(committed).toBe(renderBootstrap());
  });

  it("liste les migrations avant les seeds : le contenu dépend du schéma", () => {
    const firstSeed = BOOTSTRAP_FILES.findIndex((f) => f.startsWith("seed/"));
    const lastMigration = BOOTSTRAP_FILES.map((f) => f.startsWith("migrations/")).lastIndexOf(true);
    expect(lastMigration).toBeLessThan(firstSeed);
  });

  it("reste rejouable : aucune instruction DDL sans garde", () => {
    const sql = readFileSync(join(process.cwd(), "supabase/bootstrap.sql"), "utf8")
      .split("\n")
      .filter((l) => !l.trim().startsWith("--"))
      .join("\n");

    // `create table`/`create index` doivent porter `if not exists`, et chaque
    // `create trigger`/`create policy` être précédé de son `drop ... if exists`.
    const unguarded = [
      ...sql.matchAll(/create (table|index|unique index) (?!if not exists)([\w"]+)/g),
    ].map((m) => `${m[1]} ${m[2]}`);
    expect(unguarded).toEqual([]);

    const triggers = [...sql.matchAll(/^create trigger (\w+)/gm)].map((m) => m[1]);
    for (const name of triggers) {
      expect(sql).toContain(`drop trigger if exists ${name}`);
    }

    const policies = [...sql.matchAll(/^create policy (\w+) on (\w+)/gm)].map((m) => `${m[1]} on ${m[2]}`);
    for (const p of policies) {
      expect(sql).toContain(`drop policy if exists ${p}`);
    }
  });
});
