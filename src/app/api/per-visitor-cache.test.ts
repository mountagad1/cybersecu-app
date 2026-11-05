import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/infra/entitlements/currentQuota", () => ({
  getCurrentQuotaState: async () => ({ used: 0, limit: 10, remaining: 10, exhausted: false, hasEntitlement: false }),
}));
vi.mock("@/infra/supabase/server", () => ({
  createSupabaseServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}));
vi.mock("@/infra/anon-session/session", () => ({ getAnonymousSessionId: async () => null }));
vi.mock("@/infra/scenarios/nextScenario", () => ({ suggestNextScenario: async () => null }));

const quota = await import("./quota/route");
const next = await import("./simulations/next/route");

// Both answers depend on the visitor's cookie. A shared cache (CDN, proxy)
// keeping one would serve one visitor's quota or history to another.
describe("per-visitor GET routes", () => {
  it("/api/quota is never cacheable by a shared cache", async () => {
    const res = await quota.GET();
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });

  it("/api/simulations/next is never cacheable by a shared cache", async () => {
    const res = await next.GET(new Request("http://localhost/api/simulations/next?locale=fr"));
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });
});
