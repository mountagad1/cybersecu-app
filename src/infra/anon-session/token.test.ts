import { beforeAll, describe, expect, it } from "vitest";
import { signSessionToken, verifySessionToken } from "./token";

beforeAll(() => {
  // Doit satisfaire la validation du registre (≥ 32 caractères, ne ressemblant
  // à aucune clé Supabase) : le secret de test reflète la forme d'un vrai.
  process.env.ANON_SESSION_SECRET = "test-secret-do-not-use-in-prod-0123456789abcdef";
});

describe("session token sign/verify", () => {
  it("round-trips a valid session id", () => {
    const id = "11111111-1111-1111-1111-111111111111";
    const token = signSessionToken(id);
    expect(verifySessionToken(token)).toBe(id);
  });

  it("rejects a token with a tampered session id", () => {
    const token = signSessionToken("11111111-1111-1111-1111-111111111111");
    const [, signature] = token.split(".");
    const tampered = `22222222-2222-2222-2222-222222222222.${signature}`;
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("rejects a token with a tampered signature", () => {
    const token = signSessionToken("11111111-1111-1111-1111-111111111111");
    const [id] = token.split(".");
    expect(verifySessionToken(`${id}.not-a-real-signature`)).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(verifySessionToken("not-a-token")).toBeNull();
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken(null)).toBeNull();
  });

  it("rejects a non-uuid session id even with a valid-looking signature", () => {
    expect(verifySessionToken("../../etc/passwd.abc")).toBeNull();
  });
});
