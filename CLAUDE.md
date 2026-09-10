# ese-site — règles opératoires

Site de l'ESIEA Secure Edition (ESE), conférence annuelle de cybersécurité.
Astro statique, livré en image Docker. Remplace le site Jekyll de `../ese-back`.

**Deux dépôts sources**, à ne pas confondre :

- `../ese-back` — le site actuellement en ligne (ESE 2026). Source de référence,
  et emplacement du `MIGRATION_PLAN.md` faisant foi.
- `../esiea-secure-edition.github.io` — l'ancien dépôt de l'organisation, figé sur
  ESE 2023. Sert uniquement à l'archéologie des éditions ≤ 2023.

`MIGRATION_PLAN.md` à la racine d'ici en est une copie de travail :
**en cas de doute, c'est celui de `../ese-back` qui fait foi.**
`content-inventory.md` recense le contenu récupéré des deux dépôts et les
questions encore ouvertes.

## Règles

- **Node 24 partout** : workflows, Dockerfile, `engines`. Jamais Node 20.
- **Build local du site uniquement** (décidé le 10/09/2026) : `npm ci`,
  `astro check` et `astro build` se lancent en local pour vérifier avant de
  pousser. **Rien de Docker en local** : l'image et son démarrage sont testés
  par la CI, qui reste la référence. L'agent écrit le code et vérifie le site ;
  le propriétaire push.
- **zod s'importe depuis `astro/zod`**, pas depuis `astro:content` (déprécié,
  supprimé en Astro 8). API zod 4 : `z.url()` et `z.email()`, pas
  `z.string().url()`.
- **Ne rien committer ni pusher sans validation explicite du propriétaire.**
  Présenter les fichiers, attendre le feu vert.
- **Commentaires de code minimalistes** : seulement ce qui n'est pas déductible
  à la lecture.
- **Site 100 % français.** Pas d'i18n, pas de sélecteur de langue. Un talk donné
  en anglais porte `lang: en`, c'est tout.
- **Aucun tracker, aucun cookie, aucune ressource externe.** Polices
  self-hostées, images locales. La CSP est stricte et doit le rester.
- **Ne jamais inventer une donnée de contenu.** Ce qui n'est pas confirmé porte
  un commentaire YAML `À CONFIRMER` et n'est pas rendu.
- **Rien ne code en dur le propriétaire GitHub.** L'image est
  `ghcr.io/${{ github.repository }}` : `sebdraven` pendant le dev, `esiealab`
  après transfert, sans toucher au workflow. Seul `docker-compose.yml` (exemple
  d'exploitation) nomme l'organisation.

## Principe directeur

**Une édition = des fichiers de données, zéro HTML à toucher.** Ajouter une
édition, ouvrir un CFP, publier un programme, archiver : ce sont des fichiers
dans `src/content/`, jamais du code. Voir le `README.md` pour les procédures.

Tout ce qui est ponctuel (CFP, billetterie, slides, annonce) est une **news** en
markdown. Archiver une édition change un champ `status` et ne supprime rien.

## Branche

Le travail de migration se fait sur `migration`. Elle deviendra `main` et
branche par défaut une fois la recette (étape 6) validée.
