"use client";

import { useToolTracking } from "@/lib/use-tool-tracking";

import { useId, useState } from "react";
import {
  analyzeLink,
  type DecodeLocale,
  type LinkAnalysis,
} from "@/domain/link/decode";
import { Button } from "@/components/ui/button";

const STRINGS = {
  fr: {
    inputLabel: "Adresse à analyser",
    submit: "Analyser",
    owner: "Le site appartient au propriétaire de",
    readByBrowser: "Adresse lue par le navigateur",
    fullAddress: "Adresse complète, telle que le navigateur la lit :",
    compare:
      "C'est ce nom, et lui seul, que vous devez comparer avec celui de l'organisme que vous attendiez — en le lisant lettre par lettre.",
    chars: "Caractères qui ne sont pas ce qu'ils paraissent",
    script: "alphabet",
    quote: (c: string) => `« ${c} »`,
    observations: "Ce que l'adresse révèle",
    notHonestTitle: "Cet outil ne dit pas si le site est honnête.",
    notHonest:
      "Il montre à qui appartient l'adresse. Un nom de domaine correct n'empêche pas qu'un message soit frauduleux, et pour vous connecter ou payer, la règle reste la même : passez par un favori ou l'application officielle, jamais par un lien reçu.",
  },
  en: {
    inputLabel: "Address to analyze",
    submit: "Analyze",
    owner: "The site belongs to the owner of",
    readByBrowser: "Address as the browser reads it",
    fullAddress: "Full address, as the browser reads it:",
    compare:
      "This name, and this name only, is what you need to compare with the organization you were expecting — reading it letter by letter.",
    chars: "Characters that are not what they seem",
    script: "alphabet",
    quote: (c: string) => `“${c}”`,
    observations: "What the address reveals",
    notHonestTitle: "This tool does not tell you whether the site is honest.",
    notHonest:
      "It shows who owns the address. A correct domain name does not stop a message from being fraudulent, and to sign in or pay, the rule stays the same: use a bookmark or the official app, never a link you received.",
  },
} as const;

/**
 * Input + result for `/outils/decodeur-de-lien`. Everything runs here, in
 * the browser: the address is never sent to the server, which the page
 * states and which the absence of any fetch below makes true.
 */
export function LinkDecoder({ locale = "fr" }: { locale?: DecodeLocale }) {
  const t = STRINGS[locale];
  const inputId = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<LinkAnalysis | null>(null);
  const tracking = useToolTracking("decodeur-de-lien", locale);

  return (
    <div>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(analyzeLink(value, locale));
          tracking.complete();
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {t.inputLabel}
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="https://…"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            tracking.start();
          }}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm focus-visible:outline-2 focus-visible:outline-primary"
        />
        <Button type="submit">{t.submit}</Button>
      </form>

      <div aria-live="polite" className="mt-6">
        {result && !result.ok && (
          <p className="text-sm text-danger">{result.error}</p>
        )}
        {result?.ok && <LinkResult analysis={result} locale={locale} />}
      </div>
    </div>
  );
}

function LinkResult({
  analysis,
  locale,
}: {
  analysis: Extract<LinkAnalysis, { ok: true }>;
  locale: DecodeLocale;
}) {
  const t = STRINGS[locale];
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="owner"
        className="rounded-lg border border-border bg-muted p-5"
      >
        <h3 id="owner" className="text-sm font-semibold text-muted-foreground">
          {analysis.registrableDomain ? t.owner : t.readByBrowser}
        </h3>
        <p className="mt-1 break-all font-mono text-xl font-semibold">
          {analysis.registrableDomain ?? analysis.hostname}
        </p>
        {analysis.registrableDomain && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t.fullAddress}{" "}
            <span className="break-all font-mono text-foreground">
              {analysis.subdomain && (
                <span className="opacity-60">{analysis.subdomain}.</span>
              )}
              {analysis.registrableDomain}
            </span>
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">{t.compare}</p>
      </section>

      {analysis.suspiciousChars.length > 0 && (
        <section aria-labelledby="chars">
          <h3 id="chars" className="font-semibold">
            {t.chars}
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {analysis.suspiciousChars.map((c) => (
              <li key={c.codePoint}>
                <span className="font-mono text-base">{t.quote(c.char)}</span> —{" "}
                {c.codePoint}, {t.script} {c.script}
              </li>
            ))}
          </ul>
        </section>
      )}

      {analysis.observations.length > 0 && (
        <section aria-labelledby="observations">
          <h3 id="observations" className="font-semibold">
            {t.observations}
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {analysis.observations.map((o) => (
              <li key={o.kind} className="break-words">
                {o.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="rounded-md border border-border p-4 text-sm">
        <strong>{t.notHonestTitle}</strong> {t.notHonest}
      </p>
    </div>
  );
}
