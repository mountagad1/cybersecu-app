import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { acceptedNames, auditRegistry, ENV_REGISTRY } from "@/lib/env/registry";
import {
  hasEnv,
  missingRequired,
  readEnv,
  reportEnv,
  requireEnv,
  resolvedNameOf,
} from "@/lib/env/read";

/**
 * Ces tests existent parce que la configuration a déjà divergé du code une
 * fois, silencieusement, et que le symptôme était une page 500 en production
 * avec un message qui ne nommait pas la variable à définir.
 */

const ORIGINAL = { ...process.env };
afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("registre", () => {
  it("est interne cohérent : aucun nom revendiqué deux fois, aucun secret en NEXT_PUBLIC_", () => {
    expect(auditRegistry()).toEqual([]);
  });

  it("ne publie jamais une valeur d'exemple pour un secret", () => {
    for (const spec of ENV_REGISTRY) {
      if (spec.secret) expect(spec.example).toBeNull();
    }
  });
});

describe("résolution", () => {
  it("préfère le nom canonique à ses alias", () => {
    process.env.SUPABASE_URL = "canonical";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "alias";
    expect(readEnv("SUPABASE_URL")).toBe("canonical");
    expect(resolvedNameOf("SUPABASE_URL")).toBe("SUPABASE_URL");
  });

  it("retombe sur un alias hérité, et le signale comme tel", () => {
    delete process.env.SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "alias";
    expect(readEnv("SUPABASE_URL")).toBe("alias");
    expect(reportEnv().find((r) => r.name === "SUPABASE_URL")?.usingLegacyAlias).toBe(true);
  });

  it("respecte l'ordre de priorité des alias de la clé Supabase", () => {
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
    process.env.SUPABASE_ANON_KEY = "anon";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-anon";
    expect(readEnv("SUPABASE_PUBLISHABLE_KEY")).toBe("anon");
  });

  it("traite une chaîne vide comme absente", () => {
    process.env.SUPABASE_URL = "";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(hasEnv("SUPABASE_URL")).toBe(false);
  });

  it("nomme TOUTES les orthographes acceptées quand elle lève", () => {
    for (const name of acceptedNames(ENV_REGISTRY.find((s) => s.name === "SUPABASE_URL")!)) {
      delete process.env[name];
    }
    expect(() => requireEnv("SUPABASE_URL")).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() => requireEnv("SUPABASE_URL")).toThrow(/redéployez/);
  });

  it("ne divulgue jamais de valeur dans le rapport", () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "super-secret-value";
    const serialised = JSON.stringify(reportEnv());
    expect(serialised).not.toContain("super-secret-value");
  });
});

describe("aucune dérive", () => {
  it("garde .env.example identique à ce que le registre génère", async () => {
    const { renderEnvExample } = await import("../../../scripts/generate-env-example");
    const committed = readFileSync(join(process.cwd(), ".env.example"), "utf8");
    expect(committed).toBe(renderEnvExample());
  });

  it("laisse le registre seul lire process.env pour une variable applicative", () => {
    // Toute réintroduction d'un `process.env.X` littéral hors du registre
    // recrée exactement la chaîne de fallback dupliquée que ce module remplace.
    const APP_VARS = ENV_REGISTRY.flatMap((s) => acceptedNames(s));
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.tsx?$/.test(name) || name.includes(".test.")) continue;
        if (full.includes(join("lib", "env"))) continue; // le registre lui-même
        // Commentaires retirés : la documentation a le droit de citer un nom
        // de variable, seul le code exécuté compte.
        const source = readFileSync(full, "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
        for (const v of APP_VARS) {
          if (source.includes(`process.env.${v}`)) {
            offenders.push(`${full.replace(process.cwd() + "/", "")} lit process.env.${v}`);
          }
        }
      }
    };
    walk(join(process.cwd(), "src"));
    walk(join(process.cwd(), "scripts"));

    expect(offenders).toEqual([]);
  });
});

describe("validation de la valeur, pas seulement de la présence", () => {
  it("refuse la clé Supabase publique comme secret de session", () => {
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_abc123";
    process.env.ANON_SESSION_SECRET = "sb_publishable_abc123";

    // Le secret est la seule chose qui empêche de forger un cookie de session,
    // et la clé publishable est servie au navigateur : l'accepter rendrait
    // l'accès premium de tout client payant réclamable par n'importe qui.
    expect(() => requireEnv("ANON_SESSION_SECRET")).toThrow(/publique/);
    expect(reportEnv().find((r) => r.name === "ANON_SESSION_SECRET")?.valid).toBe(false);
    expect(missingRequired("write-path")).toContain("ANON_SESSION_SECRET");
  });

  it("refuse toute clé d'API Supabase, même d'un autre projet", () => {
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_autre";
    process.env.ANON_SESSION_SECRET = "sb_secret_quelque_chose_de_long_et_different";
    expect(() => requireEnv("ANON_SESSION_SECRET")).toThrow(/clé d'API Supabase/);
  });

  it("refuse un JWT et un secret trop court", () => {
    process.env.ANON_SESSION_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaaaaaaaaaaa";
    expect(() => requireEnv("ANON_SESSION_SECRET")).toThrow(/JWT/);
    process.env.ANON_SESSION_SECRET = "trop-court";
    expect(() => requireEnv("ANON_SESSION_SECRET")).toThrow(/trop court/);
  });

  it("accepte un secret correctement généré", () => {
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_abc123";
    process.env.ANON_SESSION_SECRET = "9WQ3nJ7pR2sT5vX8zA1cE4gH6kM0oQ2uY7bD9fJ3lN5=";
    expect(() => requireEnv("ANON_SESSION_SECRET")).not.toThrow();
    expect(reportEnv().find((r) => r.name === "ANON_SESSION_SECRET")?.valid).toBe(true);
  });

  it("ne divulgue jamais la valeur refusée dans le message", () => {
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TRES_SECRET_XYZ";
    process.env.ANON_SESSION_SECRET = "sb_publishable_TRES_SECRET_XYZ";
    try {
      requireEnv("ANON_SESSION_SECRET");
      throw new Error("aurait dû lever");
    } catch (err) {
      expect(String((err as Error).message)).not.toContain("TRES_SECRET_XYZ");
    }
  });
});
