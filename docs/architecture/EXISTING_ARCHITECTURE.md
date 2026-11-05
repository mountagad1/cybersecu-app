# Architecture existante (2026-11-05)

Ce document est un résumé. Les références qui font foi sont `docs/ARCHITECTURE.md`, `docs/decisions/0001–0009` et `docs/audit/REPOSITORY_BASELINE.md`.

```
Navigateur ──► CDN Vercel ──► 449 pages générées au build (HTML, RSC), /_next/static (immuable)
                    │
                    └─► 11 fonctions /api/* (iad1) ──► Supabase (PostgREST, clé de service côté serveur)
                                                  └──► Stripe (ventes fermées), Resend (restauration d'accès)
```

| Couche | Choix | Pourquoi |
|---|---|---|
| Contenu | dans le dépôt (`src/content/**`) : 100 fiches, 128 simulations, 9 guides, 9 leviers, 9 outils, en FR et en EN | Décision 0007. Une page n'a jamais besoin de la base pour s'afficher |
| Rendu | statique pour toutes les pages publiques, dynamique pour les seules routes `/api/` | Statique d'abord |
| Interactivité | simulations et outils en composants clients. Calcul dans le navigateur pour les outils. Correction côté serveur pour les simulations | Le client ne connaît pas la bonne réponse avant d'avoir répondu |
| Identité | pas de compte. Cookie signé `csa`, créé à la première partie | Décision 0005 |
| Données | Supabase : tentatives, quota, droits d'accès | `docs/ARCHITECTURE.md`, `docs/NO_LOGIN_ARCHITECTURE.md` |
| Langues | **FR et EN seulement.** ES, DE, PT-PT et PL n'existent pas dans ce dépôt | `src/domain/i18n/locale.ts` |
| Garde-fous | CI (lint, typage, tests, build, SEO, `size:check`, audit des dépendances), `vercel.json` | `docs/quality/QUALITY_BASELINE.md` |
