"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, type Locale } from "@/lib/analytics";

/**
 * Prints the page. With `tool`, printing counts as that tool's result
 * (`tool_complete`, action `print`) — for a checklist, printing is the use.
 */
export function PrintButton({
  label,
  tool,
  locale = "fr",
}: {
  label: string;
  tool?: string;
  locale?: Locale;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        if (tool) trackEvent({ name: "tool_complete", props: { tool, locale, action: "print" } });
        window.print();
      }}
      className="print:hidden"
    >
      <Printer className="size-4" aria-hidden />
      {label}
    </Button>
  );
}
