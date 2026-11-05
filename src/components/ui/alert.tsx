import * as React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/domain/i18n/locale";

export type AlertTone = "info" | "success" | "danger" | "warning";

const toneStyles: Record<AlertTone, string> = {
  info: "border-primary/30 bg-primary/5 text-foreground",
  success: "border-success/40 bg-success/10 text-foreground",
  danger: "border-danger/40 bg-danger/10 text-foreground",
  warning: "border-warning/40 bg-warning/10 text-foreground",
};

const toneIcon: Record<AlertTone, React.ReactNode> = {
  info: <Info className="size-5 shrink-0 text-primary" aria-hidden />,
  success: <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />,
  danger: <AlertTriangle className="size-5 shrink-0 text-danger" aria-hidden />,
  warning: <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />,
};

const toneLabel: Record<Locale, Record<AlertTone, string>> = {
  fr: {
    info: "Information",
    success: "Bonne réponse",
    danger: "Attention, danger",
    warning: "Avertissement",
  },
  en: {
    info: "Information",
    success: "Right answer",
    danger: "Warning, danger",
    warning: "Warning",
  },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  locale = "fr",
}: {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
  locale?: Locale;
}) {
  const label = toneLabel[locale][tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border p-4", toneStyles[tone], className)}
    >
      {toneIcon[tone]}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">
          <span className="sr-only">{locale === "fr" ? `${label} : ` : `${label}: `}</span>
          {title ?? label}
        </p>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
