import type { Locale } from "@/domain/i18n/locale";

/**
 * Hand-written search-result descriptions for guides and levers whose source
 * text (`shortAnswer`, `plainLanguageDefinition`) has a first sentence too
 * long to fit, so that `metaDescription` would end it with « … »
 * (docs/seo/METADATA_IMPLEMENTATION_REPORT.md). Each one restates that
 * source text, shorter; nothing here says more than the page.
 *
 * Fiches have their own list (`attacks/meta-descriptions.ts`). Keyed by the
 * slug in that locale; checked against the catalogue and the length limit by
 * `meta-descriptions.test.ts`.
 */
export const WRITTEN_DESCRIPTIONS: Record<"guide" | "lever", Record<Locale, Readonly<Record<string, string>>>> = {
  guide: {
    fr: {
      "verifier-l-identite-d-un-interlocuteur":
        "Vérifier l'identité d'un interlocuteur : changez de canal et rappelez par un chemin que vous aviez déjà — numéro de la carte, contacts, application officielle.",
      "comment-un-mot-de-passe-est-vole":
        "Trois chemins, et deviner n'en fait pas partie : une fuite chez un service, une page qui imite un site connu, un logiciel installé. Seule l'unicité protège.",
      "que-faire-apres-avoir-paye-une-arnaque":
        "Appelez votre banque tout de suite : un virement très récent peut parfois être rappelé, un paiement par carte contesté. Puis conservez tout et portez plainte.",
      "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site":
        "Changez ce mot de passe tout de suite depuis le vrai service, fermez les sessions ouvertes, puis changez-le partout où vous l'utilisiez, messagerie en premier.",
    },
    en: {
      "verify-who-you-are-talking-to":
        "Verify who you're talking to: switch channels and get back in touch through a route you already had — the number on your card, your contacts, the official app.",
      "what-to-do-after-paying-a-scammer":
        "Call your bank straight away: a very recent transfer can sometimes be recalled, a card payment disputed. Then keep everything and file a police report.",
      "entered-my-password-on-a-fake-site":
        "Change that password right away from the real service, sign out every session, then change it everywhere you used it, starting with your email.",
      "let-someone-take-control-of-my-device":
        "Paid or gave out a card? Call your bank first. Then disconnect the device, remove the remote-control tool, and change your passwords from a clean device.",
    },
  },
  lever: {
    fr: {},
    en: {
      "social-pressure":
        "Social pressure: saying no is made to feel out of place — not helping someone close, keeping a manager waiting, letting down someone counting on you.",
    },
  },
};
