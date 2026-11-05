/**
 * Permanent slug redirects.
 *
 * WHY THIS IS CODE AND NOT THE `slug_redirects` TABLE
 * That table exists in migration 0001 and has never been wired to
 * anything. Now that the content lives in the repository, its redirects
 * have to as well: a redirect that lives in a database the deploy never
 * touches has exactly the failure mode that
 * docs/decisions/0007-content-in-repository.md exists to remove.
 *
 * Every entry is permanent (`permanent: true` in next.config.ts), which
 * Next.js serves as a 308 — search engines treat it as a 301. A slug that
 * has been public is permanent — an external link to it must keep working,
 * and the ranking it accumulated has to transfer rather than be dropped.
 *
 * INVARIANT (asserted by a test): no `from` may also exist as a live
 * entity slug or category slug. That would be a redirect loop, and the
 * page would become unreachable rather than moved.
 */

export interface SlugRedirect {
  /** Rooted source path, as it was published. */
  from: string;
  /** Rooted destination path. Must resolve to a live page. */
  to: string;
  /** Why it moved — read by whoever wonders whether it can be deleted. */
  reason: string;
}

/**
 * Until the fix, the English hubs were served under their French slug while
 * every link, the sitemap and the hreflang named the English one (which
 * returned 404). Nothing linked to the French-slug URLs, but they answered
 * 200 in production, so they are moved rather than dropped.
 */
const EN_HUB_SLUG_FIX =
  "Hub anglais servi par erreur sous son slug français ; l'URL annoncée partout (sitemap, liens, hreflang) est le slug anglais.";

export const REDIRECTS: readonly SlugRedirect[] = [
  {
    from: "/attaques/phishing-email",
    to: "/attaques/phishing",
    reason:
      "L'email est le canal par défaut de l'hameçonnage, pas une variante : la fiche devient l'entité chapeau, dont smishing, vishing et quishing sont les canaux.",
  },
  {
    from: "/attaques/smishing-faux-sms-bancaire",
    to: "/attaques/smishing",
    reason:
      "« Faux SMS bancaire » décrivait un scénario, pas l'entité. Le scénario reste l'illustration principale de la fiche.",
  },
  {
    from: "/attaques/usurpation-conseiller-bancaire",
    to: "/attaques/faux-conseiller-bancaire",
    reason:
      "Aligne le slug sur la façon dont la fraude est réellement nommée et cherchée.",
  },
  {
    from: "/attaques/attaques-de-comptes",
    to: "/attaques/identifiants-et-comptes",
    reason:
      "Le hub couvre aussi le vol d'identifiants qui précède la prise de contrôle d'un compte ; l'ancien nom ne le disait pas.",
  },
  {
    from: "/en/attaques/ingenierie-sociale",
    to: "/en/attaques/social-engineering",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/sites-et-navigateurs",
    to: "/en/attaques/website-and-browser-attacks",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/fraudes-financieres",
    to: "/en/attaques/financial-fraud",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/identifiants-et-comptes",
    to: "/en/attaques/credentials-and-accounts",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/logiciels-malveillants",
    to: "/en/attaques/malware",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/telephones-et-objets-connectes",
    to: "/en/attaques/phones-and-connected-devices",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/reseaux-et-wifi",
    to: "/en/attaques/network-and-wifi-attacks",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/donnees-et-identite-numerique",
    to: "/en/attaques/data-and-digital-identity",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/ia-et-contenus-synthetiques",
    to: "/en/attaques/ai-and-synthetic-content",
    reason: EN_HUB_SLUG_FIX,
  },
  {
    from: "/en/attaques/chantage-et-harcelement",
    to: "/en/attaques/blackmail-and-harassment",
    reason: EN_HUB_SLUG_FIX,
  },
] as const;
