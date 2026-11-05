import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PublicScenario } from "@/domain/scenario/types";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

/**
 * Renders the simulated message chrome (SMS/email/call/web/QR) so the
 * scenario feels like a real message the user might receive (brief §13).
 */
export function ScenarioFrame({
  content,
  impersonatedEntity,
  locale = "fr",
}: Pick<PublicScenario, "content" | "impersonatedEntity"> & { locale?: Locale }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center gap-2 border-b border-border bg-muted">
        <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-sm font-medium text-muted-foreground">
          {getUiStrings(locale).scenarioFrame.newMessage} · {impersonatedEntity}
        </span>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm font-semibold text-foreground">{content.sender}</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed">{content.body}</p>
      </CardContent>
    </Card>
  );
}
