# Design system — règles

Base : Tailwind 4 et les jetons de `src/app/globals.css`. Composants : `src/components/ui`. État mesuré : `DESIGN_SYSTEM_BASELINE.md`.

## Règles

1. **Couleurs** : toujours un jeton sémantique (`primary`, `muted-foreground`, `danger`…) pour le texte, les fonds d'interface et les états. Les couleurs de palette brutes sont réservées aux illustrations et aux décors de l'accueil, jamais à l'information.
2. **Contraste** : le texte doit être lisible en AA. `--brand-teal-strong` (`#0f766e`) est la seule variante sarcelle autorisée pour le texte.
3. **Taille** : corps à 16 px au minimum. Pas de texte interactif sous 14 px. Cible tactile de 44 px pour les actions principales : c'est le `Button` par défaut.
4. **Boutons** : `Button` ou `buttonVariants`. Un `<button>` écrit à la main seulement pour un contrôle spécifique (accordéon, onglet), avec un focus visible.
5. **Liens** : soulignés dès qu'ils sont dans un texte ou une liste de phrases. La couleur seule ne suffit pas.
6. **Mouvement** : Motion, à travers `MotionProvider`. Aucun contenu porteur de sens ne doit dépendre d'une animation pour apparaître (A4).
7. **États** : chaque outil prévoit les états chargement, vide, invalide, erreur et succès. Une erreur dit quoi faire ensuite.
8. **Pas d'indicateur de sécurité trompeur** : pas de vert « sûr », pas de jauge de robustesse, pas de compte à rebours.
9. **Nouveau composant** : seulement si un même motif apparaît au moins 3 fois. Il va dans `src/components/ui`, avec des variantes CVA.
