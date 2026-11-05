import { describe, expect, it } from "vitest";
import { canConsumeQuota, computeQuotaState } from "./checkQuota";

describe("computeQuotaState", () => {
  it("reports remaining and not exhausted when under the limit", () => {
    expect(computeQuotaState(3, 10)).toEqual({ used: 3, limit: 10, remaining: 7, exhausted: false });
  });

  it("reports exhausted exactly at the limit", () => {
    expect(computeQuotaState(10, 10)).toEqual({ used: 10, limit: 10, remaining: 0, exhausted: true });
  });

  it("never reports negative remaining if used somehow exceeds limit", () => {
    expect(computeQuotaState(12, 10)).toEqual({ used: 12, limit: 10, remaining: 0, exhausted: true });
  });

  it("handles zero usage", () => {
    expect(computeQuotaState(0, 10)).toEqual({ used: 0, limit: 10, remaining: 10, exhausted: false });
  });
});

describe("canConsumeQuota", () => {
  it("allows consumption when quota has remaining", () => {
    const quota = computeQuotaState(5, 10);
    expect(canConsumeQuota(quota, false)).toBe(true);
  });

  it("blocks consumption when quota is exhausted and there is no entitlement", () => {
    const quota = computeQuotaState(10, 10);
    expect(canConsumeQuota(quota, false)).toBe(false);
  });

  it("always allows consumption when an entitlement is active, even if exhausted", () => {
    const quota = computeQuotaState(10, 10);
    expect(canConsumeQuota(quota, true)).toBe(true);
  });
});
