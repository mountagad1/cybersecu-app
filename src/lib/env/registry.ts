/**
 * SOURCE DE VÉRITÉ UNIQUE des variables d'environnement.
 *
 * POURQUOI CE FICHIER EXISTE
 * Avant lui, quatorze noms étaient lus dans huit fichiers, chacun réimplémentant
 * sa propre chaîne de fallback en ligne (`process.env.A || process.env.B`).
 * Trois conséquences mesurées sur ce dépôt :
 *
 *   1. Quatre alias acceptés par le code (`NEXT_PUBLIC_SUPABASE_URL`,
 *      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
 *      `NEXT_PUBLIC_SITE_URL`) n'étaient déclarés nulle part dans
 *      `.env.example` : un opérateur ne pouvait pas savoir qu'ils existaient.
 *   2. Quatre variables déclarées dans `.env.example` n'étaient lues par aucune
 *      ligne de code (`SENTRY_DSN`, les deux `NEXT_PUBLIC_POSTHOG_*`) ou
 *      seulement par un outil externe (`SUPABASE_DB_URL`) — configuration qui
 *      semble prise en compte et ne l'est pas.
 *   3. Le message d'erreur ne nommait qu'une seule orthographe, donc un projet
 *      correctement configuré sous un autre alias accepté lisait
 *      « Missing SUPABASE_URL » sans savoir quoi corriger.
 *
 * Ce module est PUR : aucune lecture de `process.env`, donc testable sans
 * environnement. La résolution vit dans `read.ts`, `.env.example` est généré
 * depuis ce registre, et un test échoue si les deux divergent.
 */

/** Regroupement fonctionnel : ce qui casse quand la variable manque. */
export type EnvGroup =
  /** Lectures publiques : /attaques, /simulations, sitemap. */
  | "public-read"
  /** Écritures : démarrer une tentative, la corriger, consommer le quota. */
  | "write-path"
  /** Paiement unique Stripe et restitution d'accès. */
  | "payments"
  /** Email transactionnel (lien de restauration). */
  | "email"
  /** Simulations vocales (docs/decisions/0008). Optionnel : son absence
   *  dégrade vers la simulation texte, elle ne casse jamais une page. */
  | "voice"
  /** Outillage hors runtime applicatif (migrations, diagnostics). */
  | "tooling";

export interface EnvSpec {
  /** Nom canonique. C'est celui à définir dans un nouvel environnement. */
  name: string;
  /**
   * Orthographes également acceptées, par ordre de priorité décroissante.
   * Elles existent pour ne pas casser un environnement déjà déployé ; un
   * nouvel environnement ne doit définir que `name`.
   */
  aliases: readonly string[];
  group: EnvGroup;
  /** `true` = le groupe correspondant ne fonctionne pas du tout sans elle. */
  required: boolean;
  /** Ce que la variable fait, et ce qui casse sans elle. Sert à `.env.example`. */
  description: string;
  /** Valeur d'exemple non sensible, ou `null` si aucune ne peut l'être. */
  example: string | null;
  /**
   * `true` si la valeur est un secret : jamais journalisée, jamais renvoyée
   * par un diagnostic, jamais préfixée `NEXT_PUBLIC_`.
   */
  secret: boolean;
  /**
   * Contrôle de vraisemblance de la VALEUR, au-delà de sa simple présence.
   *
   * Retourne la raison du rejet, ou `null` si la valeur est acceptable. La
   * raison est affichée à un opérateur et journalisée : elle décrit la
   * catégorie du problème, jamais la valeur.
   *
   * Une variable présente mais inutilisable est un état distinct de « absente »
   * et bien plus dangereux : elle passe tous les contrôles de présence tout en
   * annulant la propriété de sécurité qu'elle est censée fournir.
   */
  validate?: (value: string, readOther: (canonical: string) => string | undefined) => string | null;
}

