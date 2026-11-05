import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Never communicates risk with color alone: always pairs an icon with an
 * explicit text label (brief §1.5).
 */
export function RiskIndicator({
  isDangerous,
  label,
}: {
  isDangerous: boolean;
  label: string;
}) {
  const Icon = isDangerous ? ShieldAlert : ShieldCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium",
        isDangerous ? "text-danger" : "text-success",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </span>
  );
}
