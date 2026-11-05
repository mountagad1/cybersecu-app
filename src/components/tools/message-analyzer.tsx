"use client";

import { useToolTracking } from "@/lib/use-tool-tracking";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Search,
  Share2,
  ShieldQuestion,
} from "lucide-react";
import {
  analyzeMessage,
  decodeSharedResult,
  encodeSharedResult,
  MAX_MESSAGE_LENGTH,
  MESSAGE_CHANNELS,
  similarAttacksForCodes,
  type FoundLink,
  type MessageChannel,
} from "@/domain/message/analyze";
import { findSignal, type SignalCode } from "@/domain/message/signals";
import type { PsychologicalTriggerCode } from "@/domain/scenario/types";
import type { Locale } from "@/domain/i18n/locale";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** What the page resolves on the server, so the tool can link without
 * shipping the whole catalogue to the browser. Slugs are already in the
 * page's language. */
export interface AnalyzerAttack {
  name: string;
  slug: string;
  simulationSlug?: string;
}

export interface AnalyzerExample {
  slug: string;
  label: string;
  channel: MessageChannel;
  text: string;
}

const STRINGS = {
  fr: {
    toolPath: "/outils/analyseur-de-message",
    attackPath: "/attaques/",
    leverPath: "/leviers/",
    simulationPath: "/simulations/",
    checklistPath: "/outils/j-ai-clique",
    /** Matches `galleryHrefForChannel` (src/domain/attack/gallery.ts). */
    galleryPaths: {
      sms: "/exemples#sms",
      email: "/exemples#email",
      messaging: "/exemples#messagerie",
      other: "/exemples",
    },
    gallery: "Voir d'autres exemples fictifs annotés, classés par canal",
    linkDecoderPath: "/outils/decodeur-de-lien",
    params: { signals: "signaux", channel: "canal" },
    numberLocale: "fr-FR",
    channels: {
      sms: "SMS",
      email: "Email",
      messaging: "Messagerie (WhatsApp, Messenger…)",
      other: "Autre",
    },
    channelLegend: "Où l'avez-vous reçu ?",
    textLabel: "Texte du message",
    placeholder: "Collez ici le SMS, l'email ou le message reçu…",
    privacy:
      "L'analyse se fait dans votre navigateur : le texte n'est envoyé nulle part, n'est pas enregistré, et aucun lien n'est ouvert. Vous pouvez masquer votre nom ou un numéro avant de coller.",
    empty: "Collez d'abord le texte du message.",
    tooLong: (max: string) =>
      `Le texte dépasse ${max} caractères : collez seulement le message.`,
    analyze: "Analyser le message",
    clear: "Effacer",
    examplesIntro: "Pas de message sous la main ? Essayez un exemple fictif :",
    shared: "Résultat partagé.",
    sharedBody:
      "Le message lui-même n'est pas inclus dans le lien : seuls les procédés repérés le sont.",
    verdictMany: (n: number) => `${n} procédés typiques des arnaques repérés`,
    verdictSome: (n: number) =>
      n > 1
        ? `${n} procédés utilisés dans les arnaques repérés`
        : "1 procédé utilisé dans les arnaques repéré",
    verdictNone: "Aucun procédé connu repéré",
    verdictManyBody:
      "Ce message réunit plusieurs techniques que les arnaques utilisent ensemble. Ne cliquez pas, ne répondez pas, ne rappelez pas le numéro qu'il donne.",
    verdictSomeBody:
      "Ce n'est pas une preuve d'arnaque, mais c'est une raison de vérifier par vous-même avant d'agir.",
    verdictNoneBody:
      "Cela ne prouve pas que le message est honnête : une arnaque bien écrite peut n'utiliser aucun de ces procédés. Si le message vous demande d'agir, vérifiez quand même par un canal que vous choisissez.",
    found: "Ce que l'outil a repéré",
    inMessage: "Dans le message : ",
    quote: (s: string) => `« ${s} »`,
    lever: "Le ressort utilisé : ",
    linksTitle: "Les liens du message, lus comme le navigateur les lit",
    linkOwner: "Ce lien mène chez le propriétaire de ",
    linkRead: "Adresse lue : ",
    otherAlphabet:
      "Caractères d'un autre alphabet qui imitent des lettres latines : ",
    linksNote:
      "Comparez ce nom, lettre par lettre, avec celui de l'organisme que vous attendiez. Un nom correct ne prouve pas que le message est honnête. Pour lire une autre adresse : ",
    linkDecoder: "décodeur de lien",
    similar: "Ce message ressemble à",
    similarSub: "Comment ça marche, comment vérifier, que faire",
    train: "S'entraîner sur ce type de message →",
    now: "Que faire maintenant",
    now1: "Ne cliquez pas sur le lien, ne répondez pas, ne rappelez pas le numéro donné dans le message.",
    now2: "Si le message parle d'un compte, d'un colis ou d'un paiement, vérifiez en ouvrant vous-même l'application ou le site officiel, ou en appelant le numéro que vous avez déjà.",
    nowSms:
      "En France, transférez gratuitement le SMS au 33700 (signalement des SMS indésirables), puis supprimez-le.",
    nowOther:
      "Signalez-le comme indésirable dans votre messagerie, puis supprimez-le.",
    already: "Vous avez déjà cliqué, répondu ou payé ?",
    alreadyLink: "Les gestes à faire selon ce que vous avez fait, dans l'ordre",
    shareTitle: "Prévenir un proche",
    shareBody:
      "Le lien partagé contient seulement la liste des procédés repérés — jamais le texte du message, ni ses liens.",
    shareCta: "Partager le résultat",
    copied: "Lien copié",
    shareHeading: "Ce message est-il une arnaque ?",
    shareText: (n: number) =>
      `${n} procédé(s) d'arnaque repéré(s) dans un message. Le détail, sans le message :`,
  },
  en: {
    toolPath: "/en/tools/message-analyzer",
    attackPath: "/en/attaques/",
    leverPath: "/en/levers/",
    simulationPath: "/en/simulations/",
    checklistPath: "/en/tools/i-clicked",
    galleryPaths: {
      sms: "/en/examples#text-message",
      email: "/en/examples#email",
      messaging: "/en/examples#messaging",
      other: "/en/examples",
    },
    gallery: "See more annotated fictional examples, sorted by channel",
    linkDecoderPath: "/en/tools/link-decoder",
    params: { signals: "signals", channel: "channel" },
    numberLocale: "en-US",
    channels: {
      sms: "Text message",
      email: "Email",
      messaging: "Messaging app (WhatsApp, Messenger…)",
      other: "Other",
    },
    channelLegend: "Where did you get it?",
    textLabel: "Message text",
    placeholder: "Paste the text message, email or message you received here…",
    privacy:
      "The analysis happens in your browser: the text is not sent anywhere, not stored, and no link is opened. You can hide your name or a number before pasting.",
    empty: "Paste the message text first.",
    tooLong: (max: string) =>
      `The text is longer than ${max} characters: paste only the message.`,
    analyze: "Analyze the message",
    clear: "Clear",
    examplesIntro: "No message to hand? Try a fictional example:",
    shared: "Shared result.",
    sharedBody:
      "The message itself is not included in the link: only the techniques found are.",
    verdictMany: (n: number) => `${n} typical scam techniques found`,
    verdictSome: (n: number) =>
      n > 1
        ? `${n} techniques used in scams found`
        : "1 technique used in scams found",
    verdictNone: "No known technique found",
    verdictManyBody:
      "This message combines several techniques that scams use together. Don't click, don't reply, don't call back the number it gives.",
    verdictSomeBody:
      "It's not proof of a scam, but it's a reason to check for yourself before acting.",
    verdictNoneBody:
      "That doesn't prove the message is honest: a well-written scam can use none of these techniques. If the message asks you to act, check anyway through a channel you choose.",
    found: "What the tool found",
    inMessage: "In the message: ",
    quote: (s: string) => `“${s}”`,
    lever: "The lever it uses: ",
    linksTitle: "The message's links, read the way the browser reads them",
    linkOwner: "This link leads to the owner of ",
    linkRead: "Address read: ",
    otherAlphabet: "Characters from another alphabet imitating Latin letters: ",
    linksNote:
      "Compare this name, letter by letter, with the organization you were expecting. A correct name doesn't prove the message is honest. To read another address: ",
    linkDecoder: "link decoder",
    similar: "This message looks like",
    similarSub: "How it works, how to check, what to do",
    train: "Practise on this kind of message →",
    now: "What to do now",
    now1: "Don't click the link, don't reply, don't call back the number given in the message.",
    now2: "If the message is about an account, a parcel or a payment, check by opening the official app or website yourself, or by calling the number you already have.",
    nowSms:
      "Forward the text to your carrier's spam-reporting number (33700 in France, free of charge), then delete it.",
    nowOther:
      "Report it as spam in your messaging app or mailbox, then delete it.",
    already: "Already clicked, replied or paid?",
    alreadyLink: "The steps to take for what you did, in order",
    shareTitle: "Warn someone close to you",
    shareBody:
      "The shared link only contains the list of techniques found — never the message text or its links.",
    shareCta: "Share the result",
    copied: "Link copied",
    shareHeading: "Is this message a scam?",
    shareText: (n: number) =>
      `${n} scam technique(s) found in a message. The details, without the message:`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

interface ResultState {
  channel: MessageChannel;
  signals: { code: SignalCode; excerpts: string[] }[];
  links: FoundLink[];
  similarAttackCodes: string[];
  /** Opened from a shared URL: no excerpts and no links, by design. */
  shared: boolean;
}

type Levers = Partial<
  Record<PsychologicalTriggerCode, { name: string; slug: string }>
>;

/**
 * Input + result for the message analyzer, in French and English. The
 * analysis runs here, in the browser; there is no fetch in this file, and
 * the text is never written to the URL, to storage or to an analytics
 * event — only signal codes are (see `@/lib/analytics`). Result links do
 * not prefetch: a prefetch would tell the server which signals were found.
 */
export function MessageAnalyzer({
  attacks,
  levers,
  examples,
  locale = "fr",
}: {
  attacks: Record<string, AnalyzerAttack>;
  levers: Levers;
  examples: AnalyzerExample[];
  locale?: Locale;
}) {
  const t = STRINGS[locale];
  const textareaId = useId();
  const hintId = useId();
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<MessageChannel>("sms");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const tracking = useToolTracking("analyseur-de-message", locale);

  // A shared link carries signal codes only: rebuild the explanation from
  // them, without any of the original message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codes = decodeSharedResult(params.get(t.params.signals));
    const sharedChannel = params.get(t.params.channel) as MessageChannel | null;
    if (codes.length === 0) return;
    const ch =
      sharedChannel && MESSAGE_CHANNELS.includes(sharedChannel)
        ? sharedChannel
        : "other";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
    setResult({
      channel: ch,
      signals: codes.map((code) => ({ code, excerpts: [] })),
      links: [],
      similarAttackCodes: similarAttacksForCodes(codes, ch),
      shared: true,
    });
  }, [t]);

  function run(input: string, ch: MessageChannel, source: "typed" | "example") {
    const analysis = analyzeMessage(input, ch, locale);
    if (!analysis.ok) {
      setResult(null);
      setError(
        analysis.error === "empty"
          ? t.empty
          : t.tooLong(MAX_MESSAGE_LENGTH.toLocaleString(t.numberLocale)),
      );
      return;
    }
    setError(null);
    setResult({ ...analysis, shared: false });
    tracking.complete();
    trackEvent({
      name: "message_analyzer_analyzed",
      props: {
        locale,
        channel: ch,
        signal_count: analysis.signals.length,
        signals: encodeSharedResult(analysis.signals),
        link_count: analysis.links.length,
        source,
      },
    });
    // Move to the result on small screens, where it is below the fold.
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <div>
      <form
        className="rounded-xl border border-border bg-card p-4 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          run(text, channel, "typed");
        }}
      >
        <fieldset>
          <legend className="text-sm font-semibold">{t.channelLegend}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MESSAGE_CHANNELS.map((ch) => (
              <label
                key={ch}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
                  channel === ch
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary",
                )}
              >
                <input
                  type="radio"
                  name="channel"
                  value={ch}
                  checked={channel === ch}
                  onChange={() => setChannel(ch)}
                  className="sr-only"
                />
                {t.channels[ch]}
              </label>
            ))}
          </div>
        </fieldset>

        <label
          htmlFor={textareaId}
          className="mt-5 block text-sm font-semibold"
        >
          {t.textLabel}
        </label>
        <textarea
          id={textareaId}
          aria-describedby={hintId}
          rows={7}
          maxLength={MAX_MESSAGE_LENGTH}
          autoComplete="off"
          spellCheck={false}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            tracking.start();
          }}
          placeholder={t.placeholder}
          className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
        />
        <p id={hintId} className="mt-2 text-xs text-muted-foreground">
          {t.privacy}
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            <Search className="size-4" aria-hidden />
            {t.analyze}
          </Button>
          {(text || result) && (
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => {
                setText("");
                setResult(null);
                setError(null);
                window.history.replaceState(null, "", t.toolPath);
              }}
            >
              {t.clear}
            </Button>
          )}
        </div>

        {examples.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-sm font-semibold">{t.examplesIntro}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {examples.map((example) => (
                <li key={example.slug}>
                  <button
                    type="button"
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                    onClick={() => {
                      setText(example.text);
                      setChannel(example.channel);
                      trackEvent({
                        name: "message_analyzer_example_loaded",
                        props: { example: example.slug },
                      });
                      run(example.text, example.channel, "example");
                    }}
                  >
                    {example.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-8 outline-none"
      >
        {result && (
          <AnalysisResult
            result={result}
            attacks={attacks}
            levers={levers}
            locale={locale}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

function AnalysisResult({
  result,
  attacks,
  levers,
  locale,
  t,
}: {
  result: ResultState;
  attacks: Record<string, AnalyzerAttack>;
  levers: Levers;
  locale: Locale;
  t: Strings;
}) {
  const count = result.signals.length;
  const similar = result.similarAttackCodes
    .map((code) => ({ code, attack: attacks[code] }))
    .filter((a) => a.attack);

  return (
    <div className="space-y-8">
      {result.shared && (
        <p className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
          <strong className="text-foreground">{t.shared}</strong> {t.sharedBody}
        </p>
      )}

      <section
        aria-labelledby="verdict"
        className={cn(
          "rounded-xl border p-5",
          count >= 3
            ? "border-danger/40 bg-danger/10"
            : count > 0
              ? "border-warning/40 bg-warning/10"
              : "border-border bg-muted",
        )}
      >
        <div className="flex items-start gap-3">
          {count > 0 ? (
            <AlertTriangle
              className={cn(
                "mt-0.5 size-6 shrink-0",
                count >= 3 ? "text-danger" : "text-warning",
              )}
              aria-hidden
            />
          ) : (
            <ShieldQuestion
              className="mt-0.5 size-6 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
          <div>
            <h2 id="verdict" className="text-lg font-semibold">
              {count >= 3
                ? t.verdictMany(count)
                : count > 0
                  ? t.verdictSome(count)
                  : t.verdictNone}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {count >= 3
                ? t.verdictManyBody
                : count > 0
                  ? t.verdictSomeBody
                  : t.verdictNoneBody}
            </p>
          </div>
        </div>
      </section>

      {count > 0 && (
        <section aria-labelledby="signals-found">
          <h2 id="signals-found" className="text-xl font-semibold">
            {t.found}
          </h2>
          <ul className="mt-4 space-y-4">
            {result.signals.map((found) => {
              const signal = findSignal(found.code, locale);
              if (!signal) return null;
              const lever = signal.lever ? levers[signal.lever] : undefined;
              return (
                <li
                  key={found.code}
                  className="rounded-lg border border-border p-4"
                >
                  <h3 className="font-semibold">{signal.label}</h3>
                  {found.excerpts.length > 0 && (
                    <p className="mt-1 break-words text-sm">
                      <span className="text-muted-foreground">
                        {t.inMessage}
                      </span>
                      {found.excerpts.map((e, i) => (
                        <span key={e}>
                          {i > 0 && ", "}
                          <mark className="rounded bg-warning/20 px-1 text-foreground">
                            {t.quote(e)}
                          </mark>
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {signal.explanation}
                  </p>
                  {lever && (
                    <p className="mt-2 text-sm">
                      {t.lever}
                      <Link
                        prefetch={false}
                        href={`${t.leverPath}${lever.slug}`}
                        className="text-primary hover:underline"
                        onClick={() =>
                          trackEvent({
                            name: "message_analyzer_cta_clicked",
                            props: { target: "lever" },
                          })
                        }
                      >
                        {lever.name.toLowerCase()}
                      </Link>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {result.links.length > 0 && (
        <section aria-labelledby="links-found">
          <h2 id="links-found" className="text-xl font-semibold">
            {t.linksTitle}
          </h2>
          <ul className="mt-4 space-y-4">
            {result.links.map((link) => (
              <li
                key={link.raw}
                className="rounded-lg border border-border bg-muted p-4"
              >
                <p className="break-all font-mono text-xs text-muted-foreground">
                  {link.raw}
                </p>
                <p className="mt-2 text-sm">
                  {link.analysis.registrableDomain ? t.linkOwner : t.linkRead}
                  <strong className="break-all font-mono text-base">
                    {link.analysis.registrableDomain ?? link.analysis.hostname}
                  </strong>
                </p>
                {link.analysis.observations.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {link.analysis.observations.map((o) => (
                      <li key={o.kind} className="break-words">
                        {o.text}
                      </li>
                    ))}
                  </ul>
                )}
                {link.analysis.suspiciousChars.length > 0 && (
                  <p className="mt-2 text-sm text-danger">
                    {t.otherAlphabet}
                    {link.analysis.suspiciousChars
                      .map((c) => `${t.quote(c.char)} (${c.script})`)
                      .join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.linksNote}
            <Link
              prefetch={false}
              href={t.linkDecoderPath}
              className="text-primary hover:underline"
              onClick={() =>
                trackEvent({
                  name: "message_analyzer_cta_clicked",
                  props: { target: "link_decoder" },
                })
              }
            >
              {t.linkDecoder}
            </Link>
            .
          </p>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby="looks-like">
          <h2 id="looks-like" className="text-xl font-semibold">
            {t.similar}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {similar.map(({ code, attack }) => (
              <li
                key={code}
                className="flex flex-col rounded-lg border border-border bg-card p-4"
              >
                <Link
                  prefetch={false}
                  href={`${t.attackPath}${attack.slug}`}
                  className="font-semibold hover:text-primary"
                  onClick={() =>
                    trackEvent({
                      name: "message_analyzer_cta_clicked",
                      props: { target: "attack", attack_code: code },
                    })
                  }
                >
                  {attack.name}
                </Link>
                <span className="mt-1 text-xs text-muted-foreground">
                  {t.similarSub}
                </span>
                {attack.simulationSlug && (
                  <Link
                    prefetch={false}
                    href={`${t.simulationPath}${attack.simulationSlug}`}
                    className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    onClick={() =>
                      trackEvent({
                        name: "message_analyzer_cta_clicked",
                        props: { target: "simulation", attack_code: code },
                      })
                    }
                  >
                    {t.train}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link
              prefetch={false}
              href={t.galleryPaths[result.channel]}
              className="font-medium text-primary hover:underline"
              onClick={() =>
                trackEvent({
                  name: "message_analyzer_cta_clicked",
                  props: { target: "gallery" },
                })
              }
            >
              {t.gallery}
            </Link>
          </p>
        </section>
      )}

      <section aria-labelledby="what-now">
        <h2 id="what-now" className="text-xl font-semibold">
          {t.now}
        </h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm">
          <li>{t.now1}</li>
          <li>{t.now2}</li>
          <li>{result.channel === "sms" ? t.nowSms : t.nowOther}</li>
        </ol>
        <p className="mt-4 rounded-md border border-border p-3 text-sm">
          <strong>{t.already}</strong>{" "}
          <Link
            prefetch={false}
            href={t.checklistPath}
            className="text-primary hover:underline"
            onClick={() =>
              trackEvent({
                name: "message_analyzer_cta_clicked",
                props: { target: "incident_assistant" },
              })
            }
          >
            {t.alreadyLink}
          </Link>
          .
        </p>
      </section>

      {count > 0 && <ShareResult result={result} t={t} />}
    </div>
  );
}

function ShareResult({ result, t }: { result: ResultState; t: Strings }) {
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams({
    [t.params.signals]: encodeSharedResult(result.signals),
    [t.params.channel]: result.channel,
  });
  const path = `${t.toolPath}?${params.toString()}`;
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  async function share() {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shareHeading,
          text: t.shareText(result.signals.length),
          url,
        });
        trackEvent({
          name: "message_analyzer_result_shared",
          props: { method: "share", signal_count: result.signals.length },
        });
      } catch {
        // Cancelled by the visitor: nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent({
        name: "message_analyzer_result_shared",
        props: { method: "copy", signal_count: result.signals.length },
      });
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      aria-labelledby="share"
      className="rounded-lg border border-border p-4"
    >
      <h2 id="share" className="font-semibold">
        {t.shareTitle}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t.shareBody}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full sm:w-auto"
        onClick={share}
      >
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : canShare ? (
          <Share2 className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {copied ? t.copied : t.shareCta}
      </Button>
    </section>
  );
}
