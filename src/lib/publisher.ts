/**
 * Who publishes cybersecu.app (docs/growth/GROWTH_OS.md G-010): a private
 * person, not a company — there is no legal entity yet. One source for the
 * legal pages and the site JSON-LD, so they can never disagree.
 *
 * The host's full postal address still has to be checked against Vercel's
 * own legal pages before it is added (docs/audits/remaining-verification.md).
 */
export const PUBLISHER = {
  name: "Mountaga Diallo",
  email: "mmountagad1@gmail.com",
  host: { name: "Vercel Inc.", location: "San Francisco, Californie, États-Unis", url: "https://vercel.com" },
} as const;

/** Where each locale's about page presents the publisher. */
export const PUBLISHER_PAGE = { fr: "/a-propos#editeur", en: "/en/about#publisher" } as const;
