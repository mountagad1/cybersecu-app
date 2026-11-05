import "server-only";
import { readEnv } from "@/lib/env/read";

/**
 * Minimal Resend wrapper for the one transactional email this product
 * sends: the access-restoration link. Throws a clear configuration
 * error if `RESEND_API_KEY` is unset rather than silently pretending to
 * send — this environment has no email provider credentials configured,
 * so the send path is implemented but not yet exercisable end-to-end
 * (docs/PAYMENT_ENTITLEMENT.md §4, docs/decisions/0005).
 */
export async function sendRecoveryEmail(to: string, restoreUrl: string): Promise<void> {
  const apiKey = readEnv("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY — access-restoration email cannot be sent until an email provider is configured.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: readEnv("RESEND_FROM_EMAIL") ?? "cybersecu.app <noreply@cybersecu.app>",
      to,
      subject: "Restaurer votre accès cybersecu.app",
      html: `<p>Cliquez sur le lien ci-dessous pour restaurer votre accès (valable 30 minutes) :</p><p><a href="${restoreUrl}">${restoreUrl}</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send recovery email: ${response.status}`);
  }
}
