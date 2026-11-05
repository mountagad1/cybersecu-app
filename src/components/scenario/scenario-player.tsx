"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ScenarioFrame } from "@/components/scenario/scenario-frame";
import { DecisionOption } from "@/components/scenario/decision-option";
import { ExplanationPanel } from "@/components/scenario/explanation-panel";
import { CONFETTI_DURATION_MS } from "@/components/scenario/confetti-burst";
import { StreakChip } from "@/components/scenario/streak-chip";
import { StreakMilestoneToast } from "@/components/scenario/streak-milestone-toast";
import { QuotaIndicator } from "@/components/quota/quota-indicator";
import { Paywall } from "@/components/paywall/paywall";
import { Dialog } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isStreakMilestone, recordSessionAnswer, type SessionScore } from "@/lib/sessionScore";
import type { QuotaState } from "@/domain/quota/checkQuota";
import type { PublicScenario, ScenarioExplanation } from "@/domain/scenario/types";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { trackAttrs, trackEvent } from "@/lib/analytics";

const MILESTONE_TOAST_DURATION_MS = 3200;

type AnswerState =
  | { status: "unanswered" }
  | { status: "submitting" }
  | { status: "answered"; correct: boolean; explanation: ScenarioExplanation | null }
  | { status: "error"; message: string };

/** What `GET /api/simulations/next` hands back once an answer is graded. */
interface NextSuggestion {
  slug: string;
  impersonatedEntity: string;
}

/**
 * Plays a scenario. No login required (docs/NO_LOGIN_ARCHITECTURE.md):
 * the API routes resolve the caller's identity themselves (Supabase Auth
 * session or anonymous session cookie) — this component just calls them
 * and reacts to what comes back, including a quota-exhausted response
 * that swaps the decision UI for the paywall.
 */
