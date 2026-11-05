import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

export function DifficultyBadge({
  difficulty,
  locale = "fr",
}: {
  difficulty: 1 | 2 | 3 | 4 | 5;
  locale?: Locale;
}) {
  const label = getUiStrings(locale).difficulty[difficulty];
  return (
    <Badge variant="outline" aria-label={`${locale === "en" ? "Difficulty level" : "Niveau de difficulté"} : ${label}`}>
      {"●".repeat(difficulty)}
      {"○".repeat(5 - difficulty)}
      <span className="ml-1">{label}</span>
    </Badge>
  );
}
