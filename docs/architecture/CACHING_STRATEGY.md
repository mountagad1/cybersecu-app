# Stratégie de cache (2026-11-05)

En-têtes observés en production le 2026-11-05 (`curl -I`).

| Ressource | `Cache-Control` | Cache CDN (`x-vercel-cache`) | Règle |
|---|---|---|---|
| Pages (`/`, fiches, guides, outils, simulations) | `public, max-age=0, must-revalidate` | `HIT` | Générées au build. Le CDN les garde jusqu'au déploiement suivant, et le navigateur revalide. **Conforme** |
| `/_next/static/**` (JS, CSS, polices) | `public,max-age=31536000,immutable` | `HIT` | Leur nom contient une empreinte : cache d'un an. **Conforme** |
| `/og/[locale]`, `/icons/*`, `/apple-icon` | `public, max-age=0, must-revalidate` | `HIT` | Statiques depuis les PR #93 et #96. **Conforme** |
| `/sitemap.xml` | `public, max-age=0, must-revalidate` | `MISS` lors du relevé | Statique (○). Le `MISS` venait probablement d'un cache froid juste après le déploiement. À revoir si cela persiste |
| `/api/health` | `public, max-age=0, must-revalidate` | `MISS` | Diagnostic, sans aucune donnée de visiteur. Acceptable |
| **`/api/quota`, `/api/simulations/next`** | **avant :** `public, max-age=0, must-revalidate`. **Après cette passe :** `private, no-store` | `MISS` | **Corrigé.** Ces réponses dépendent du cookie `csa` : `public` autorisait un cache intermédiaire partagé à les conserver |
| `POST /api/*` | — | — | Les requêtes POST ne sont pas mises en cache |

## Règles

1. **Toute réponse qui dépend d'un cookie, d'une session ou d'un droit d'accès** porte `private, no-store`. Le test `src/app/api/per-visitor-cache.test.ts` le vérifie pour les deux routes `GET` concernées.
2. **Le contenu public reste généré au build** (`force-static`, `generateStaticParams`, `dynamicParams = false`). Une nouvelle page ne devient dynamique que si elle a besoin de la requête.
3. **Aucun `s-maxage` sur les routes `/api/`** : ce qu'elles renvoient dépend du visiteur ou de l'état de la base.
4. **Un fichier image généré** (`next/og`) est une **route** en `force-static`, pas un fichier de métadonnées (`vercel/STORAGE_REGRESSION_POLICY.md`).
