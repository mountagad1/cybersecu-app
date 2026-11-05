import "server-only";
import { NextResponse } from "next/server";
import { EnvConfigurationError } from "@/lib/env/read";
import { log } from "@/infra/observability/log";

/**
 * Traduit une panne de CONFIGURATION en réponse honnête, sans jamais l'avaler.
 *
 * Retourne `null` si l'erreur n'en est pas une : l'appelant relance alors, et
 * une vraie panne applicative continue de remonter en 500. Rien n'est masqué —
 * l'échec est journalisé, classé, et le statut reste non-2xx.
 *
 * Le nom de la variable est journalisé, jamais sa valeur (elle n'a pas été lue :
 * elle est absente). Le corps renvoyé au client ne le nomme pas : un visiteur
 * n'a pas à connaître la configuration du serveur.
 */
export function serviceUnconfiguredResponse(error: unknown): NextResponse | null {
  if (!(error instanceof EnvConfigurationError)) return null;

  log.error("api.service_unconfigured", {
    kind: "CONFIGURATION_ERROR",
    variable: error.variable,
    message: error.message,
  });

  return NextResponse.json(
    {
      error: "service_unconfigured",
      message:
        "Cette fonctionnalité n'est pas encore disponible : le service n'est pas complètement configuré.",
    },
    { status: 503 },
  );
}
