import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { classifyDataFailure, describeError, UNREACHABLE_HOST_MESSAGE } = await import(
  "@/infra/observability/log"
);

/**
 * The incident these guard against: an unreachable database, an unapplied
 * migration, an RLS denial and a missing env var all reaching the operator as
 * the same undifferentiated failure.
 */
describe("classifyDataFailure", () => {
  it("names a missing Supabase env var as configuration, not a database fault", () => {
    expect(classifyDataFailure(new Error("Missing SUPABASE_URL"))).toBe("CONFIGURATION_ERROR");
    expect(classifyDataFailure(new Error("Missing SUPABASE_PUBLISHABLE_KEY"))).toBe(
      "CONFIGURATION_ERROR",
    );
    expect(classifyDataFailure(new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"))).toBe(
      "CONFIGURATION_ERROR",
    );
  });

  it("separates an unapplied migration from an RLS denial", () => {
    expect(classifyDataFailure({ message: "relation does not exist", code: "42P01" })).toBe(
      "SCHEMA_MISSING",
    );
    expect(classifyDataFailure({ message: "denied", code: "42501" })).toBe("PERMISSION_DENIED");
  });

  it("recognises a transport failure, including the empty-message shape supabase-js returns", () => {
    expect(classifyDataFailure({ message: "" })).toBe("DATABASE_CONNECTION_ERROR");
    expect(classifyDataFailure(new Error("fetch failed"))).toBe("DATABASE_CONNECTION_ERROR");
    expect(classifyDataFailure(new Error("getaddrinfo ENOTFOUND db.example"))).toBe(
      "DATABASE_CONNECTION_ERROR",
    );
  });

  it("falls back to a query error rather than guessing", () => {
    expect(classifyDataFailure({ message: "syntax error at or near", code: "42601" })).toBe(
      "DATABASE_QUERY_ERROR",
    );
  });
});

describe("describeError", () => {
  it("never reports a failure with a blank cause", () => {
    expect(describeError({ message: "" }).message).toBe(UNREACHABLE_HOST_MESSAGE);
  });

  it("keeps the Postgres code, which is the actionable field", () => {
    expect(describeError({ message: "nope", code: "42P01" })).toMatchObject({ pgCode: "42P01" });
  });
});
