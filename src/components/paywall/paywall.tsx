"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { trackEvent } from "@/lib/analytics";
import { SALES_OPEN } from "@/lib/sales";

/**
 * Shown once the free quota is exhausted (docs/PAYMENT_ENTITLEMENT.md §3).
 * Copy follows the brief's rules exactly: "Débloquer", never
 * "S'abonner"; explicit "paiement unique" / "aucun abonnement"; no fake
 * urgency or countdowns.
 *
 * The consent checkbox exists because the unlock is digital content
 * delivered immediately (the entitlement grants access the moment the
 * webhook lands, well inside the statutory 14-day withdrawal window) —
 * EU/French consumer law (art. L221-28 13° du Code de la consommation)
 * requires the buyer's explicit, prior consent to that immediate
 * execution and their express waiver of the withdrawal right before the
 * contract can be formed on those terms; without it a buyer could still
 * demand a refund at any point in the following 14 days regardless of
 * how much of the content they used. `consentImmediateExecution` is sent
 * to `/api/checkout`, which logs it server-timestamped and returns the
 * Stripe Payment Link URL to redirect to (docs/PAYMENT_ENTITLEMENT.md §2)
 * — a Payment Link has no per-visitor metadata of its own to carry this.
 */
export function Paywall({ locale = "fr", titleId }: { locale?: Locale; titleId?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const consentId = useId();
  const t = getUiStrings(locale).paywall;
  const prefix = localePrefix(locale);

  async function startCheckout() {
    setStatus("loading");
    trackEvent({ name: "checkout_start", props: { locale } });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentImmediateExecution: true }),
      });
      if (!res.ok) throw new Error("checkout-failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setStatus("error");
    }
  }

  // Sales suspended (src/lib/sales.ts): say so plainly — no price, no button
  // for something that can't be bought. Earlier buyers can still restore.
  if (!SALES_OPEN) {
    return (
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 text-center">
        <div>
          <h2 id={titleId} className="text-xl font-bold">
            {t.closedTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.closedDescription}</p>
        </div>
        <Link href={`${prefix}/restaurer`} className="text-sm text-muted-foreground underline">
          {t.alreadyPurchased}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 text-center">
      <div>
        <h2 id={titleId} className="text-xl font-bold">
          {t.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{t.description}</p>
      </div>

      <ul className="mx-auto flex flex-col gap-2 text-left text-sm">
        {t.included.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div>
        <p className="text-3xl font-bold">29 €</p>
        <p className="text-sm text-muted-foreground">{t.priceNote}</p>
      </div>

      <label htmlFor={consentId} className="flex items-start gap-2 text-left text-sm text-muted-foreground">
        <Checkbox
          id={consentId}
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          {t.consentPrefix}
          <Link href={`${prefix}/conditions-utilisation#retractation`} className="underline">
            {t.learnMore}
          </Link>
          {t.consentSuffix}
        </span>
      </label>

      <Button size="lg" onClick={startCheckout} disabled={status === "loading" || !consent}>
        {status === "loading" ? t.redirecting : t.unlockCta}
      </Button>

      {status === "error" && (
        <Alert tone="warning" locale={locale}>
          {t.errorPrefix}
          <Link href={`${prefix}/restaurer`} className="underline">
            {t.restoreCta}
          </Link>
          {t.errorSuffix}
        </Alert>
      )}

      <Link href={`${prefix}/restaurer`} className="text-sm text-muted-foreground underline">
        {t.alreadyPurchased}
      </Link>
    </div>
  );
}