export const ENV_REGISTRY: readonly EnvSpec[] = [
  {
    name: "SUPABASE_URL",
    aliases: ["NEXT_PUBLIC_SUPABASE_URL"],
    group: "public-read",
    required: true,
    description:
      "Origine du projet Supabase. Sans elle, chaque rendu serveur de /attaques et /simulations lève « Missing SUPABASE_URL » et renvoie 500.",
    example: "https://votre-projet.supabase.co",
    secret: false,
  },
  {
    name: "SUPABASE_PUBLISHABLE_KEY",
    aliases: [
      "SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ],
    group: "public-read",
    required: true,
    description:
      "Clé liée aux policies RLS, utilisée pour toutes les lectures publiques. Supabase l'appelle désormais « publishable » (sb_publishable_…) ; les projets antérieurs au renommage fournissent un JWT sous le nom SUPABASE_ANON_KEY, toujours accepté.",
    example: null,
    secret: false,
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    aliases: [],
    group: "write-path",
    required: true,
    description:
      "Contourne RLS. Strictement serveur — ne jamais préfixer NEXT_PUBLIC_. Sans elle les lectures publiques fonctionnent mais toute écriture échoue : démarrer une simulation, la corriger, consommer le quota.",
    example: null,
    secret: true,
  },
  {
    name: "ANON_SESSION_SECRET",
    aliases: [],
    group: "write-path",
    required: true,
    description:
      "Secret HMAC signant le cookie de session anonyme. Sa rotation invalide tous les cookies existants (les lignes en base sont intactes) : à traiter comme un changement cassant. Générer avec `openssl rand -base64 32`.",
    example: null,
    secret: true,
    /**
     * Ce secret est la SEULE chose qui empêche un visiteur de fabriquer un
     * cookie de session valide. `hasActiveEntitlement()` ne connaît un client
     * payant que par l'identifiant de session tiré de ce cookie : un secret
     * devinable donne l'accès premium de n'importe qui à n'importe qui.
     *
     * Le piège vérifié en pratique : y placer la clé publishable Supabase.
     * Elle est PUBLIQUE par conception — servie au navigateur — donc le HMAC
     * devient calculable par quiconque visite le site. Démontré : un cookie
     * forgé à partir d'elle seule obtient `hasEntitlement: true`.
     */
    validate: (value, readOther) => {
      const supabaseKey = readOther("SUPABASE_PUBLISHABLE_KEY");
      if (supabaseKey && value === supabaseKey) {
        return "vaut la clé Supabase, qui est publique : le cookie de session devient falsifiable par n'importe qui";
      }
      if (/^sb_(publishable|secret)_/.test(value)) {
        return "ressemble à une clé d'API Supabase ; utilisez un secret dédié (`openssl rand -base64 32`)";
      }
      if (value.startsWith("eyJ")) {
        return "ressemble à un JWT Supabase ; utilisez un secret dédié (`openssl rand -base64 32`)";
      }
      if (value.length < 32) {
        return "trop court pour un secret HMAC (moins de 32 caractères) ; générez-le avec `openssl rand -base64 32`";
      }
      return null;
    },
  },
  {
    name: "SITE_URL",
    aliases: ["NEXT_PUBLIC_SITE_URL"],
    group: "public-read",
    required: false,
    description:
      "Origine publique : canonicals, OpenGraph, sitemap, JSON-LD, URLs de redirection Stripe. Non requise mais à définir par environnement : elle retombe silencieusement sur l'origine de production (https://www.cybersecu.app, l'hôte canonique — l'apex y redirige), donc un déploiement de préversion qui l'omet émet des canonicals et des redirections de production.",
    example: "https://www.cybersecu.app",
    secret: false,
  },
  {
    name: "STRIPE_SECRET_KEY",
    aliases: [],
    group: "payments",
    required: false,
    description:
      "Clé serveur Stripe. Utilisée par /api/webhooks/stripe pour vérifier la signature des événements entrants (l'achat lui-même passe par un Stripe Payment Link géré depuis le Dashboard, pas par un appel API de création de session — src/lib/paymentLink.ts). Sans elle, la vérification de signature échoue et le webhook rejette tout événement.",
    example: null,
    secret: true,
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    aliases: [],
    group: "payments",
    required: false,
    description:
      "Secret de signature du webhook Stripe. C'est le seul chemin qui accorde un droit d'accès : sans lui, /api/checkout répond 503 (aucun paiement ne pourrait jamais être converti en entitlement) et aucun événement webhook n'est traité.",
    example: null,
    secret: true,
  },
  {
    name: "STRIPE_PAYMENT_LINK_URL",
    aliases: [],
    group: "payments",
    required: false,
    description:
      "URL du Stripe Payment Link derrière /api/checkout (src/lib/paymentLink.ts). Retombe sur le lien de production codé en dur si absente — à définir explicitement sur toute préversion/staging configurée avec des clés Stripe de test, sinon ce déploiement redirige vers le lien de PRODUCTION en mode live et facture de l'argent réel.",
    example: "https://buy.stripe.com/xxxxxxxxxxxxxxxxxxxxxxx",
    secret: false,
  },
  {
    name: "RESEND_API_KEY",
    aliases: [],
    group: "email",
    required: false,
    description:
      "Envoi de l'email de restauration d'accès. Sans elle la logique de jeton fonctionne mais l'envoi échoue explicitement.",
    example: null,
    secret: true,
  },
  {
    name: "RESEND_FROM_EMAIL",
    aliases: [],
    group: "email",
    required: false,
    description: "Expéditeur de l'email de restauration.",
    example: "cybersecu.app <noreply@cybersecu.app>",
    secret: false,
  },
  {
    name: "DOGRAH_API_KEY",
    aliases: [],
    group: "voice",
    required: false,
    description:
      "Clé d'organisation Dograh (docs/decisions/0008), utilisée uniquement côté serveur pour créer/rafraîchir les jetons d'intégration (« embed token ») par scénario vocal. Sans elle, chaque page de simulation vocale répond 503 et propose la simulation texte équivalente — le reste du site n'est pas affecté.",
    example: null,
    secret: true,
  },
  {
    name: "DOGRAH_BASE_URL",
    aliases: [],
    group: "voice",
    required: false,
    description:
      "Origine de l'instance Dograh à interroger. https://app.dograh.com pour le cloud managé ; l'origine de votre propre déploiement en auto-hébergement.",
    example: "https://app.dograh.com",
    secret: false,
  },
  {
    name: "SUPABASE_DB_URL",
    aliases: [],
    group: "tooling",
    required: false,
    description:
      "Chaîne psql, utilisée uniquement par les migrations et les seeds. Jamais lue par l'application au runtime.",
    example: null,
    secret: true,
  },
] as const;

export function getEnvSpec(name: string): EnvSpec | undefined {
  return ENV_REGISTRY.find((spec) => spec.name === name);
}

/** Toutes les orthographes acceptées pour une variable, priorité décroissante. */
export function acceptedNames(spec: EnvSpec): string[] {
  return [spec.name, ...spec.aliases];
}

/**
 * Incohérences internes du registre lui-même. Un nom qui apparaît deux fois
 * rendrait la résolution dépendante de l'ordre de déclaration ; un secret
 * préfixé `NEXT_PUBLIC_` serait inliné dans le bundle navigateur par Next.
 */
export function auditRegistry(): string[] {
  const problems: string[] = [];
  const seen = new Map<string, string>();

  for (const spec of ENV_REGISTRY) {
    for (const name of acceptedNames(spec)) {
      const owner = seen.get(name);
      if (owner) problems.push(`"${name}" est revendiqué par ${owner} et ${spec.name}`);
      seen.set(name, spec.name);
      if (spec.secret && name.startsWith("NEXT_PUBLIC_")) {
        problems.push(`"${name}" est un secret sous un nom NEXT_PUBLIC_ : Next l'inlinerait côté navigateur`);
      }
    }
    if (spec.name.startsWith("NEXT_PUBLIC_")) {
      problems.push(`"${spec.name}" ne devrait pas être le nom canonique : rien ici n'est lu par le navigateur`);
    }
  }
  return problems;
}
