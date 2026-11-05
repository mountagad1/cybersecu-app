import "server-only";
import { requireEnv, readEnv } from "@/lib/env/read";

/**
 * Thin fetch wrapper for Dograh's REST API (docs/api-reference/overview.mdx
 * in dograh-hq/dograh — base path `/api/v1`, auth via `X-API-Key`).
 *
 * Lazily constructed like `getStripeClient()`
 * (src/infra/stripe/client.ts): importing this module must not throw at
 * build time in an environment without `DOGRAH_API_KEY` configured — only
 * calling `dograhFetch()` from a request does.
 */

const DEFAULT_BASE_URL = "https://app.dograh.com";

export class DograhApiError extends Error {
  readonly status: number;
  constructor(status: number, detail: string) {
    super(`Dograh API error ${status}: ${detail}`);
    this.name = "DograhApiError";
    this.status = status;
  }
}

export function getDograhBaseUrl(): string {
  return readEnv("DOGRAH_BASE_URL") ?? DEFAULT_BASE_URL;
}

/**
 * Throws `EnvConfigurationError` (src/lib/env/read.ts) if `DOGRAH_API_KEY`
 * is absent — the same class `serviceUnconfiguredResponse` already knows
 * how to turn into a clean 503, so no new error-handling path is needed
 * at the route layer.
 */
export async function dograhFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = requireEnv("DOGRAH_API_KEY");
  const baseUrl = getDograhBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new DograhApiError(res.status, typeof body?.detail === "string" ? body.detail : res.statusText);
  }

  return res.json() as Promise<T>;
}
