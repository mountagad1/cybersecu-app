/**
 * Checks that the official pages the site cites, and the ones the source audit
 * still has to open, actually answer.
 *
 * Run: `pnpm sources:check`, or `pnpm sources:check --write` to save the
 * report under docs/audits/.
 *
 * It answers a narrow question — does this URL respond, and where does it
 * land? — so that a person (or Claude Code on a machine with network access)
 * can then read the pages listed in docs/audits/remaining-verification.md.
 * It does not judge content: an answering page is "reachable", never
 * "confirmed".
 *
 * A failure to connect is reported as INACCESSIBLE, not as a broken link: a
 * blocked network (proxy, sandbox) says nothing about the site. Exits non-zero
 * only when a cited link is reachable-but-broken (4xx/5xx from the site
 * itself), which is the one result worth gating on.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");
const TIMEOUT_MS = 15_000;

/** Official or reference domains whose links the audit covers. */
const OFFICIAL = /^https:\/\/([a-z0-9-]+\.)*(gouv\.fr|cnil\.fr|33700\.fr|signal-spam\.fr|3018\.fr|e-enfance\.org|solidaritefemmes\.org|france-victimes\.fr|justice\.fr|urgence114\.fr|unicode\.org)(\/|$)/i;

/**
 * Pages docs/audits/remaining-verification.md asks to open, not yet cited by
 * the site. Entry points only: the reader follows the site's own navigation
 * from there, rather than trusting a deep link nobody has verified.
 */
const TO_VERIFY: { url: string; why: string }[] = [
  { url: "https://www.3018.fr/", why: "Priorité 1 — public adulte du 3018" },
  { url: "https://e-enfance.org/", why: "Priorité 1 — opérateur du 3018" },
  { url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/arnaques-au-faux-support-technique", why: "Priorité 2 — URL candidate du faux support technique" },
  { url: "https://www.legifrance.gouv.fr/", why: "Priorités 3, 4, 9 — L223-1 C. conso, 223-1-1, 226-2-1, 226-8, 226-8-1, 222-33-2-2 C. pénal" },
  { url: "https://www.17cyber.gouv.fr/", why: "Priorité 5 — 17Cyber" },
  { url: "https://www.service-public.gouv.fr/", why: "Priorité 6 — plainte en ligne, THESEE, Perceval" },
  { url: "https://www.justice.fr/", why: "Priorité 7 — 116 006, Info Escroqueries" },
  { url: "https://www.signal-spam.fr/", why: "Priorité 8 — Signal Spam" },
  { url: "https://www.33700.fr/", why: "Priorité 10 — 33700" },
  { url: "https://arretonslesviolences.gouv.fr/", why: "Priorité 10 — 3919" },
  { url: "https://www.info.urgence114.fr/", why: "Priorité 10 — 114" },
];

type Status = "OK" | "REDIRECTION" | "CASSÉ" | "INACCESSIBLE";
interface Result {
  url: string;
  status: Status;
  detail: string;
  finalUrl?: string;
  context: string;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path);
  }
  return out;
}

/** Every official URL cited in src/, with the files citing it. */
function citedUrls(): Map<string, Set<string>> {
  const cited = new Map<string, Set<string>>();
  for (const file of walk(join(ROOT, "src"))) {
    for (const match of readFileSync(file, "utf8").matchAll(/https:\/\/[^\s"'`)<>]+/g)) {
      const url = match[0].replace(/[.,;]+$/, "");
      if (!OFFICIAL.test(url)) continue;
      if (!cited.has(url)) cited.set(url, new Set());
      cited.get(url)!.add(relative(ROOT, file));
    }
  }
  return cited;
}

async function check(url: string, context: string): Promise<Result> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // GET, not HEAD: several public sites answer HEAD with 403/405.
    const res = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "cybersecu.app source check" } });
    const finalUrl = res.url !== url ? res.url : undefined;
    if (res.status >= 400) return { url, status: "CASSÉ", detail: `HTTP ${res.status}`, finalUrl, context };
    return { url, status: finalUrl ? "REDIRECTION" : "OK", detail: `HTTP ${res.status}`, finalUrl, context };
  } catch (error) {
    const cause = (error as { cause?: { code?: string; message?: string } }).cause;
    const reason = cause?.code ?? cause?.message ?? (error as Error).message;
    return { url, status: "INACCESSIBLE", detail: String(reason), context };
  } finally {
    clearTimeout(timer);
  }
}

function report(cited: Result[], toVerify: Result[], date: string): string {
  const row = (r: Result) =>
    `| ${r.url} | ${r.status} | ${r.detail}${r.finalUrl ? ` → ${r.finalUrl}` : ""} | ${r.context} |`;
  const count = (rs: Result[], s: Status) => rs.filter((r) => r.status === s).length;
  const all = [...cited, ...toVerify];
  return [
    `# Vérification d'accès aux sources officielles — ${date}`,
    "",
    "Généré par `pnpm sources:check`. « OK » signifie que la page répond, pas que son contenu a été relu :",
    "la relecture suit `docs/audits/remaining-verification.md`.",
    "",
    `OK ${count(all, "OK")} · redirection ${count(all, "REDIRECTION")} · cassé ${count(all, "CASSÉ")} · inaccessible ${count(all, "INACCESSIBLE")}`,
    "",
    "## Liens cités par le site",
    "",
    "| URL | Statut | Détail | Cité dans |",
    "| --- | --- | --- | --- |",
    ...cited.map(row),
    "",
    "## Pages à ouvrir pour l'audit",
    "",
    "| URL | Statut | Détail | Pourquoi |",
    "| --- | --- | --- | --- |",
    ...toVerify.map(row),
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  const cited = citedUrls();
  const citedResults = await Promise.all(
    [...cited].sort(([a], [b]) => a.localeCompare(b)).map(([url, files]) => check(url, [...files].join(", "))),
  );
  const verifyResults = await Promise.all(TO_VERIFY.map((t) => check(t.url, t.why)));
  const md = report(citedResults, verifyResults, date);

  if (process.argv.includes("--write")) {
    const path = join(ROOT, "docs/audits", `source-check-${date}.md`);
    writeFileSync(path, md);
    console.log(`Rapport écrit : ${relative(ROOT, path)}`);
  } else {
    console.log(md);
  }

  const all = [...citedResults, ...verifyResults];
  if (all.every((r) => r.status === "INACCESSIBLE")) {
    console.warn("\nAucune page n'a répondu : le réseau est probablement bloqué (proxy, sandbox). Rien n'a été vérifié.");
  }
  const broken = citedResults.filter((r) => r.status === "CASSÉ");
  if (broken.length > 0) {
    console.error(`\n${broken.length} lien(s) cité(s) par le site répondent en erreur.`);
    process.exit(1);
  }
}

void main();
