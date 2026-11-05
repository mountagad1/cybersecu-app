/**
 * Génère `.env.example` depuis `src/lib/env/registry.ts`.
 *
 * Run: `pnpm env:example`
 *
 * POURQUOI GÉNÉRER PLUTÔT QU'ÉCRIRE À LA MAIN
 * `.env.example` est le seul document qu'un opérateur lit avant de configurer
 * un environnement. Maintenu à la main, il avait divergé du code dans les deux
 * sens : quatre alias acceptés n'y figuraient pas, et quatre variables y
 * figuraient sans être lues nulle part. Généré, il ne peut plus mentir, et
 * `registry.test.ts` échoue si le fichier commité s'écarte de cette sortie.
 *
 * Aucune valeur secrète n'est jamais écrite : `example` est `null` pour toute
 * variable sensible, et le champ reste vide.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ENV_REGISTRY, type EnvGroup } from "../src/lib/env/registry";

const GROUP_TITLES: Record<EnvGroup, string> = {
  "public-read": "LECTURES PUBLIQUES — requis pour que le site rende quoi que ce soit",
  "write-path": "ÉCRITURES — requis pour jouer une simulation (les lectures marchent sans)",
  payments: "PAIEMENT — sans ces variables, /api/checkout répond 503",
  email: "EMAIL — restauration d'accès uniquement",
  voice: "SIMULATIONS VOCALES — optionnel, dégrade vers la simulation texte (docs/decisions/0008)",
  tooling: "OUTILLAGE — migrations et seeds, jamais lu par l'application au runtime",
};

const ORDER: EnvGroup[] = ["public-read", "write-path", "payments", "email", "voice", "tooling"];

function wrap(text: string, width = 74): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line += " " + word;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export function renderEnvExample(): string {
  const out: string[] = [
    "# Généré par `pnpm env:example` depuis src/lib/env/registry.ts.",
    "# Ne pas éditer à la main : modifiez le registre, puis régénérez.",
    "#",
    "# Chaque variable a UN nom canonique. Les alias listés restent acceptés pour",
    "# ne pas casser un environnement déjà déployé ; un nouvel environnement ne",
    "# doit définir que le nom canonique.",
    "#",
    "# Aucune de ces variables n'est préfixée NEXT_PUBLIC_ : elles sont lues côté",
    "# serveur uniquement, donc aucune valeur n'atteint le bundle navigateur.",
  ];

  for (const group of ORDER) {
    const specs = ENV_REGISTRY.filter((s) => s.group === group);
    if (specs.length === 0) continue;

    out.push("", "# " + "=".repeat(74), `# ${GROUP_TITLES[group]}`, "# " + "=".repeat(74));

    for (const spec of specs) {
      out.push("");
      for (const line of wrap(spec.description)) out.push(`# ${line}`);
      if (spec.aliases.length > 0) {
        for (const line of wrap(`Alias acceptés (hérités) : ${spec.aliases.join(", ")}`)) {
          out.push(`# ${line}`);
        }
      }
      if (spec.secret) out.push("# SECRET — ne jamais committer de valeur réelle.");
      out.push(`# ${spec.required ? "REQUIS" : "Optionnel"}`);
      out.push(`${spec.name}=${spec.example ?? ""}`);
    }
  }

  return out.join("\n") + "\n";
}

if (process.argv[1]?.endsWith("generate-env-example.ts")) {
  const target = join(process.cwd(), ".env.example");
  writeFileSync(target, renderEnvExample(), "utf8");
  console.log(`.env.example régénéré depuis le registre (${ENV_REGISTRY.length} variables).`);
}