export function ScenarioPlayer({
  scenario,
  initialQuota,
  locale = "fr",
  signalsHref,
}: {
  scenario: PublicScenario;
  initialQuota: QuotaState & { hasEntitlement: boolean };
  locale?: Locale;
  /** The fiche's « signaux d'alerte » section, shown once the answer is graded. */
  signalsHref?: string;
}) {
  const t = getUiStrings(locale).player;
  const prefix = localePrefix(locale);
  const [state, setState] = useState<AnswerState>({ status: "unanswered" });
  const [quota, setQuota] = useState(initialQuota);
  const [next, setNext] = useState<NextSuggestion | null>(null);
  // Starts at zero rather than reading `sessionStorage` on mount: this
  // component is server-rendered as part of the static page, so an eager
  // read would show a real number on the client and zero on the server —
  // a hydration mismatch. `recordSessionAnswer()` already folds in
  // whatever was stored from earlier simulations in this tab, so the
  // score is correct the moment the visitor answers this one; it is
  // simply not shown before that.
  const [score, setScore] = useState<SessionScore>({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  // Increments on every graded answer so the verdict animation (keyed on
  // this) replays each time, even when `state.correct` repeats the same
  // value as last time.
  const [answerKey, setAnswerKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebratingMilestone, setCelebratingMilestone] = useState<number | null>(null);
  const milestoneTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Dismissing the popup never un-blocks the exercise (the server would
  // refuse the attempt anyway) — it only stops interrupting the visitor;
  // the small card behind it stays, with its own button to reopen it.
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const paywallTitleId = useId();
  const [shareNote, setShareNote] = useState(false);

  useEffect(() => {
    return () => {
      if (milestoneTimeout.current) clearTimeout(milestoneTimeout.current);
    };
  }, []);

  // The page around this player is statically rendered, so `initialQuota`
  // is the default full quota baked in at build time rather than this
  // visitor's real state. Refresh it on mount. Enforcement never depends
  // on this value: the attempt routes re-check the quota server-side, so
  // a stale or failed read here can only affect what is displayed.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/quota")
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh) => {
        if (!cancelled && fresh) setQuota(fresh);
      })
      .catch(() => {
        // Deliberately silent: a failed quota read must not block the
        // exercise, and the server still refuses an over-quota attempt.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const blocked = quota.exhausted && !quota.hasEntitlement;

  // `premium_intent`: the visitor has used the free quota and is shown the
  // offer. Counted once per page, when the paywall first appears.
  const paywallShown = useRef(false);
  useEffect(() => {
    if (!blocked || paywallShown.current) return;
    paywallShown.current = true;
    trackEvent({ name: "premium_intent", props: { locale, trigger: "quota_exhausted" } });
  }, [blocked, locale]);

  const simulationProps = {
    simulation: scenario.scenarioCode,
    attack_code: scenario.attackCode,
    locale,
  } as const;

  /** Shares the exercise itself — its URL, never the visitor's answer. */
  async function shareExercise() {
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        trackEvent({ name: "simulation_shared", props: { simulation: scenario.scenarioCode, method: "share" } });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote(true);
      trackEvent({ name: "simulation_shared", props: { simulation: scenario.scenarioCode, method: "copy" } });
    } catch {
      // Cancelled share sheet or no clipboard access: nothing to do.
    }
  }

  /**
   * Asks the adaptive selector what to play next (docs/LEARNING_ENGINE.md §3).
   * Fire-and-forget on purpose: the explanation is the point of this screen,
   * and a failed suggestion should cost the visitor nothing but the extra
   * link. Any failure just leaves `next` null and the CTA unrendered.
   */
  async function loadNext() {
    try {
      const res = await fetch(
        `/api/simulations/next?exclude=${encodeURIComponent(scenario.scenarioVersionId)}&locale=${locale}`,
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.next?.slug) setNext(data.next);
    } catch {
      // No next-step suggestion; the explanation panel still stands alone.
    }
  }

  async function submit(choiceId: string) {
    setState({ status: "submitting" });
    try {
      const startRes = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioVersionId: scenario.scenarioVersionId }),
      });
      if (startRes.status === 403) {
        const { quota: newQuota } = await startRes.json();
        setQuota({ ...newQuota, hasEntitlement: false });
        setState({ status: "unanswered" });
        return;
      }
      if (startRes.status === 503) {
        setState({ status: "error", message: t.serviceUnavailable });
        return;
      }
      if (!startRes.ok) throw new Error("start-failed");
      const { attemptId } = await startRes.json();
      trackEvent({ name: "simulation_start", props: simulationProps });

      const answerRes = await fetch(`/api/attempts/${attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choiceId }),
      });
      if (answerRes.status === 403) {
        const { quota: newQuota } = await answerRes.json();
        setQuota({ ...newQuota, hasEntitlement: false });
        setState({ status: "unanswered" });
        return;
      }
      if (answerRes.status === 503) {
        setState({ status: "error", message: t.serviceUnavailable });
        return;
      }
      if (!answerRes.ok) throw new Error("answer-failed");
      const data = await answerRes.json();
      setQuota(data.quota ? { ...data.quota, hasEntitlement: data.hasEntitlement } : quota);
      setState({ status: "answered", correct: data.correct, explanation: data.explanation });
      trackEvent({ name: "simulation_complete", props: { ...simulationProps, correct: Boolean(data.correct) } });
      setAnswerKey((k) => k + 1);

      const newScore = recordSessionAnswer(data.correct);
      setScore(newScore);

      if (data.correct) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), CONFETTI_DURATION_MS);
      }

      if (isStreakMilestone(newScore.streak)) {
        if (milestoneTimeout.current) clearTimeout(milestoneTimeout.current);
        setCelebratingMilestone(newScore.streak);
        milestoneTimeout.current = setTimeout(
          () => setCelebratingMilestone(null),
          MILESTONE_TOAST_DURATION_MS,
        );
      }

      void loadNext();
    } catch {
      setState({ status: "error", message: t.genericError });
    }
  }

  if (blocked && state.status !== "answered") {
    return (
      <>
        <Dialog open={!paywallDismissed} onClose={() => setPaywallDismissed(true)} titleId={paywallTitleId}>
          <Paywall locale={locale} titleId={paywallTitleId} />
        </Dialog>
        {paywallDismissed && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-border bg-muted p-5">
            <p className="text-sm text-muted-foreground">{t.quotaExhaustedPrompt}</p>
            <Button
              onClick={() => {
                setPaywallDismissed(false);
                trackEvent({ name: "premium_intent", props: { locale, trigger: "reopened" } });
              }}
            >
              {getUiStrings(locale).paywall.unlockCta}
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {!quota.hasEntitlement && <QuotaIndicator used={quota.used} limit={quota.limit} locale={locale} />}

      <ScenarioFrame content={scenario.content} impersonatedEntity={scenario.impersonatedEntity} locale={locale} />

      {state.status !== "answered" && (
        <fieldset className="flex flex-col gap-3" disabled={state.status === "submitting"}>
          <legend className="mb-1 text-base font-semibold">{t.whatDoYouDo}</legend>
          {scenario.choices.map((choice) => (
            <DecisionOption key={choice.id} label={choice.label} onSelect={() => submit(choice.id)} />
          ))}
        </fieldset>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-start gap-3">
          <Alert tone="warning" locale={locale}>{state.message}</Alert>
          <Button variant="outline" onClick={() => setState({ status: "unanswered" })}>
            {t.retry}
          </Button>
        </div>
      )}

      {state.status === "answered" && (
        <>
          <motion.div
            key={answerKey}
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <ExplanationPanel
              correct={state.correct}
              explanation={state.explanation}
              celebrate={showConfetti}
              locale={locale}
            />
          </motion.div>

          <StreakMilestoneToast milestone={celebratingMilestone} locale={locale} />

          {score.total > 0 && (
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{t.score(score.correct, score.total)}</span>
              <StreakChip streak={score.streak} locale={locale} />
            </p>
          )}

          {!state.correct && <Alert tone="info" locale={locale}>{t.encouragement}</Alert>}

          {/* LEARN, then SHARE: the warning signs on the fiche, and the
              exercise itself to pass on (docs/growth/SEO_TO_PRODUCT_FUNNEL.md). */}
          <div className="flex flex-col items-start gap-2 text-sm">
            {signalsHref && (
              <Link
                href={signalsHref}
                className="font-medium text-primary hover:underline"
                {...trackAttrs({
                  name: "funnel_cta_click",
                  props: { from: "simulation", cta: "review_signals", attack_code: scenario.attackCode },
                })}
              >
                {state.correct ? t.reviewSignalsRecap : t.reviewSignalsMissed} →
              </Link>
            )}
            <button type="button" onClick={shareExercise} className="text-primary hover:underline">
              {t.shareExercise}
            </button>
            {shareNote && (
              <p className="text-muted-foreground" role="status">
                {t.shareCopied}
              </p>
            )}
          </div>

          <div className="flex flex-col items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center">
            {!state.correct && (
              <Button
                size="lg"
                onClick={() => setState({ status: "unanswered" })}
                className="h-auto min-h-11 w-full whitespace-normal py-3 text-center sm:w-auto"
              >
                {t.restartSimulation}
              </Button>
            )}
            {next ? (
              <Link
                href={`${prefix}/simulations/${next.slug}`}
                {...trackAttrs({
                  name: "funnel_cta_click",
                  props: { from: "simulation", cta: "next_simulation", attack_code: scenario.attackCode },
                })}
                className={cn(
                  buttonVariants({ size: state.correct ? "lg" : "default", variant: state.correct ? "default" : "outline" }),
                  "h-auto min-h-11 w-full whitespace-normal py-3 text-center sm:w-auto",
                )}
              >
                {state.correct ? t.nextSimulation : t.orTry}
                {next.impersonatedEntity}
              </Link>
            ) : null}
            <Link
              href={`${prefix}/simulations`}
              className={cn(
                buttonVariants({ variant: "outline", size: state.correct ? "lg" : "default" }),
                "h-auto min-h-11 w-full whitespace-normal py-3 text-center sm:w-auto",
              )}
            >
              {t.allSimulations}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
