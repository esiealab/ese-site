# ese-site

Site de l'**ESIEA Secure Edition** (ESE), conférence annuelle de cybersécurité.
Site statique [Astro](https://astro.build), livré en image Docker.

En ligne : <https://ese.esiea.fr>

## Principe

**Une édition = des fichiers de données, zéro HTML à toucher.**

Tout le contenu vit dans `src/content/`, en YAML et markdown, validé par un
schéma au moment du build. Une erreur dans un fichier **casse la CI, jamais la
production** : un talk qui pointe vers un speaker inexistant, un horaire mal
écrit ou une thématique inconnue arrêtent le build avec un message explicite.

## Démarrer

```sh
npm ci
npm run dev          # http://localhost:4321, rechargement à chaud
npm run check        # validation des types et du contenu
npm run build        # génère dist/
npm run preview      # sert dist/ tel qu'il sera en production
```

Node 24 minimum.

## Où se trouve quoi

| Dossier | Contenu |
|---|---|
| `src/content/site.yaml` | nom, contact, réseaux, **édition courante** |
| `src/content/editions/` | une fiche par année : date, lieu, statut, thématiques, ESE4Kids |
| `src/content/talks/` | un fichier par créneau (`<année>-<HHMM>-<slug>.yaml`) |
| `src/content/speakers/` | une fiche par intervenant, partagée entre éditions |
| `src/content/kids/` | ateliers ESE4Kids |
| `src/content/sponsors/` | partenaires |
| `src/content/news/` | actualités en markdown (CFP, billetterie, slides…) |
| `src/content/pages/` | pages éditoriales (mentions légales) |
| `src/assets/partners/` | logos des partenaires (optimisés au build) |

Le reste (`src/components/`, `src/pages/`, `src/lib/`) est du code : on n'y
touche pas pour publier du contenu.

## Cycle de vie d'une édition

```
announced → cfp-open → program-published → past → archived
```

Le champ `status` de `editions/<année>.yaml` pilote **tout l'affichage de la
page d'accueil**. Archiver ne supprime rien : seul le champ change.

---

## Procédures

### 1. Annoncer une édition

1. Créer `src/content/editions/<année>.yaml` :
   ```yaml
   year: 2028
   date: 2028-05-27        # facultatif à ce stade
   venue: ESIEA
   address: 4 allée Katherine Johnson, 94200 Ivry-sur-Seine
   status: announced
   ```
2. Dans `src/content/site.yaml`, mettre `currentEdition: 2028`.
3. Passer l'édition précédente en `status: archived`.

Sans `date`, le hero affiche « Date à venir » — il n'invente rien.

### 2. Ouvrir le CFP

1. Créer `src/content/news/<aaaa-mm-jj>-cfp-<année>.md` :
   ```markdown
   ---
   title: Appel à conférences pour l'ESE 2028
   date: 2028-02-01
   edition: 2028
   tags: [cfp]
   pinned: true
   expires: 2028-04-15     # la date limite d'envoi
   ---

   Le texte de l'appel, en markdown.
   ```
2. Passer l'édition en `status: cfp-open`.

Le hero pointe automatiquement vers la news `cfp` la plus récente. Passé
`expires`, elle disparaît de la page d'accueil et un bandeau « annonce passée »
s'affiche sur la news, qui reste consultable.

### 3. Publier le programme

1. Déclarer les thématiques dans `editions/<année>.yaml` :
   ```yaml
   tracks:
     - id: reverse
       label: Reverse & Exploitation
       color: '#a855f7'
   ```
2. Créer un fichier par créneau dans `src/content/talks/`, nommé
   `<année>-<HHMM>-<slug>.yaml` (l'horaire dans le nom garantit l'unicité —
   plusieurs pauses portent le même titre) :
   ```yaml
   edition: "2028"
   start: "10:05"
   end: "10:45"
   title: "Titre de la conférence"
   kind: talk              # talk | workshop | break | lunch | opening | closing
   track: reverse          # obligatoire si l'édition déclare des tracks
   lang: fr                # `en` pour une conférence en anglais
   speakers:
     - prenom-nom
   abstract: >-
     Résumé en markdown, **les liens sont conservés**.
   ```
3. Créer les fiches manquantes dans `src/content/speakers/` :
   ```yaml
   name: Prénom Nom
   affiliation: Société
   ```
   Réutiliser le fichier existant si la personne est déjà intervenue.
4. Renseigner `ticketUrl`, passer en `status: program-published`, et publier une
   news `tags: [billetterie]`.

Ajouter `programStatus: provisoire` tant que le programme peut bouger.

### 4. Ajouter les ateliers ESE4Kids

1. Dans `editions/<année>.yaml` :
   ```yaml
   kids:
     ageRange: 8-18 ans
     sessions:
       - { label: Matin, start: '10:00', end: '13:00' }
     intro: >-
       Présentation en markdown.
     ticketUrl: https://…
     gift: Ce que reçoivent les enfants.
   ```
2. Un fichier par atelier dans `src/content/kids/` :
   ```yaml
   edition: "2028"
   title: La boîte à crypto
   emoji: 🔐
   description: >-
     Description en markdown.
   partner: { name: ARCSI, url: https://www.arcsi.fr/ }
   ```

La section n'apparaît que si `kids` est renseigné.

### 5. Ajouter un partenaire

1. Déposer le logo dans `src/assets/partners/`.
2. Créer `src/content/sponsors/<nom>.yaml` :
   ```yaml
   name: Nom du partenaire
   logo: logo.jpg          # nom du fichier, Astro s'occupe des dimensions
   url: https://…
   tier: partner           # platinum | gold | silver | partner
   editions: [2027, 2028]  # toutes les années concernées
   ```

Un partenaire déjà présent une année précédente : ajouter l'année à `editions`.
Aucune section n'est rendue si personne n'est rattaché à l'édition affichée.

### 6. Clôturer une édition

1. `status: past`.
2. Renseigner `slidesUrl` (lien global) et/ou `slides` sur chaque talk.
3. Publier une news `tags: [slides]`.

L'édition reste sur la page d'accueil jusqu'à l'annonce de la suivante.

### 7. Archiver

Passer `status: archived`, au plus tard en annonçant l'édition suivante.
Rien d'autre : les talks, speakers et news restent où ils sont, seule la
visibilité change. L'édition bascule dans `/archives/`.

### 8. Ajouter une édition ancienne aux archives

Créer `editions/<année>.yaml` en `status: archived` avec ce qu'on sait — pour
une édition archivée, **`date` et `venue` sont facultatifs**. Ajouter les talks
si le programme est connu ; sinon la page affiche « Programme non conservé ».

### 9. Publier une actualité

Un fichier markdown dans `src/content/news/`. `pinned: true` la remonte sur la
page d'accueil (3 maximum), `expires` la fait disparaître à une date donnée.

### 10. Déployer

Pousser sur `main` : GitHub Actions construit le site, puis l'image, et la
publie sur GHCR. Sur le serveur :

```sh
docker compose pull && docker compose up -d
```

Le nom de l'image suit le dépôt (`ghcr.io/<org>/<dépôt>`) : un transfert vers
une autre organisation ne demande aucune modification du workflow.

---

## Ce que la CI vérifie

- `astro check` : types et **schémas de contenu** (références, horaires, thématiques)
- `astro build` : toutes les pages se rendent
- l'image Docker se construit, **démarre**, répond, et sert les en-têtes de sécurité
- `zizmor` : sécurité des workflows
- hebdomadaire : liens morts (`lychee`), ouvre une issue le cas échéant

## Contraintes à respecter

Le site ne charge **aucune ressource externe** : ni police, ni script, ni image
tierce. La politique de sécurité (CSP) l'interdit, et elle interdit aussi tout
style ou script écrit directement dans le HTML. En pratique : pas d'attribut
`style="…"`, pas de `<style>` ni de `<script>` avec du code dedans.

Aucun cookie, aucun traceur.
