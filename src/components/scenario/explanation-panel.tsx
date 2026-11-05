import { Alert } from "@/components/ui/alert";
import { RiskIndicator } from "@/components/scenario/risk-indicator";
import { ConfettiBurst } from "@/components/scenario/confetti-burst";
import type { ScenarioExplanation } from "@/domain/scenario/types";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

/**
 * Explains what happened, why it was dangerous, and the reflex to build
 * next time — never a shaming "wrong" verdict (brief §14). Shown on both
 * correct and incorrect answers so the loop teaches either way.
 *
 * `explanation` is nullable because grading returns `null` for a choice with
 * no authored entry in `scenario_versions.explanations`
 * (src/domain/mistakes/classify.ts). Migration 0004 now rejects such a row at
 * write time, but data written before it exists, so the verdict still renders
 * without the detail rather than throwing on `explanation.technique` and
 * blanking the page *after* the attempt was graded and the quota consumed.
 */
export function ExplanationPanel({
  correct,
  explanation,
  celebrate = false,
  locale = "fr",
}: {
  correct: boolean;
  explanation: ScenarioExplanation | null;
  /** Fires a small confetti pop anchored on the verdict badge above. */
  celebrate?: boolean;
  locale?: Locale;
}) {
  const t = getUiStrings(locale).explanation;
  const ts = getUiStrings(locale).player;
  return (
    <div className="flex flex-col gap-4">
      <span className="relative inline-flex w-fit">
        {celebrate && <ConfettiBurst />}
        <RiskIndicator isDangerous={!correct} label={correct ? ts.goodReflex : ts.dangerousChoice} />
      </span>

      {!explanation && <Alert tone="info" locale={locale}>{t.noExplanationAvailable}</Alert>}
      {explanation && (
        <>
          <Alert tone={correct ? "success" : "danger"} title={t.techniqueUsed} locale={locale}>
            {explanation.technique}
          </Alert>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-foreground">{t.indicator}</dt>
              <dd className="text-muted-foreground">{explanation.indicator}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">{t.whyImportant}</dt>
              <dd className="text-muted-foreground">{explanation.whyDangerous}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">{t.reflex}</dt>
              <dd className="text-muted-foreground">{explanation.reflex}</dd>
            </div>
          </dl>
        </>
      )}
    </div>
  );
}
