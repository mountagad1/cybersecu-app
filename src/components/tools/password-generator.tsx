"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CHARACTER_CLASSES, type CharacterClass } from "@/domain/password/alphabet";
import { generateCandidates, type GenerationResult } from "@/domain/password/generate";
import {
  CANDIDATES,
  DEFAULT_OPTIONS,
  LENGTH,
  SEPARATORS,
  WORDS,
  type GeneratorOptions,
  type Mode,
  type OptionsProblem,
  type Separator,
} from "@/domain/password/options";
import { copyText, type CopyResult } from "@/lib/clipboard";
import { useToolTracking } from "@/lib/use-tool-tracking";

/**
 * Interface of `/outils/generateur-mot-de-passe`.
 *
 * Everything happens in this component's memory. Passwords are never put
 * in the URL, in storage, in an analytics event, in a log or in an error
 * message, and nothing here makes a network request — the wordlist is a
 * code chunk of this site, loaded on demand. Nothing is generated on the
 * server: the static HTML holds no password, only the « loading » state.
 * Copying happens only on a click on « Copier ».
 * See docs/security/PASSWORD_GENERATOR_THREAT_MODEL.md.
 */

type Locale = "fr" | "en";

const STRINGS = {
  fr: {
    mode: "Type",
    modes: { password: "Mot de passe", passphrase: "Phrase de passe" } satisfies Record<Mode, string>,
    modeHint: {
      password: "Des caractères tirés au hasard. Le plus compact.",
      passphrase: "Des mots tirés au hasard. Plus long, plus facile à taper et à retenir.",
    } satisfies Record<Mode, string>,
    length: "Longueur",
    lengthUnit: "caractères",
    bounds: (min: number, max: number) => `Entre ${min} et ${max}.`,
    classes: "Caractères utilisés",
    classNames: {
      lower: "Minuscules (a–z)",
      upper: "Majuscules (A–Z)",
      digits: "Chiffres (0–9)",
      symbols: "Symboles (!#%…)",
    } satisfies Record<CharacterClass, string>,
    excludeAmbiguous: "Exclure les caractères qui se confondent (0 O o 1 l I | ' \" `)",
    requireEach: "Au moins un caractère de chaque type coché",
    words: "Nombre de mots",
    separator: "Séparateur",
    separators: { ".": "point (.)", _: "tiret bas (_)", " ": "espace", ",": "virgule (,)" } satisfies Record<Separator, string>,
    capitalize: "Majuscule au début de chaque mot",
    capitalizeHint: "Utile si un site exige une majuscule ; n'ajoute pas de hasard.",
    candidates: "Nombre de propositions",
    regenerate: "Générer de nouveau",
    loading: "Génération en cours…",
    loadingWords: "Chargement de la liste de mots…",
    result: (n: number) => (n > 1 ? "Propositions" : "Résultat"),
    copy: "Copier",
    copyLabel: (i: number, n: number) => (n > 1 ? `Copier la proposition ${i + 1}` : "Copier le mot de passe"),
    copied: (i: number, n: number) => (n > 1 ? `Proposition ${i + 1} copiée dans le presse-papiers.` : "Copié dans le presse-papiers."),
    copyFailed:
      "La copie a été refusée par le navigateur. Sélectionnez le texte et copiez-le à la main.",
    copyUnavailable:
      "Ce navigateur ne permet pas la copie automatique ici. Sélectionnez le texte et copiez-le à la main.",
    announced: (n: number) => (n > 1 ? `${n} nouvelles propositions générées.` : "Nouveau mot de passe généré."),
    entropy: "Hasard contenu :",
    bits: (b: number) => `${Math.floor(b)} bits`,
    entropyExplain:
      "C'est la mesure de l'imprévisibilité du tirage : chaque bit double le nombre de possibilités qu'il faudrait essayer. Elle vaut si vous utilisez le résultat tel quel, sans le modifier.",
    entropyCandidates: (n: number) =>
      `Choisir parmi ${n} propositions peut retirer jusqu'à ${Math.log2(n).toFixed(1)} bits : le chiffre affiché en tient compte.`,
    entropyLimit:
      "Elle ne dit rien de ce qui arrive ensuite : un mot de passe réutilisé, saisi sur une fausse page ou récolté par un logiciel espion se vole quelle que soit sa longueur.",
    alphabet: (n: number) => `Voir les ${n} caractères possibles`,
    wordlist: "Mots tirés de la liste EFF de 7 776 mots anglais (licence CC BY 3.0 US).",
    problems: {
      length_range: `La longueur doit être un nombre entier entre ${LENGTH.min} et ${LENGTH.max}.`,
      words_range: `Le nombre de mots doit être un nombre entier entre ${WORDS.min} et ${WORDS.max}.`,
      candidates_range: `Le nombre de propositions doit être entre ${CANDIDATES.min} et ${CANDIDATES.max}.`,
      no_class: "Cochez au moins un type de caractères : sans caractère, il n'y a rien à tirer.",
      length_below_classes: "La longueur est inférieure au nombre de types de caractères exigés.",
    } satisfies Record<OptionsProblem, string>,
    errorRandom:
      "Votre navigateur ne fournit pas le générateur aléatoire sécurisé (Web Crypto) dont l'outil a besoin. Pour ne pas produire un mot de passe prévisible, il s'arrête. Mettez votre navigateur à jour, puis réessayez.",
    errorWordlist: "La liste de mots n'a pas pu être chargée. Vérifiez votre connexion, puis réessayez.",
    errorOther: "La génération a échoué. Aucun mot de passe n'a été produit. Réessayez.",
    retry: "Réessayer",
    noScript:
      "Ce générateur fonctionne entièrement dans votre navigateur et nécessite JavaScript. Aucun mot de passe n'est produit par nos serveurs.",
  },
  en: {
    mode: "Type",
    modes: { password: "Password", passphrase: "Passphrase" } satisfies Record<Mode, string>,
    modeHint: {
      password: "Random characters. The most compact.",
      passphrase: "Random words. Longer, easier to type and to remember.",
    } satisfies Record<Mode, string>,
    length: "Length",
    lengthUnit: "characters",
    bounds: (min: number, max: number) => `Between ${min} and ${max}.`,
    classes: "Characters used",
    classNames: {
      lower: "Lowercase (a–z)",
      upper: "Uppercase (A–Z)",
      digits: "Digits (0–9)",
      symbols: "Symbols (!#%…)",
    } satisfies Record<CharacterClass, string>,
    excludeAmbiguous: "Exclude characters that look alike (0 O o 1 l I | ' \" `)",
    requireEach: "At least one character of each checked type",
    words: "Number of words",
    separator: "Separator",
    separators: { ".": "dot (.)", _: "underscore (_)", " ": "space", ",": "comma (,)" } satisfies Record<Separator, string>,
    capitalize: "Capitalize each word",
    capitalizeHint: "Useful when a site requires a capital letter; adds no randomness.",
    candidates: "Number of suggestions",
    regenerate: "Generate again",
    loading: "Generating…",
    loadingWords: "Loading the wordlist…",
    result: (n: number) => (n > 1 ? "Suggestions" : "Result"),
    copy: "Copy",
    copyLabel: (i: number, n: number) => (n > 1 ? `Copy suggestion ${i + 1}` : "Copy the password"),
    copied: (i: number, n: number) => (n > 1 ? `Suggestion ${i + 1} copied to the clipboard.` : "Copied to the clipboard."),
    copyFailed: "The browser refused to copy. Select the text and copy it by hand.",
    copyUnavailable: "This browser does not allow copying from here. Select the text and copy it by hand.",
    announced: (n: number) => (n > 1 ? `${n} new suggestions generated.` : "New password generated."),
    entropy: "Randomness:",
    bits: (b: number) => `${Math.floor(b)} bits`,
    entropyExplain:
      "This measures how unpredictable the draw is: each bit doubles the number of possibilities someone would have to try. It holds if you use the result exactly as generated.",
    entropyCandidates: (n: number) =>
      `Picking one of ${n} suggestions can remove up to ${Math.log2(n).toFixed(1)} bits: the figure shown accounts for it.`,
    entropyLimit:
      "It says nothing about what happens next: a password that is reused, typed on a fake page or harvested by spyware is stolen whatever its length.",
    alphabet: (n: number) => `Show the ${n} possible characters`,
    wordlist: "Words drawn from the EFF list of 7,776 English words (CC BY 3.0 US license).",
    problems: {
      length_range: `Length must be a whole number between ${LENGTH.min} and ${LENGTH.max}.`,
      words_range: `Number of words must be a whole number between ${WORDS.min} and ${WORDS.max}.`,
      candidates_range: `Number of suggestions must be between ${CANDIDATES.min} and ${CANDIDATES.max}.`,
      no_class: "Check at least one type of character: with no characters, there is nothing to draw from.",
      length_below_classes: "The length is below the number of required character types.",
    } satisfies Record<OptionsProblem, string>,
    errorRandom:
      "Your browser does not provide the secure random generator (Web Crypto) this tool needs. Rather than produce a predictable password, it stops. Update your browser, then try again.",
    errorWordlist: "The wordlist could not be loaded. Check your connection, then try again.",
    errorOther: "Generation failed. No password was produced. Try again.",
    retry: "Try again",
    noScript:
      "This generator runs entirely in your browser and needs JavaScript. No password is produced by our servers.",
  },
} as const;

