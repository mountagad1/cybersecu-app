import { cn } from "@/lib/utils";

export function DecisionOption({
  label,
  onSelect,
  disabled,
}: {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-4 text-left text-base transition-colors",
        "hover:border-primary hover:bg-primary/5 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {label}
    </button>
  );
}
