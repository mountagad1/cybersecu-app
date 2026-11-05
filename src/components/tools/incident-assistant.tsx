"use client";

import { useToolTracking } from "@/lib/use-tool-tracking";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Phone, Printer, Share2 } from "lucide-react";
import {
  decodeIncidentCodes,
  planCodes,
  type IncidentCode,
} from "@/content/incident";
import type { Locale } from "@/domain/i18n/locale";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type IncidentChannel = "sms" | "email" | "call" | "web" | "qr" | "other";

export const INCIDENT_CHANNELS: readonly IncidentChannel[] = [
  "sms",
  "email",
  "call",
  "web",
  "qr",
  "other",
];

/** Resolved on the server, in the page's language. */
export interface AssistantSituation {
  code: IncidentCode;
  choice: string;
  title: string;
  note?: string;
  actions: string[];
  guideHref?: string;
  /** A tool that does one of the steps (the password generator). */
  tool?: { href: string; label: string };
}

export interface AssistantAttack {
  name: string;
  href: string;
  simulationHref?: string;
}

const STRINGS = {
  fr: {
    toolPath: "/outils/j-ai-clique",
    params: { situations: "situations", channel: "canal" },
    whatLegend: "Qu'avez-vous fait ? Cochez tout ce qui s'applique.",
    channelLegend: "Par où l'arnaque est-elle arrivée ? (facultatif)",
    channels: {
      sms: "SMS",
      email: "Email",
      call: "Appel",
      web: "Site web",
      qr: "QR code",
      other: "Autre",
    },
    submit: "Voir mon plan",
    none: "Cochez au moins une situation.",
    reset: "Recommencer",
    shared: "Plan partagé.",
    sharedBody: "Le lien ne contient que les situations cochées, rien d'autre.",
    urgentTitle: "D'abord : appelez votre banque",
    urgentBody:
      "De l'argent, une carte ou un code sont en jeu : appelez votre banque au numéro au dos de votre carte, maintenant. C'est la seule démarche où chaque minute compte.",
    plan: "Votre plan, dans l'ordre",
    planIntro:
      "Les étapes les plus urgentes d'abord. Cochez-les au fur et à mesure : rien n'est enregistré.",
    guide: "Le guide détaillé →",
    always: "Dans tous les cas, ensuite",
    next: "Pour reconnaître la prochaine fois",
    nextBody: (name: string) => `Ce qui vous est arrivé ressemble à : ${name}.`,
    attackCta: "Comprendre cette attaque",
    simulationCta: "S'entraîner sur un message de ce type →",
    print: "Imprimer le plan",
    share: "Envoyer le plan à un proche",
    copied: "Lien copié",
    shareTitle: "Que faire après une arnaque",
    shareText: "Les gestes à faire, dans l'ordre :",
    done: "fait",
  },
  en: {
    toolPath: "/en/tools/i-clicked",
    params: { situations: "situations", channel: "channel" },
    whatLegend: "What did you do? Tick everything that applies.",
    channelLegend: "How did the scam reach you? (optional)",
    channels: {
      sms: "Text message",
      email: "Email",
      call: "Phone call",
      web: "Website",
      qr: "QR code",
      other: "Other",
    },
    submit: "See my plan",
    none: "Tick at least one situation.",
    reset: "Start again",
    shared: "Shared plan.",
    sharedBody: "The link only contains the situations ticked, nothing else.",
    urgentTitle: "First: call your bank",
    urgentBody:
      "Money, a card or a code are involved: call your bank on the number on the back of your card, now. It's the only step where every minute counts.",
    plan: "Your plan, in order",
    planIntro:
      "The most urgent steps first. Tick them off as you go: nothing is stored.",
    guide: "The detailed guide →",
    always: "In every case, next",
    next: "To recognize it next time",
    nextBody: (name: string) => `What happened to you looks like: ${name}.`,
    attackCta: "Understand this attack",
    simulationCta: "Practise on a message like this →",
    print: "Print the plan",
    share: "Send the plan to someone close",
    copied: "Link copied",
    shareTitle: "What to do after a scam",
    shareText: "The steps to take, in order:",
    done: "done",
  },
} as const;

/**
 * « I clicked: what now? ». Two questions, then the steps from the
 * emergency checklist that apply, in order of urgency. Runs in the
 * browser; only situation codes ever reach the URL or an analytics event.
 */
