import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Static guarantees of the password generator, checked on the source so a
 * regression fails `pnpm test` before any build
 * (docs/security/PASSWORD_GENERATOR_THREAT_MODEL.md §5). The browser test
 * (docs/security/PASSWORD_GENERATOR_REVIEW_REPORT.md) checks the same
 * properties at run time.
 */

const ROOT = process.cwd();
const DOMAIN = "src/domain/password";

/** Every file a password goes through, tests excluded. */
const FILES = [
  ...readdirSync(join(ROOT, DOMAIN))
    .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
    .map((f) => `${DOMAIN}/${f}`),
  "src/lib/clipboard.ts",
  "src/components/tools/password-generator.tsx",
  "src/components/tools/password-generator-page.tsx",
  "src/content/tools/password-generator.ts",
  "src/app/(marketing)/outils/generateur-mot-de-passe/page.tsx",
  "src/app/en/tools/password-generator/page.tsx",
];

/** Source without comments, so the doc comments that name what is forbidden do not trip the checks. */
function code(path: string): string {
  return readFileSync(join(ROOT, path), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

const sources = FILES.map((path) => ({ path, src: code(path) }));

function offenders(pattern: RegExp, only?: (path: string) => boolean): string[] {
  return sources.filter(({ path, src }) => (!only || only(path)) && pattern.test(src)).map(({ path }) => path);
}

/** Generator code, not the page text that explains it (which names Math.random to say it is not used). */
const isCode = (path: string) => path !== "src/content/tools/password-generator.ts";

describe("password generator — static security checks", () => {
  it("reads every file it claims to check", () => {
    expect(sources.length).toBeGreaterThanOrEqual(13);
    for (const { src } of sources) expect(src.length).toBeGreaterThan(0);
  });

  it("never uses Math.random, Date or performance as a source of randomness", () => {
    expect(offenders(/Math\.random|Date\.now|new Date|performance\.now/, isCode)).toEqual([]);
  });

  it("draws only from crypto.getRandomValues", () => {
    const random = sources.find((s) => s.path.endsWith("random.ts"))!.src;
    expect(random).toMatch(/crypto\.getRandomValues/);
    expect(offenders(/getRandomValues/, isCode)).toEqual([`${DOMAIN}/random.ts`]);
    expect(offenders(/crypto\.randomUUID|crypto\.subtle/)).toEqual([]);
  });

  it("makes no network request", () => {
    expect(offenders(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share/)).toEqual([]);
  });

  it("stores nothing in the browser", () => {
    expect(offenders(/localStorage|sessionStorage|indexedDB|document\.cookie|caches\.|cookieStore/)).toEqual([]);
  });

  it("puts nothing in the URL or the history", () => {
    expect(offenders(/useSearchParams|useRouter|history\.(push|replace)State|location\.(href|hash|search)\s*=|searchParams/)).toEqual([]);
  });

  it("logs nothing", () => {
    expect(offenders(/console\./)).toEqual([]);
  });

  it("only copies from a click, never on its own", () => {
    const ui = sources.find((s) => s.path.endsWith("password-generator.tsx"))!.src;
    // copyText is called in exactly one place, the click handler.
    expect(ui.match(/copyText\(/g)).toHaveLength(1);
    expect(ui).toMatch(/async function onCopy\([^)]*\)\s*\{[^}]*copyText\(value\)/);
    expect(ui.match(/onCopy\(/g)?.length).toBe(2); // the definition and the button's onClick
    expect(ui).toMatch(/onClick=\{\(\) => void onCopy\(/);
    expect(offenders(/clipboard\.write(?!Text)|execCommand/)).toEqual([]);
  });

  it("sends analytics events with codes only, never a password or a setting", () => {
    const ui = sources.find((s) => s.path.endsWith("password-generator.tsx"))!.src;
    expect(ui).not.toMatch(/trackEvent/);
    // Errors are measured by kind only.
    expect([...ui.matchAll(/tracking\.error\(([^)]*)\)/g)].map((m) => m[1]).every((arg) => /^("[a-z_]+"|random \? "random_unavailable" : "other")$/.test(arg))).toBe(true);
    // The only tracking is the shared hook, whose events carry the tool slug and the language.
    expect(ui).toMatch(/useToolTracking\("generateur-mot-de-passe", locale\)/);
    const hook = code("src/lib/use-tool-tracking.ts");
    expect(hook).toMatch(/props: \{ tool, locale \}/);
    expect(hook).toMatch(/props: \{\s*tool,\s*locale,\s*action: "result"\s*\}/);
  });

  it("keeps the result out of translation services and the screen-reader announcement", () => {
    const ui = sources.find((s) => s.path.endsWith("password-generator.tsx"))!.src;
    expect(ui).toMatch(/<span\s+translate="no"\s+data-value/);
    // Not <output>: its implicit role « status » is a live region that could read the value aloud.
    expect(ui).not.toMatch(/<output\b/);
    // The live region announces a count, never the values.
    expect(ui).toMatch(/const message = t\.announced\(result\.values\.length\)/);
    expect(ui.match(/setAnnouncement\(/g)).toHaveLength(2); // the reset to "" and the delayed message
    expect(ui).toMatch(/setAnnouncement\(""\)/);
  });

  it("generates nothing during the server render", () => {
    const pages = sources.filter((s) => /page\.tsx$/.test(s.path));
    for (const { src } of pages) expect(src).not.toMatch(/generateCandidates|generatePassword|generatePassphrase/);
    const ui = sources.find((s) => s.path.endsWith("password-generator.tsx"))!.src;
    expect(ui.startsWith('"use client"') || ui.trimStart().startsWith('"use client"')).toBe(true);
    // The initial view is « loading »: the static HTML holds no password.
    expect(ui).toMatch(/useState<View>\(\{ state: "loading" \}\)/);
  });
});