type ErrorKind = "random" | "wordlist" | "other";

type View =
  | { state: "loading" }
  | { state: "result"; result: Extract<GenerationResult, { kind: "ok" }>; draw: number }
  | { state: "invalid"; problems: OptionsProblem[] }
  | { state: "error"; error: ErrorKind };

/** A text field's value as a whole number, or NaN — never clamped silently. */
function toInt(raw: string): number {
  return /^\s*\d+\s*$/.test(raw) ? Number(raw) : Number.NaN;
}

/** The settings as the fields hold them: numbers stay text until validated. */
interface Form {
  mode: Mode;
  lengthRaw: string;
  classes: CharacterClass[];
  excludeAmbiguous: boolean;
  requireEachClass: boolean;
  wordsRaw: string;
  separator: Separator;
  capitalize: boolean;
  candidates: number;
}

const DEFAULT_FORM: Form = {
  mode: DEFAULT_OPTIONS.mode,
  lengthRaw: String(DEFAULT_OPTIONS.password.length),
  classes: DEFAULT_OPTIONS.password.classes,
  excludeAmbiguous: DEFAULT_OPTIONS.password.excludeAmbiguous,
  requireEachClass: DEFAULT_OPTIONS.password.requireEachClass,
  wordsRaw: String(DEFAULT_OPTIONS.passphrase.words),
  separator: DEFAULT_OPTIONS.passphrase.separator,
  capitalize: DEFAULT_OPTIONS.passphrase.capitalize,
  candidates: DEFAULT_OPTIONS.candidates,
};

