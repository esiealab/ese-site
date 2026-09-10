# Contribuer

## Règle générale

Tout passe par une **pull request**. La CI fait foi : si elle échoue, la PR ne
part pas en production. Personne ne pousse directement sur `main`.

## Conventions de nommage

| Collection | Nom de fichier | Exemple |
|---|---|---|
| éditions | `<année>.yaml` | `2027.yaml` |
| talks | `<année>-<HHMM>-<slug>.yaml` | `2026-1005-drivers-vulnerability.yaml` |
| speakers | `<prenom>-<nom>.yaml` | `mathieu-renard.yaml` |
| ateliers kids | `<année>-<slug>.yaml` | `2026-ctf-junior.yaml` |
| partenaires | `<nom>.yaml` | `misc.yaml` |
| news | `<aaaa-mm-jj>-<slug>.md` | `2026-04-10-cfp-2026.md` |

Les slugs sont en minuscules, sans accent, mots séparés par des tirets.
L'horaire dans le nom des talks n'est pas décoratif : il garantit l'unicité
(plusieurs pauses portent le même titre) et donne un tri naturel.

Un speaker a **un seul fichier**, réutilisé d'une édition à l'autre. Vérifier
avant d'en créer un : `ls src/content/speakers/ | grep -i <nom>`.

## Avant d'ouvrir une PR

```sh
npm run check    # types + schémas de contenu
npm run build    # toutes les pages se rendent
```

Ces deux commandes sont celles que lance la CI. Le build de l'image Docker,
lui, se fait uniquement en CI.

## Contenu

- **Ne jamais inventer une donnée.** Une information non confirmée reste un
  commentaire YAML (`# À CONFIRMER`), elle n'est pas publiée.
- Le site est **en français**. Une conférence donnée en anglais porte
  `lang: en` sur le talk ; on ne traduit pas le site.
- Les dates s'écrivent au format ISO (`2027-04-24`) dans les fichiers : le
  formatage en français est fait à l'affichage.
- Les résumés acceptent du markdown, liens compris.

## Code

- Pas de framework côté navigateur. Le seul JS admis est le filtre du planning
  et le menu mobile, en vanilla, et **tout doit rester lisible sans JS** : les
  filtres masquent, ils ne révèlent jamais.
- Commentaires minimalistes : uniquement ce qui ne se déduit pas du code.
- Aucune ressource externe, aucun style ni script inline (voir le README).
- Mobile d'abord : tout est conçu pour 360 px de large, puis élargi.

## Recette responsive

Avant une évolution du design, rejouer la recette : elle rend chaque page en
360×800, 768×1024, 1024×768 et 1440×900, et signale tout débordement
horizontal, toute cible tactile sous 44 px et toute erreur console.

```sh
npm install --no-save playwright   # utilise le Chrome de la machine
npm run build && npm run preview
node scripts/recette.mjs
```

Lighthouse (viser ≥ 90 partout, on est à 99/100/100/100) :

```sh
npx lighthouse http://localhost:4322/ --view
```

## Vérifier une modification de contenu

Le plus simple est `npm run dev` : la page se recharge à chaque enregistrement.
Une erreur de schéma s'affiche directement dans le navigateur, avec le fichier
et le champ fautifs.
