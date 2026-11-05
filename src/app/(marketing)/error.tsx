"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Error boundary for every public marketing route.
 *
 * Before this existed there was NO error boundary anywhere in the app
 * (docs/BLANK_PAGES_ROOT_CAUSE.md). A throw in a Server Component — a missing
 * Supabase env var, an unapplied migration, a rejected read — fell through to
 * Next.js's built-in production error screen, which renders essentially
 * nothing. That is what "the page is blank" looked like from outside: a real
 * failure with no visible symptom and no recovery path.
 *
 * This never shows the raw error to the visitor (it can carry schema details),
 * but it does surface the digest, which is the key that ties the page a user
 * saw to a specific stack trace in the platform's function logs.
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side breadcrumb. The authoritative, structured record is emitted
    // server-side by the repository layer.
    console.error("[cybersecu] render error", { digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-warning/10">
        <AlertTriangle className="size-7 text-warning" aria-hidden />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-balance">
        Cette page n&apos;a pas pu être chargée
      </h1>

      <p className="mt-3 text-muted-foreground text-balance">
        Le contenu est temporairement indisponible. Il s&apos;agit d&apos;un problème de notre
        côté, pas d&apos;une erreur de votre part.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button onClick={reset} className={buttonVariants({ className: "w-full sm:w-auto" })}>
          Réessayer
        </button>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Deliberately an external link to the national authority rather than
          an internal page: if this boundary is showing, the site's own data
          layer is already failing, so an internal link is the least reliable
          thing to offer someone who may be mid-incident. */}
      <p className="mt-10 text-sm text-muted-foreground">
        Si vous êtes actuellement confronté à une arnaque, ne restez pas bloqué ici :{" "}
        <a
          href="https://www.cybermalveillance.gouv.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          cybermalveillance.gouv.fr
        </a>{" "}
        assiste les victimes.
      </p>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Référence : {error.digest}
        </p>
      )}
    </div>
  );
}
