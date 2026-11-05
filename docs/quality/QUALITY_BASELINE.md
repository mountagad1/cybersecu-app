# Socle qualité — 2026-10-26

## Ce qui tourne, et où

| Contrôle | Commande | En CI (`.github/workflows/ci.yml`, ajouté dans cette passe) | Résultat au 2026-10-26 |
|---|---|---|---|
| Lint | `pnpm lint` | oui | OK |
| Typage | `pnpm typecheck` | oui | OK |
| Tests unitaires et d'intégration | `pnpm test` (vitest) | oui | **712/712**, 53 fichiers |
| Build | `pnpm build` | oui | OK, 431 pages |
| Métadonnées | `pnpm seo:metadata` | oui | 0 erreur |
| Images | `pnpm seo:images` | oui | 0 anomalie |
| Cohérence SEO | `pnpm seo:audit` | oui | OK |
| Dépendances livrées | `pnpm audit --prod --audit-level high` | oui | 0 vulnérabilité connue |
| Maillage | `pnpm seo:links` (demande `next start`) | non | 0 page inaccessible |
| Navigateur et accessibilité (Playwright, axe) | script hors dépôt | non | générateur 57/57 (local et production), axe 0 violation sur 58 relevés |
| Performance (Lighthouse) | `npx lighthouse` | non | `docs/audit/PERFORMANCE_BASELINE.md` |

**Avant cette passe, aucun de ces contrôles n'était automatique.** Vercel déployait `main` sans les exécuter.

## Couverture : ce qui manque

| Manque | Risque | Proposition |
|---|---|---|
| Parcours de simulation de bout en bout (API, Supabase) | une régression du jeu ne se voit qu'en production | base Supabase de test (SIM-2) |
| Tests navigateur dans le dépôt | les 57 contrôles du générateur et l'audit axe dépendent d'un script local | `@playwright/test` en dépendance de dev, avec un job CI (R4). Nouvelle dépendance, donc à décider |
| Tests de composants React | la logique d'état des outils n'est testée que par le navigateur | jsdom ou le mode navigateur de vitest, avec R4 |
| Firefox, Safari, lecteurs d'écran | non testés | test manuel trimestriel |

## Règles

- Ne jamais affaiblir ni sauter un test pour faire passer la CI.
- Un test qui ne peut pas tourner se déclare comme tel dans le rapport.
- Un garde-fou statique se vérifie par mutation : on introduit le défaut, le test doit échouer, puis on annule (fait pour le générateur et pour les domaines des simulations).