export function IncidentAssistant({
  situations,
  always,
  attacksByChannel,
  locale = "fr",
}: {
  situations: AssistantSituation[];
  always: readonly string[];
  attacksByChannel: Partial<Record<IncidentChannel, AssistantAttack>>;
  locale?: Locale;
}) {
  const t = STRINGS[locale];
  const formId = useId();
  const [selected, setSelected] = useState<IncidentCode[]>([]);
  const [channel, setChannel] = useState<IncidentChannel | null>(null);
  const [plan, setPlan] = useState<{
    codes: IncidentCode[];
    channel: IncidentChannel | null;
    shared: boolean;
  } | null>(null);
  const [error, setError] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const tracking = useToolTracking("j-ai-clique", locale);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codes = decodeIncidentCodes(params.get(t.params.situations));
    const ch = params.get(t.params.channel) as IncidentChannel | null;
    const sharedChannel = ch && INCIDENT_CHANNELS.includes(ch) ? ch : null;
    if (codes.length === 0) {
      // Arriving from a fiche (`?canal=sms`): the channel is known, the
      // situation is not — preselect the one, ask the other.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
      if (sharedChannel) setChannel(sharedChannel);
      return;
    }
    setSelected(codes);
    setChannel(sharedChannel);
    setPlan({ codes, channel: sharedChannel, shared: true });
  }, [t]);

  function toggle(code: IncidentCode) {
    tracking.start();
    setSelected((current) =>
      current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code],
    );
  }

  return (
    <div>
      <form
        className="rounded-xl border border-border bg-card p-4 sm:p-6 print:hidden"
        onSubmit={(event) => {
          event.preventDefault();
          if (selected.length === 0) {
            setError(true);
            return;
          }
          setError(false);
          // Urgency order comes from the source list, not the click order.
          const codes = planCodes(selected);
          setPlan({ codes, channel, shared: false });
          tracking.complete();
          trackEvent({
            name: "incident_assistant_planned",
            props: {
              locale,
              situations: codes.join(","),
              situation_count: codes.length,
              channel: channel ?? "none",
            },
          });
          requestAnimationFrame(() => planRef.current?.focus());
        }}
      >
        <fieldset>
          <legend className="text-sm font-semibold">{t.whatLegend}</legend>
          <div className="mt-3 space-y-2">
            {situations.map((s) => {
              const id = `${formId}-${s.code}`;
              const checked = selected.includes(s.code);
              return (
                <label
                  key={s.code}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
                    checked
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary",
                  )}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(s.code)}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span>{s.choice}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">{t.channelLegend}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INCIDENT_CHANNELS.map((ch) => (
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

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {t.none}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            {t.submit}
          </Button>
          {(selected.length > 0 || plan) && (
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => {
                setSelected([]);
                setChannel(null);
                setPlan(null);
                setError(false);
                window.history.replaceState(null, "", t.toolPath);
              }}
            >
              {t.reset}
            </Button>
          )}
        </div>
      </form>

      <div
        ref={planRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-8 outline-none"
      >
        {plan && (
          <Plan
            codes={plan.codes}
            channel={plan.channel}
            shared={plan.shared}
            situations={situations}
            always={always}
            attack={plan.channel ? attacksByChannel[plan.channel] : undefined}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}

function Plan({
  codes,
  channel,
  shared,
  situations,
  always,
  attack,
  locale,
}: {
  codes: IncidentCode[];
  channel: IncidentChannel | null;
  shared: boolean;
  situations: AssistantSituation[];
  always: readonly string[];
  attack?: AssistantAttack;
  locale: Locale;
}) {
  const t = STRINGS[locale];
  const steps = situations.filter((s) => codes.includes(s.code));
  const urgent = codes.includes("banque") || codes.includes("argent");
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggleDone = (key: string) =>
    setDone((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="space-y-8">
      {shared && (
        <p className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground print:hidden">
          <strong className="text-foreground">{t.shared}</strong> {t.sharedBody}
        </p>
      )}

      {urgent && (
        <section
          aria-labelledby="urgent"
          className="rounded-xl border border-danger/40 bg-danger/10 p-5"
        >
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-6 shrink-0 text-danger" aria-hidden />
            <div>
              <h2 id="urgent" className="text-lg font-semibold">
                {t.urgentTitle}
              </h2>
              <p className="mt-1 text-sm">{t.urgentBody}</p>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="plan">
        <h2 id="plan" className="text-xl font-semibold">
          {t.plan}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground print:hidden">
          {t.planIntro}
        </p>
        <ol className="mt-4 space-y-5">
          {steps.map((s, index) => (
            <li
              key={s.code}
              className="break-inside-avoid rounded-lg border border-border p-4"
            >
              <h3 className="font-semibold">
                {index + 1}. {s.title}
              </h3>
              {s.note && (
                <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
              )}
              <ul className="mt-3 space-y-2">
                {s.actions.map((action) => {
                  const key = `${s.code}:${action}`;
                  const isDone = done.has(key);
                  return (
                    <li key={action}>
                      <label className="flex cursor-pointer items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleDone(key)}
                          className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
                          aria-label={`${action} — ${t.done}`}
                        />
                        <span
                          className={cn(
                            isDone && "text-muted-foreground line-through",
                          )}
                        >
                          {action}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {s.guideHref && (
                <p className="mt-3 text-sm print:hidden">
                  <Link
                    prefetch={false}
                    href={s.guideHref}
                    className="text-primary hover:underline"
                    onClick={() =>
                      trackEvent({
                        name: "incident_assistant_cta_clicked",
                        props: { target: "guide" },
                      })
                    }
                  >
                    {t.guide}
                  </Link>
                </p>
              )}
              {s.tool && (
                <p className="mt-2 text-sm print:hidden">
                  <Link
                    prefetch={false}
                    href={s.tool.href}
                    className="text-primary hover:underline"
                    onClick={() =>
                      trackEvent({
                        name: "incident_assistant_cta_clicked",
                        props: { target: "tool" },
                      })
                    }
                  >
                    {s.tool.label} →
                  </Link>
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="always"
        className="break-inside-avoid rounded-lg border border-border p-4"
      >
        <h2 id="always" className="text-lg font-semibold">
          {t.always}
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground print:text-foreground">
          {always.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {attack && (
        <section
          aria-labelledby="next-time"
          className="rounded-lg border border-border bg-card p-4 print:hidden"
        >
          <h2 id="next-time" className="text-lg font-semibold">
            {t.next}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.nextBody(attack.name)}
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <Link
              prefetch={false}
              href={attack.href}
              className="font-medium text-primary hover:underline"
              onClick={() =>
                trackEvent({
                  name: "incident_assistant_cta_clicked",
                  props: { target: "attack" },
                })
              }
            >
              {t.attackCta}
            </Link>
            {attack.simulationHref && (
              <Link
                prefetch={false}
                href={attack.simulationHref}
                className="font-medium text-primary hover:underline"
                onClick={() =>
                  trackEvent({
                    name: "incident_assistant_cta_clicked",
                    props: { target: "simulation" },
                  })
                }
              >
                {t.simulationCta}
              </Link>
            )}
          </div>
        </section>
      )}

      <SharePlan codes={codes} channel={channel} locale={locale} />
    </div>
  );
}

function SharePlan({
  codes,
  channel,
  locale,
}: {
  codes: IncidentCode[];
  channel: IncidentChannel | null;
  locale: Locale;
}) {
  const t = STRINGS[locale];
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams({
    [t.params.situations]: codes.join(","),
  });
  if (channel) params.set(t.params.channel, channel);
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  async function share() {
    const url = `${window.location.origin}${t.toolPath}?${params.toString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t.shareTitle, text: t.shareText, url });
        trackEvent({
          name: "incident_assistant_shared",
          props: { method: "share", situation_count: codes.length },
        });
      } catch {
        // Cancelled by the visitor.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent({
        name: "incident_assistant_shared",
        props: { method: "copy", situation_count: codes.length },
      });
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row print:hidden">
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => {
          trackEvent({
            name: "incident_assistant_printed",
            props: { situation_count: codes.length },
          });
          window.print();
        }}
      >
        <Printer className="size-4" aria-hidden />
        {t.print}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={share}
      >
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : canShare ? (
          <Share2 className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {copied ? t.copied : t.share}
      </Button>
    </div>
  );
}
