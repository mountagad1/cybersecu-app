"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { trackEvent } from "@/lib/analytics";

/** One `purchase` per page load, however many polls confirm it. */
let purchaseCounted = false;

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15; // ~30s — Stripe webhooks normally land in a couple of seconds

/**
 * Never grants access itself — only reflects state already granted by
 * the webhook (docs/PAYMENT_ENTITLEMENT.md §2). Polls /api/quota until
 * `hasEntitlement` flips true, since the webhook can arrive slightly
 * after the browser is redirected back here.
 */
export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<"waiting" | "confirmed" | "timeout">("waiting");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      if (cancelled) return;
      attempts += 1;
      try {
        const res = await fetch("/api/quota");
        const data = await res.json();
        if (data.hasEntitlement) {
          setStatus("confirmed");
          // Counted when the entitlement is confirmed, not on redirect. A
          // later revisit would count again; nothing links here except the
          // checkout return, so that stays marginal (ANALYTICS_EVENT_MODEL.md).
          if (!purchaseCounted) {
            purchaseCounted = true;
            trackEvent({
              name: "purchase",
              props: { locale: document.documentElement.lang === "en" ? "en" : "fr" },
            });
          }
          return;
        }
      } catch {
        // keep polling — a transient network error shouldn't end the wait
      }
      if (attempts >= MAX_POLLS) {
        setStatus("timeout");
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      {status === "waiting" && (
        <>
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <h1 className="text-xl font-bold">Confirmation de votre paiement…</h1>
          <p className="text-muted-foreground">Cela prend généralement quelques secondes.</p>
        </>
      )}

      {status === "confirmed" && (
        <>
          <CheckCircle2 className="size-10 text-success" aria-hidden />
          <h1 className="text-xl font-bold">Accès débloqué</h1>
          <p className="text-muted-foreground">
            Toutes les simulations, actuelles et futures, sont maintenant accessibles.
          </p>
          <Link href="/simulations" className={buttonVariants({ size: "lg" })}>
            Continuer l&apos;entraînement
          </Link>
        </>
      )}

      {status === "timeout" && (
        <Alert tone="warning" title="Confirmation en attente">
          Le paiement est en cours de traitement. Si votre accès n&apos;apparaît pas dans quelques
          minutes,{" "}
          <Link href="/restaurer" className="underline">
            essayez de le restaurer ici
          </Link>{" "}
          ou contactez-nous.
        </Alert>
      )}
    </div>
  );
}
