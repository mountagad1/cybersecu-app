# Design system : état mesuré au 2026-10-26

| Élément | Constat (mesuré dans `src/`) |
|---|---|
| Jetons | 44 variables CSS dans `src/app/globals.css` : couleurs de marque (marine, bleu, sarcelle), sémantiques (`--color-primary`, `success`, `warning`, `danger`, `muted`…), rayons |
| Couleurs hors jetons | 138 classes de palette Tailwind brutes dans 9 fichiers, surtout sur l'accueil (cartes « post-it », démo téléphone, scènes) |
| Typographie | Inter (texte) et Caveat (manuscrit décoratif), via `next/font`, en `display: swap`. Corps 16 px, interligne 24 px. En-tête de navigation en 12 px sur mobile (A2) |
| Composants de base (`src/components/ui`) | `alert`, `badge`, `button` (CVA, 4 variantes, 3 tailles, la taille par défaut fait 44 px), `card`, `checkbox`, `dialog`, `progress`, `particle-drift` |
| Boutons | 53 usages de `Button` ou `buttonVariants`, et 11 `<button>` écrits à la main (contrôles spécifiques) |
| Focus | Contour visible de 2 à 3 px (vérifié au clavier) |
| Mouvement | Motion, avec `reducedMotion="user"` sur tout le site |
| Liens dans le texte | Soulignés dans les paragraphes (`main p a`). Les listes ont dû être soulignées à la main sur le générateur (axe `link-in-text-block`) |

Pas de second design system, et pas de refonte : voir `DESIGN_SYSTEM.md` pour les règles.
