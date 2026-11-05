import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A native `<input type="checkbox">`, styled to match the rest of the
 * design system rather than pulling in a headless-UI dependency for one
 * control. Deliberately plain: no indeterminate state, no custom keyboard
 * handling — the browser already gets those right for a checkbox.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4 shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";
