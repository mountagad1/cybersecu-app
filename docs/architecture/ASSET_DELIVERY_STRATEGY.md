# Livraison des ressources (2026-11-05)

| Ressource | Volume (build `719f9eb`) | Livraison | Statut |
|---|---|---|---|
| JS et CSS | 1,71 Mo pour 45 fichiers (863 Ko en gzip). 18 à 19 fichiers chargés par première visite | `/_next/static`, immuable, un an | Conforme. Le nombre de fichiers par page est le deuxième poste de CDN Requests |
| Polices | Inter et Caveat en `.woff2` (`next/font`), 443 Ko au total | auto-hébergées, immuables | Conforme |
| Images de contenu | aucune image matricielle dans `public/` (logo en SVG) | — | Conforme |
| Images sociales | `/og/fr`, `/og/en` : PNG générés au build | statiques | Conforme |
| Icônes PWA, Apple | 4 PNG générés au build | statiques (#93, #96) | Conforme |
| Audio, vidéo, PDF | aucun | — | — |
| Optimisation d'image Vercel | non sollicitée : `next/image` ne sert que `/logo.svg`, local | — | À confirmer à 0 dans Usage |

## Règles

- **Un média de plus de 200 Ko** doit être justifié dans la PR. `pnpm size:check` borne la sortie statique à 2,2 Mo.
- **Stockage externe (Vercel Blob ou autre)** : seulement pour des fichiers lourds ou qui changent souvent. Ce n'est pas le cas aujourd'hui, et rien ne le justifie.
- **Pas de vidéo en lecture automatique** ; un média lourd se charge à la demande.
- **Images futures** : formats modernes (AVIF ou WebP), dimensions explicites, chargement différé hors du premier écran. Le contrôle `pnpm seo:images` existe déjà.