function toOptions(f: Form): GeneratorOptions {
  return {
    mode: f.mode,
    password: { length: toInt(f.lengthRaw), classes: f.classes, excludeAmbiguous: f.excludeAmbiguous, requireEachClass: f.requireEachClass },
    passphrase: { words: toInt(f.wordsRaw), separator: f.separator, capitalize: f.capitalize },
    candidates: f.candidates,
  };
}

let wordlistPromise: Promise<readonly string[]> | null = null;

/** The EFF list, as a separate chunk loaded only in passphrase mode. */
function loadWordlist(): Promise<readonly string[]> {
  wordlistPromise ??= import("@/domain/password/eff-large-wordlist")
    .then((m) => m.EFF_LARGE_WORDLIST)
    .catch((error: unknown) => {
      wordlistPromise = null;
      throw error;
    });
  return wordlistPromise;
}

export function PasswordGenerator({ locale = "fr" }: { locale?: Locale }) {
  const t = STRINGS[locale];
  const ids = useId();
  const tracking = useToolTracking("generateur-mot-de-passe", locale);

  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const { mode, lengthRaw, classes, excludeAmbiguous, requireEachClass, wordsRaw, separator, capitalize, candidates } = form;

  const [view, setView] = useState<View>({ state: "loading" });
  const [copy, setCopy] = useState<{ index: number; result: CopyResult } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Numbers each draw: discards a slow wordlist load that a newer draw has
  // superseded, and keys the result list so a redraw replaces it.
  const latest = useRef(0);
  // The « new password generated » announcement waits until the settings
  // stop changing: typing « 16 » would otherwise announce twice.
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(
    async (opts: GeneratorOptions) => {
      const ticket = ++latest.current;
      setCopy(null);
      if (announceTimer.current) clearTimeout(announceTimer.current);
      setAnnouncement("");
      try {
        let wordlist: readonly string[] | null = null;
        if (opts.mode === "passphrase") {
          setView({ state: "loading" });
          try {
            wordlist = await loadWordlist();
          } catch {
            if (ticket === latest.current) {
              setView({ state: "error", error: "wordlist" });
              tracking.error("resource_load");
            }
            return;
          }
        }
        if (ticket !== latest.current) return;
        const result = generateCandidates(opts, wordlist);
        if (result.kind === "invalid") {
          setView({ state: "invalid", problems: result.problems });
          return;
        }
        setView({ state: "result", result, draw: ticket });
        const message = t.announced(result.values.length);
        announceTimer.current = setTimeout(() => setAnnouncement(message), 600);
      } catch (error) {
        if (ticket !== latest.current) return;
        // The error object is not logged or kept: only its kind is shown, and
        // measured as a code.
        const random = error instanceof Error && error.name === "RandomUnavailableError";
        setView({ state: "error", error: random ? "random" : "other" });
        tracking.error(random ? "random_unavailable" : "other");
      }
    },
    [t, tracking],
  );

  // First draw, once mounted: it needs the browser's CSPRNG, and a draw
  // during the server render would put the same password in everyone's
  // static HTML. Every later draw comes from an event handler below.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- first draw on mount, client only (see above)
    void run(toOptions(DEFAULT_FORM));
  }, [run]);

  const interact = tracking.start;

  /** A change of settings: the result is redrawn at once, without reloading. */
  function update(patch: Partial<Form>) {
    interact();
    const next = { ...form, ...patch };
    setForm(next);
    void run(toOptions(next));
  }

  async function onCopy(index: number, value: string) {
    interact();
    const ticket = latest.current;
    const result = await copyText(value);
    if (result === "copied") tracking.complete();
    // A redraw during the copy replaced the value: a message about it would
    // now describe a password that is no longer on screen.
    if (ticket === latest.current) setCopy({ index, result });
  }

  function toggleClass(cls: CharacterClass, checked: boolean) {
    update({ classes: CHARACTER_CLASSES.filter((c) => (c === cls ? checked : classes.includes(c))) });
  }

  const shown = view.state === "result" ? view.result.values.length : 0;
  const copyMessage =
    copy &&
    (copy.result === "copied" ? t.copied(copy.index, shown) : copy.result === "failed" ? t.copyFailed : t.copyUnavailable);
  const fieldClass =
    "rounded-md border border-border bg-background px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <div className="space-y-6">
      <noscript>
        <p className="rounded-md border border-border bg-muted p-4 text-sm">{t.noScript}</p>
      </noscript>

      <div className="space-y-5 rounded-lg border border-border bg-card p-4 sm:p-6">
        <fieldset>
          <legend className="text-sm font-semibold">{t.mode}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(["password", "passphrase"] as const).map((m) => (
              <label
                key={m}
                className="flex cursor-pointer gap-3 rounded-md border border-border p-3 has-[:checked]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
              >
                <input
                  type="radio"
                  name={`${ids}-mode`}
                  value={m}
                  checked={mode === m}
                  onChange={() => update({ mode: m })}
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="block font-medium">{t.modes[m]}</span>
                  <span className="block text-sm text-muted-foreground">{t.modeHint[m]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "password" ? (
          <>
            <div>
              <label htmlFor={`${ids}-length`} className="text-sm font-semibold">
                {t.length}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  aria-hidden="true"
                  tabIndex={-1}
                  min={LENGTH.min}
                  max={LENGTH.max}
                  value={Number.isNaN(toInt(lengthRaw)) ? LENGTH.default : Math.min(Math.max(toInt(lengthRaw), LENGTH.min), LENGTH.max)}
                  onChange={(e) => update({ lengthRaw: e.target.value })}
                  className="min-w-0 flex-1 accent-[var(--color-primary)]"
                />
                <input
                  id={`${ids}-length`}
                  type="number"
                  inputMode="numeric"
                  min={LENGTH.min}
                  max={LENGTH.max}
                  step={1}
                  value={lengthRaw}
                  aria-describedby={`${ids}-length-hint${view.state === "invalid" ? ` ${ids}-problems` : ""}`}
                  aria-invalid={view.state === "invalid" && view.problems.includes("length_range")}
                  onChange={(e) => update({ lengthRaw: e.target.value })}
                  className={`${fieldClass} w-24`}
                />
                <span className="text-sm text-muted-foreground">{t.lengthUnit}</span>
              </div>
              <p id={`${ids}-length-hint`} className="mt-1 text-sm text-muted-foreground">
                {t.bounds(LENGTH.min, LENGTH.max)}
              </p>
            </div>

            <fieldset
              aria-describedby={view.state === "invalid" && view.problems.includes("no_class") ? `${ids}-problems` : undefined}
            >
              <legend className="text-sm font-semibold">{t.classes}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {CHARACTER_CLASSES.map((cls) => (
                  <label key={cls} className="flex min-h-11 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={classes.includes(cls)}
                      onChange={(e) => toggleClass(cls, e.target.checked)}
                      className="size-4 accent-[var(--color-primary)]"
                    />
                    <span>{t.classNames[cls]}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => update({ excludeAmbiguous: e.target.checked })}
                    className="size-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span>{t.excludeAmbiguous}</span>
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={requireEachClass}
                    onChange={(e) => update({ requireEachClass: e.target.checked })}
                    className="size-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span>{t.requireEach}</span>
                </label>
              </div>
            </fieldset>
          </>
        ) : (
          <>
            <div>
              <label htmlFor={`${ids}-words`} className="text-sm font-semibold">
                {t.words}
              </label>
              <div className="mt-2">
                <input
                  id={`${ids}-words`}
                  type="number"
                  inputMode="numeric"
                  min={WORDS.min}
                  max={WORDS.max}
                  step={1}
                  value={wordsRaw}
                  aria-describedby={`${ids}-words-hint${view.state === "invalid" ? ` ${ids}-problems` : ""}`}
                  aria-invalid={view.state === "invalid" && view.problems.includes("words_range")}
                  onChange={(e) => update({ wordsRaw: e.target.value })}
                  className={`${fieldClass} w-24`}
                />
              </div>
              <p id={`${ids}-words-hint`} className="mt-1 text-sm text-muted-foreground">
                {t.bounds(WORDS.min, WORDS.max)}
              </p>
            </div>
            <div>
              <label htmlFor={`${ids}-separator`} className="text-sm font-semibold">
                {t.separator}
              </label>
              <div className="mt-2">
                <select
                  id={`${ids}-separator`}
                  value={separator}
                  onChange={(e) => update({ separator: e.target.value as Separator })}
                  className={fieldClass}
                >
                  {SEPARATORS.map((s) => (
                    <option key={s} value={s}>
                      {t.separators[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={capitalize}
                  aria-describedby={`${ids}-cap-hint`}
                  onChange={(e) => update({ capitalize: e.target.checked })}
                  className="size-4 shrink-0 accent-[var(--color-primary)]"
                />
                <span>{t.capitalize}</span>
              </label>
              <p id={`${ids}-cap-hint`} className="text-sm text-muted-foreground">
                {t.capitalizeHint}
              </p>
            </div>
          </>
        )}

        <div>
          <label htmlFor={`${ids}-candidates`} className="text-sm font-semibold">
            {t.candidates}
          </label>
          <div className="mt-2">
            <select
              id={`${ids}-candidates`}
              value={candidates}
              onChange={(e) => update({ candidates: Number(e.target.value) })}
              className={fieldClass}
            >
              {Array.from({ length: CANDIDATES.max - CANDIDATES.min + 1 }, (_, i) => CANDIDATES.min + i).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section aria-labelledby={`${ids}-result`} className="rounded-lg border border-border bg-muted p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id={`${ids}-result`} className="text-lg font-semibold">
            {t.result(view.state === "result" ? view.result.values.length : candidates)}
          </h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              interact();
              void run(toOptions(form));
            }}
          >
            {view.state === "error" ? t.retry : t.regenerate}
          </Button>
        </div>

        {/* Announces that a draw happened, never what it produced: a screen
            reader would otherwise read the password aloud on every change. */}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <div className="mt-4">
          {view.state === "loading" && (
            <p className="text-sm text-muted-foreground">{mode === "passphrase" ? t.loadingWords : t.loading}</p>
          )}

          {view.state === "invalid" && (
            <div id={`${ids}-problems`} data-state="invalid" aria-live="polite" className="space-y-1 text-sm text-danger">
              {view.problems.map((p) => (
                <p key={p}>{t.problems[p]}</p>
              ))}
            </div>
          )}

          {view.state === "error" && (
            <p role="alert" className="text-sm text-danger">
              {view.error === "random" ? t.errorRandom : view.error === "wordlist" ? t.errorWordlist : t.errorOther}
            </p>
          )}

          {view.state === "result" && (
            <div className="space-y-4">
              <ul className="space-y-3">
                {view.result.values.map((value, i) => (
                  <li key={`${view.draw}-${i}`} className="flex flex-col gap-2 rounded-md border border-border bg-background p-3 sm:flex-row sm:items-center">
                    {/* A plain span, not <output>: <output> is an implicit live
                        region, and a screen reader could read the value aloud. */}
                    <span
                      translate="no"
                      data-value=""
                      className="notranslate min-w-0 flex-1 select-all break-all font-mono text-lg leading-relaxed"
                    >
                      {value}
                    </span>
                    <Button
                      type="button"
                      onClick={() => void onCopy(i, value)}
                      aria-label={t.copyLabel(i, view.result.values.length)}
                      className="shrink-0"
                    >
                      {t.copy}
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">{t.entropy}</span>{" "}
                  {t.bits(view.result.conservativeBits)}
                </p>
                <p className="mt-1">{t.entropyExplain}</p>
                {view.result.values.length > 1 && <p className="mt-1">{t.entropyCandidates(view.result.values.length)}</p>}
                <p className="mt-1">{t.entropyLimit}</p>
              </div>

              {view.result.alphabet ? (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">{t.alphabet(view.result.alphabet.chars.length)}</summary>
                  <p translate="no" className="notranslate mt-2 break-all font-mono tracking-wider">
                    {view.result.alphabet.chars}
                  </p>
                </details>
              ) : (
                <p className="text-sm text-muted-foreground">{t.wordlist}</p>
              )}
            </div>
          )}
        </div>

        <p aria-live="polite" className="mt-3 min-h-5 text-sm font-medium">
          {copyMessage}
        </p>
      </section>
    </div>
  );
}
