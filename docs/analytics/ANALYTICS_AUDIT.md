# Audit analytics et conversion — 2026-10-26

## Ce qui existe

- **Événements typés et sans champ libre** (`src/lib/analytics.ts`). Ils sont émis vers un `CustomEvent` du DOM, et vers `window.plausible` si un tel script était chargé.
- **Aucun fournisseur n'est chargé.** Rien n'est donc collecté aujourd'hui. Les seules données de trafic sont celles de la Search Console.
- **Taxonomie** : `docs/growth/ANALYTICS_EVENT_MODEL.md` fait foi. `EVENT_TAXONOMY.md` en donne la liste à jour depuis le code.

## Ce qui serait mesurable si un fournisseur était branché

| Besoin | Événement | Statut |
|---|---|---|
| Arrivées depuis la recherche ou une IA | `seo_landing`, `ai_landing` | émis |
| Vue d'une fiche | `attack_view` | émis |
| Simulation : début, fin | `simulation_start`, `simulation_complete` | émis |
| Outils : usage, résultat, erreur | `tool_start`, `tool_complete`, `tool_error` | émis (`tool_error` sur le générateur) |
| Clics de parcours | `related_attack_click`, `guide_click`, `funnel_cta_click`, `*_cta_clicked` | émis |
| Conversion | `premium_intent`, `checkout_start`, `purchase` | émis. Ventes fermées |
| Quiz | — | aucun quiz dans le produit |

## Constats

| # | Gr. | Constat | Suite |
|---|---|---|---|
| AN1 | **Décision** | Sans fournisseur, aucune hypothèse produit ne se mesure : activation des outils, passage aux simulations, effet de « Après la copie »… | Choisir un outil respectueux de la vie privée (Plausible ou Vercel Web Analytics, sans cookie), puis décider de la question du consentement. C'est le prérequis EXP-001 / P4, toujours ouvert |
| AN2 | P3 | `tool_error` n'est émis que par le générateur | L'étendre aux autres outils quand ils auront un état d'erreur réseau. Aujourd'hui, ils n'en ont pas |
| AN3 | — | Vie privée : aucun texte saisi, aucune URL collée, aucun mot de passe dans les événements. C'est garanti par les types et par des tests | Conforme |
