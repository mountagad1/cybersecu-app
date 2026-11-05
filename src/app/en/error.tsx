"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Error boundary for every English route — mirror of `(marketing)/error.tsx`,
 * which explains why it exists.
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
export default function EnglishError({
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
        This page could not be loaded
      </h1>

      <p className="mt-3 text-muted-foreground text-balance">
        The content is temporarily unavailable. The problem is on our side, not
        something you did.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button onClick={reset} className={buttonVariants({ className: "w-full sm:w-auto" })}>
          Try again
        </button>
        <Link
          href="/en"
          className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}
        >
          Back to the homepage
        </Link>
      </div>

      {/* No link here: the French page points to the French national
          service, and no single equivalent exists for an English reader. */}
      <p className="mt-10 text-sm text-muted-foreground">
        If you are dealing with a scam right now, don&apos;t stay stuck here: call your bank
        first, then your country&apos;s official fraud-reporting service.
      </p>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
