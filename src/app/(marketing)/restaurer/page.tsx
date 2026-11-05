"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function RestoreForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) return <VerifyToken token={token} />;
  return <RequestEmail />;
}

function RequestEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/access/restore-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      // Always show the same confirmation regardless of outcome — no
      // account-enumeration signal (docs/PAYMENT_ENTITLEMENT.md §4).
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <Alert tone="success" title="Email envoyé si un accès existe">
        Si cette adresse est associée à un accès actif, vous allez recevoir un lien pour le
        restaurer sur cet appareil. Vérifiez vos emails (et vos spams).
      </Alert>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label htmlFor="email" className="text-sm font-medium">
        Adresse email utilisée lors de l&apos;achat
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-lg border border-border bg-card px-3 text-base"
        placeholder="vous@exemple.fr"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Envoi…" : "Recevoir le lien de restauration"}
      </Button>
    </form>
  );
}

function VerifyToken({ token }: { token: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "sign_in_required" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/access/restore-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) return setStatus("success");
        const data = await res.json().catch(() => ({}));
        setStatus(data.error === "sign_in_required" ? "sign_in_required" : "error");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading") {
    return <p className="text-muted-foreground">Vérification en cours…</p>;
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden />
        <p>Votre accès a été restauré sur cet appareil.</p>
        <Link href="/simulations" className="font-semibold text-primary underline">
          Continuer l&apos;entraînement
        </Link>
      </div>
    );
  }

  if (status === "sign_in_required") {
    return (
      <Alert tone="info" title="Connexion requise">
        Cet accès a été acheté avec un compte. Connectez-vous avec ce compte pour le retrouver.
      </Alert>
    );
  }

  return (
    <Alert tone="warning" title="Lien invalide ou expiré">
      Ce lien de restauration n&apos;est plus valide.{" "}
      <Link href="/restaurer" className="underline">
        Demander un nouveau lien
      </Link>
      .
    </Alert>
  );
}

export default function RestorePage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold">Restaurer mon accès</h1>
      <p className="mt-2 text-muted-foreground">
        Vous avez déjà acheté l&apos;accès complet sur un autre appareil ? Restaurez-le ici, sans
        mot de passe.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
          <RestoreForm />
        </Suspense>
      </div>
    </div>
  );
}
