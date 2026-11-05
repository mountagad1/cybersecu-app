import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { serviceUnconfiguredResponse } = await import("@/app/api/_lib/configurationGuard");
const { EnvConfigurationError } = await import("@/lib/env/read");

describe("serviceUnconfiguredResponse", () => {
  it("répond 503 pour une variable manquante, sans la nommer au client", async () => {
    const res = serviceUnconfiguredResponse(
      new EnvConfigurationError("ANON_SESSION_SECRET", ["ANON_SESSION_SECRET"]),
    );
    expect(res?.status).toBe(503);

    const body = await res!.json();
    expect(body.error).toBe("service_unconfigured");
    // Le client n'a pas à connaître la configuration du serveur.
    expect(JSON.stringify(body)).not.toContain("ANON_SESSION_SECRET");
  });

  it("laisse remonter toute autre erreur plutôt que de l'avaler", () => {
    expect(serviceUnconfiguredResponse(new Error("la base est tombée"))).toBeNull();
    expect(serviceUnconfiguredResponse({ code: "42P01" })).toBeNull();
  });
});
