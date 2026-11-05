import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
// Nothing past the sales gate may run while sales are suspended.
const untouched = vi.fn(() => {
  throw new Error("should not be reached while sales are closed");
});
vi.mock("@/infra/supabase/server", () => ({ createSupabaseServerClient: untouched }));
vi.mock("@/infra/anon-session/session", () => ({ getOrCreateAnonymousSessionId: untouched }));
vi.mock("@/infra/entitlements/repository", () => ({ hasActiveEntitlement: untouched }));

const { SALES_OPEN } = await import("@/lib/sales");
const { POST } = await import("./route");

describe("POST /api/checkout while sales are suspended", () => {
  it.runIf(!SALES_OPEN)("refuses with 503 sales_closed, before consent or payment link", async () => {
    const res = await POST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentImmediateExecution: true }),
      }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "sales_closed" });
    expect(untouched).not.toHaveBeenCalled();
  });
});
