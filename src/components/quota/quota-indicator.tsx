import { Progress } from "@/components/ui/progress";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

/**
 * Factual usage display, not a countdown — docs/SIMULATION_QUOTA.md §4:
 * "Avoid aggressive countdowns."
 */
export function QuotaIndicator({
  used,
  limit,
  locale = "fr",
}: {
  used: number;
  limit: number;
  locale?: Locale;
}) {
  // `anonymous_sessions.quota_limit` is an operator-editable column, so a
  // zero is a reachable state rather than a hypothetical. Dividing by it
  // yields NaN, which React writes into the style attribute as `width: NaN%`
  // — the bar then renders at full width, i.e. the exact opposite of "no free
  // simulations left".
  const percent = limit > 0 ? (used / limit) * 100 : 100;
  const label = getUiStrings(locale).quota.used(used, limit);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Progress value={percent} label={label} />
    </div>
  );
}
