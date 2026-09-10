# Plan de migration — site ESIEA Secure Edition (Jekyll → Astro, livré en image Docker)

Ce document est destiné à un agent de développement. Il décrit l'état du dépôt actuel, la cible, et les étapes à exécuter dans l'ordre. Chaque étape a un livrable et un critère d'acceptation.

## Contexte opératoire

- Dépôt source : **ce dossier (`ese-back`)**, branche `master`. C'est la version en ligne d'ESE 2026. Un second dépôt, `../esiea-secure-edition.github.io`, contient l'ancien site (figé sur ESE 2023) ; il ne sert qu'à l'archéologie des éditions antérieures.
- Tout se fait sur le filesystem, pas via l'API GitHub.
- Dépôt cible : nouveau dossier frère `../ese-site` (à créer, `git init`, branche `master`).
- Hébergement du dépôt et de l'image : **phase de dev sous `github.com/sebdraven/ese-site` → `ghcr.io/sebdraven/ese-site`** ; **cible finale sous l'organisation `esiealab`** → `github.com/esiealab/ese-site`, `ghcr.io/esiealab/ese-site`. Le transfert se fait par « Transfer repository » GitHub ; rien dans le code ne doit coder en dur `sebdraven` ni `esiealab` (voir Livraison Docker).
- **Build local du site uniquement** (décidé le 10/09/2026) : `npm ci`, `astro check` et `astro build` s'exécutent en local pour vérifier avant de pousser. **Rien de Docker en local** : image et conteneur sont construits et testés par la CI/CD GitHub Actions, qui reste la référence. L'agent écrit le code et vérifie le site ; le propriétaire push.
- Ne rien committer ni pusher sans validation explicite du propriétaire : présenter les fichiers, attendre le feu vert.
- Node 24 partout (workflows, Dockerfile, `engines`). Jamais Node 20.
- Commentaires de code minimalistes : seulement ce qui n'est pas déductible à la lecture.
- Ces règles sont recopiées dans `ese-site/CLAUDE.md` dès l'étape 1, avec un pointeur vers ce plan : l'agent qui travaille dans `ese-site` ne lit pas ce dépôt-ci.

## Décisions figées

- **Édition courante = ESE 2027.** Le site part avec `site.currentEdition: 2027` et `editions/2027.yaml` en `status: announced`, **`date: 2027-04-24`** (dernier samedi d'avril 2027 — provisoire, fixé le 10/09/2026, à confirmer avant `cfp-open`). Lieu par défaut : **ESIEA, 4 allée Katherine Johnson, 94200 Ivry-sur-Seine** (celui de 2026), à confirmer. La home ne doit jamais afficher une donnée inventée : ce qui n'est pas confirmé porte `À CONFIRMER` en commentaire YAML, pas dans le rendu. 2026 et toutes les éditions antérieures sont `archived` dès la migration.
- Site **100 % français**. Pas d'i18n. Un talk en anglais est marqué `lang: en` sur le talk.
- **Archives = programme uniquement** : date, lieu, programme des conférences (créneaux, titres, speakers, affiliations, thématique, résumé), lien slides s'il existe, et la liste des ateliers ESE4Kids (titres) si connue. Pas de photos, vidéos, galerie, bilan, snapshot HTML. Une édition sans programme reconstructible apparaît avec date et lieu seulement.
- **Partenaires** : il en existe (MISC / Éditions Diamond en 2026). La section n'est rendue que si au moins un partenaire est rattaché à l'édition affichée.
- **ESE4Kids** fait partie du site : ateliers, tranche d'âge, sessions, billetterie. Rendu seulement si l'édition a des ateliers.
- **Responsive obligatoire** : téléphone, tablette, desktop. Voir Design.
- **Aucun tracker, aucun cookie, aucune ressource externe** (polices self-hostées, plus de reCAPTCHA).
- **JS client** : progressif et minimal, vanilla, sans framework. Autorisé : menu mobile, filtre du planning par thématique. Tout doit rester lisible et complet JS désactivé (les filtres masquent, ils ne révèlent jamais).

## 1. État des lieux de `ese-back`

Thème Jekyll « Agency » (y7kim, 2014) : Bootstrap 3, jQuery 1.11, Font Awesome 4, plugin Ruby `_plugins/hex_to_rgb.rb`, CSS généré par `_layouts/style.css` depuis `_data/template.yml`. Jekyll 4.3.3 via `Gemfile`. `build.yml` produit un artefact `_site/` mais écoute la branche `main` : il ne se déclenche jamais sur `master`.

Page unique assemblée dans `_layouts/default.html` :
`head` + `header` + `detailESE` + `planning` + `programme` (caché, sert de source aux modales) + `esekids` + `partners` + `footer` + `js`. Commentés : `cfp`, `historique`, `inscription`. Non inclus : `team`, `contact`.

### Contenu vivant (à migrer)

| Fichier | Contenu | Destination |
|---|---|---|
| `_config.yml` | titre, email `ese@esiea.fr`, LinkedIn `esiea-secure-edition`, adresse **périmée** (rue de Vesale) | `site.yaml` (adresse = Ivry) |
| `_includes/header.html` | logos ESE + ESIEA, hero « Le 30 mai 2026 » | `Hero`, donnée d'édition |
| `_includes/detailESE.html` | intro ESE 2026 (14e, depuis 2013), lieu Ivry + accès métro 7 / RER C, billetweb `ese-2026`, ESE4Kids en bref, remerciement partenaire | `editions/2026.yaml` (`intro`, `venue`, `address`, `access`, `ticketUrl`) |
| `_includes/planning.html` | timeline 09h15–16h45, 9 talks + ouverture/clôture + pauses, 4 thématiques colorées, filtres, modale | `editions/2026.yaml` (`tracks`) + `talks/2026-*.yaml` + composant `Planning` |
| `_includes/programme.html` | résumés `conf1`…`conf9` avec liens | `talks/*.abstract` (markdown, liens conservés) |
| `_includes/esekids.html` | 4 ateliers 8-18 ans, 2 sessions, ESIEAtoy, partenaires ARCSI / Dunod | `editions/2026.yaml` (`kids`) + `kids/2026-*.yaml` |
| `_includes/partners.html`, `img/partners/Logo-MISC-Mag.jpg` | MISC / Éditions Diamond | `sponsors/misc.yaml` (`tier: partner`, `editions: [2026]`) |
| `_includes/cfp.html` (commenté) | CFP 2026, formats 20/35 min, deadline 7 mai 2026 | news `news/2026-xx-xx-cfp-2026.md` (`tags: [cfp]`, `expires: 2026-05-07`) |
| `_includes/historique.html` (commenté) | texte « depuis 2013 » + thèmes couverts | `site.yaml` `history` (markdown), affiché en tête de `/archives/` |
| `_includes/team.html` (non inclus) | 8 volontaires étudiants (prénom + initiale) | `editions/2026.yaml` `volunteers[]`, rendu si présent |
| `_data/template.yml` | couleurs `3cb371` / `6ecf99` / `00283c` / `777` | `tailwind.config` |
| couleurs des thématiques dans `planning.html` | reverse `#a855f7`, hardware `#f97316`, defense `#0ea5e9`, cognitive `#22c55e` | `editions/2026.yaml` `tracks[].color` |
| `img/logo.png`, `img/esiea.png`, `img/header-bg.jpg`, `favicon.ico` | assets | `public/` |
| historique git (`git log -p -- _includes/`) | éditions 2024, 2025 et versions successives de 2026 | `talks/` + `speakers/` |

### Résidus à ne PAS migrer

- Thème : `_includes/old_templates/*`, `_includes/modals.html`, `_posts/2014-*`, `img/map-image.png`, `img/Summer.jpeg` (vérifier qu'elle n'est référencée nulle part).
- Morts ou dangereux : `mail/contact_me.php`, `_includes/contact.html`, `.htaccess`, `feed.xml` et `_layouts/feed.xml` (vides), `index.html`, `_includes/inscription.html` + `css/inscription.css`, `_plugins/hex_to_rgb.rb`, `js/*` (jQuery, Bootstrap 3, cbpAnimatedHeader, jqBootstrapValidation, contact_me.js), `css/font-awesome`, `_includes/css/*` (Bootstrap, styles par section — à réécrire en Tailwind).
- `head.html` : 5 polices Google hotlinkées (Montserrat, Kaushan Script, Lato, Droid Serif, Roboto Slab) + `recaptcha/api.js` + un `reset()` sur un formulaire inexistant. Rien de tout ça ne passe.
- `CNAME` : l'hébergement change ; ne pas le reprendre.
- `ESE Call_for_paper.docx`, `_includes/old_templates/*.docx` : texte repris dans la news CFP si plus complet que `cfp.html`, fichiers non commités.
- `build.yml` : remplacé, pas porté.

### Points ouverts à trancher AVANT l'étape 3

1. **Éditions 2024 et 2025** : `git log -p -- _includes/planning.html _includes/programme.html _includes/detailESE.html _includes/header.html` dans `ese-back`, puis l'historique de `../esiea-secure-edition.github.io` pour 2023 et avant, puis Wayback pour les trous. Ne rien inventer.
2. ~~Numérotation~~ : **tranché le 10/09/2026 — les numéros d'édition sont abandonnés.** Les sources se contredisent (`#ESE8` 2020, `#ESE9` 2021, `#ESE10` 2023, `#ESE14` 2026) et aucune numérotation ne les satisfait toutes. Les éditions sont désignées par leur année ; pas de champ `number`, et la tagline reprise de `_config.yml` est débarrassée de son hashtag `#ESEnn`.
3. **Date 2026 des versions successives** : le hero et le planning disent 30 mai ; la news CFP doit être datée d'après le commit qui l'a introduite.

## 2. Cible

### Stack

- **Astro** (TypeScript), sortie 100 % statique, **content collections** avec schémas zod.
- **Tailwind CSS** (intégration officielle Astro).
- Intégrations Astro : `@astrojs/sitemap`, `@astrojs/rss` (flux des news).
- JS client : voir Décisions figées.
- Polices self-hostées : `@fontsource/montserrat` (titres), `@fontsource/lato` (corps, comme aujourd'hui), une mono système pour les horaires. Kaushan Script, Droid Serif, Roboto Slab abandonnées.
- **Livraison : image Docker** (nginx servant `dist/`), construite par GitHub Actions et publiée sur GHCR. Pas de GitHub Pages.
- **Netlify plus tard, en option** : Astro sort un `dist/` statique, Netlify le sert tel quel. Pour ne rien fermer : aucune fonctionnalité ne dépend de nginx (les 301 sont dans `astro.config` `redirects`, nginx les double), pas de header critique uniquement côté nginx, pas de chemin absolu vers `/usr/share/nginx/html`. Le jour venu : un `netlify.toml` (build `npm run build`, publish `dist`, Node 24, headers). Rien à faire maintenant.

Justification (pour le propriétaire, pas pour le code) : Eleventy n'a ni typage du contenu ni composants ; Next/Nuxt sont surdimensionnés sans backend. Le gain « mise à jour simple » vient du schéma validé au build : une erreur dans un YAML casse la CI, jamais la prod.

### Principe directeur

**Une édition = des fichiers de données, zéro HTML à toucher.** Ajouter ESE 2027 = créer `editions/2027.yaml`, une news CFP, des `talks/2027-*.yaml`, éventuellement des `kids/2027-*.yaml`, pousser. La home se reconfigure seule selon `status`. Tout ce qui est ponctuel (CFP, billetterie, slides, annonce speaker) est une **news** markdown. Archiver = changer un champ.

### Arborescence

```
ese-site/
├── CLAUDE.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # PR : install, astro check, build, build image sans push
│   │   ├── release.yml            # master : build site + build/push image GHCR
│   │   ├── zizmor.yml             # audit sécurité des workflows → SARIF
│   │   └── links.yml              # cron hebdo : lychee → issue liens morts
│   ├── dependabot.yml
│   └── ISSUE_TEMPLATE/nouvelle-edition.md
├── Dockerfile
├── .dockerignore
├── docker/nginx.conf
├── docker-compose.yml
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json                   # engines.node >=24
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── img/                       # logo.png, esiea.png, header-bg.jpg, speakers/, partners/
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── site.yaml
│   │   ├── editions/<year>.yaml
│   │   ├── talks/<year>-<slug>.yaml
│   │   ├── speakers/<slug>.yaml
│   │   ├── kids/<year>-<slug>.yaml
│   │   ├── sponsors/<slug>.yaml
│   │   ├── news/<yyyy-mm-dd>-<slug>.md
│   │   └── pages/mentions-legales.md
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── EditionIntro.astro     # intro + lieu + accès + billetterie
│   │   ├── Planning.astro         # timeline + filtres par thématique
│   │   ├── TalkCard.astro         # créneau, thématique, titre, speakers, résumé dépliable
│   │   ├── TrackBadge.astro
│   │   ├── Kids.astro             # ESE4Kids : intro, sessions, ateliers
│   │   ├── Partners.astro
│   │   ├── Volunteers.astro
│   │   ├── NewsCard.astro
│   │   ├── ArchiveCard.astro
│   │   └── Footer.astro
│   ├── layouts/Base.astro
│   ├── scripts/planning-filter.ts # seul script client hors menu
│   └── pages/
│       ├── index.astro
│       ├── news/index.astro
│       ├── news/[slug].astro
│       ├── rss.xml.ts
│       ├── archives/index.astro
│       ├── archives/[year].astro
│       ├── mentions-legales.astro
│       └── 404.astro
├── README.md
├── CONTRIBUTING.md
└── LICENSE                        # reprendre celle de ese-back
```

### Modèle de données (`src/content.config.ts`)

Collections `file()` / `glob()` avec schémas zod :

- **site** (`site.yaml`, singleton) : `name`, `tagline`, `email`, `social[] {name, url}`, `organizer {name, url}`, `currentEdition` (year), `firstEdition` (2013), `history` (markdown, depuis `historique.html`).
- **editions** : `year`, `date?` (obligatoire dès que `status` ≠ `announced`), `dateEnd?`, `venue?`, `address?`, `mapUrl?`, `access?` (markdown : métro, RER), `price?`, `ticketUrl?`, `slidesUrl?`, `status` enum `announced | cfp-open | program-published | past | archived`, `intro?` (markdown), `tracks[]? {id, label, color}`, `kids? {ageRange, sessions[] {label, start, end}, intro (markdown), ticketUrl?, gift?}`, `volunteers[]?` (strings), `programStatus?` enum `provisoire | définitif`.
- **talks** : `edition` (ref), `start`, `end` (HH:MM), `title`, `speakers[]` (refs, vide pour les pauses), `kind` enum `talk | workshop | break | lunch | opening | closing`, `track?` (id d'un `tracks[]` de l'édition ; obligatoire si `kind: talk`), `lang` défaut `fr`, `abstract?` (markdown, liens conservés), `slides?`, `maxAttendees?`.
- **speakers** : `name`, `affiliation?`, `handle?`, `bio?`, `photo?`, `links? {web, linkedin, mastodon, bluesky, github, twitter}`.
- **kids** : `edition` (ref), `title`, `emoji?`, `description` (markdown), `partner? {name, url}`.
- **sponsors** : `name`, `logo`, `url`, `tier` enum `platinum | gold | silver | partner`, `editions[]`.
- **news** (`glob` `news/*.md`) : `title`, `date`, `edition?`, `tags[]`, `pinned?`, `expires?` ; corps markdown. Le CFP = news `tags: [cfp]`, `expires: <deadline>`.
- **pages** (`glob` `pages/*.md`) : `title` ; corps markdown.

Validation au build :
- `site.currentEdition` existe et n'est pas `archived`.
- Chaque ref (`talk.edition`, `talk.speakers[]`, `talk.track`, `kids.edition`, `news.edition`) résout ; `talk.track` doit exister dans `tracks[]` de **son** édition.
- Pas de chevauchement horaire entre deux talks d'une même édition (avertissement).

### Cycle de vie d'une édition

`announced` → `cfp-open` → `program-published` → `past` → `archived`

- `past` : l'édition vient d'avoir lieu ; reste sur la home jusqu'à l'annonce de la suivante.
- `archived` : n'apparaît plus que dans `/archives/`. Rien n'est supprimé ni déplacé, seule la visibilité change. Passage manuel.

### Planning (composant central)

Reprend la timeline actuelle de `planning.html`, sans jQuery :
- Une `TalkCard` par créneau : horaire (début → fin), `TrackBadge` coloré par `tracks[].color` de l'édition, titre, speakers · affiliation, et le **résumé dépliable en `<details>`** (remplace la modale ; fonctionne sans JS, indexable, accessible au clavier).
- Pauses et déjeuner rendus en ligne discrète ; ouverture/clôture avec les noms.
- **Filtres par thématique** (`planning-filter.ts`) : boutons « Tout » + un par track ; le filtre atténue les créneaux hors thématique (comme aujourd'hui). Sans JS : boutons absents, tout est affiché.
- Mention `programStatus` (« programme provisoire ») sous le titre si renseignée.
- Couleurs de track : variables CSS injectées depuis les données, pas de classes Tailwind en dur par thématique (les thématiques changent chaque année).

### Comportement de la home (`index.astro`)

1. Hero (date, lieu, CTA selon `status`).
2. News épinglées non expirées (max 3).
3. `EditionIntro` : intro, lieu + carte (lien OSM), accès, billetterie.
4. `Planning` si `status: program-published | past`.
5. `Kids` si `edition.kids` renseigné.
6. `Partners` si au moins un sponsor rattaché à l'édition.
7. `Volunteers` si `volunteers[]` renseigné.
8. Bandeau « Éditions précédentes » : 3 dernières archives → `/archives/`.

CTA du Hero selon `status` :
- `announced` : aucun ; « ESE 2027 — date à venir » si `date` absente.
- `cfp-open` : lien vers la news `cfp` la plus récente.
- `program-published` : bouton billetterie.
- `past` : lien slides + `/archives/`.

### Autres pages

- `/news/`, `/news/<slug>/`, `/rss.xml`.
- `/archives/` : `site.history` en tête, puis une `ArchiveCard` par édition `archived` ou `past` (année, numéro, date, lieu, nb de talks), compteur « n éditions depuis 2013 ».
- `/archives/<year>/` : fiche + `Planning` en lecture (mêmes composants) + liste des ateliers ESE4Kids (titres) + `slidesUrl`. Bandeau « Édition passée ». Édition sans talk : fiche + « programme non conservé ».
- Alias 301 : `/editions/…` → `/archives/…`.
- `/mentions-legales/` : éditeur ESIEA, directeur de publication, hébergeur (`À RENSEIGNER`), pas de cookies ni traceurs, contact. Lien footer.
- Ancres `#planning`, `#esekids`, `#news` sur la home (les deux premières sont déjà diffusées).

### Design

- Identité : primaire `#3cb371`, secondaire `#6ecf99`, sombre `#00283c`, muted `#777` → `tailwind.config` `theme.extend.colors.ese`.
- Montserrat titres, Lato corps, mono système pour les horaires.
- Hero avec `header-bg.jpg` (`astro:assets`, WebP).
- Mobile-first, contraste AA, `prefers-reduced-motion`.
- Breakpoints : `sm` 640, `md` 768, `lg` 1024. Conçu d'abord pour 360 px.
- Nav : compacte + menu replié sous `md`. Logos réduits, jamais tronqués.
- Planning : timeline verticale à tous les formats ; sous `md`, horaire au-dessus de la carte (comme le `@media (max-width: 700px)` actuel), jamais de débordement horizontal.
- CTA pleine largeur sous `sm` ; cibles tactiles ≥ 44 px ; rien porté par le hover.
- Pas de largeur fixe hors images ; `grid`/`flex` avec `minmax`.
- Dates en français via `Intl.DateTimeFormat('fr-FR')`.
- Recette : 360×800, 768×1024, 1024×768, 1440.

### Livraison Docker

- `Dockerfile` multi-étapes : `node:24-alpine` (`npm ci`, `npx astro check`, `npx astro build`) → `nginxinc/nginx-unprivileged:alpine` (`dist/` → `/usr/share/nginx/html`, `docker/nginx.conf`, port 8080, `HEALTHCHECK`).
- `docker/nginx.conf` : `try_files $uri $uri/ $uri.html /404.html`, gzip, cache long `/_astro/*`, court sur HTML, 301 `/editions/…`, en-têtes `X-Content-Type-Options`, `Referrer-Policy`, CSP stricte (`default-src 'self'`, pas d'`unsafe-inline` : styles et scripts sont des fichiers, y compris les variables de couleur des tracks → attribut `style` autorisé par `style-src 'self' 'unsafe-inline'` uniquement si indispensable, sinon classes générées), pas de listing.
- `.dockerignore` : `node_modules`, `dist`, `.git`, `.github`.
- Image : `ghcr.io/${{ github.repository }}`, jamais en dur. Tags `latest`, `sha-<short>`, tag git. Labels OCI via `metadata-action`.
- `docker-compose.yml` d'exemple : `image: ghcr.io/esiealab/ese-site:latest` (seul endroit où l'org apparaît), `pull_policy: always`, `restart: unless-stopped`, port derrière le reverse proxy. TLS et `ese.esiea.fr` portés par le proxy.

## 3. Étapes d'exécution

### Étape 0 — Archéologie du contenu
- `ese-back` : `git log -p -- _includes/planning.html _includes/programme.html _includes/detailESE.html _includes/header.html _includes/cfp.html _includes/esekids.html _layouts/default.html` → 2026 (toutes versions), 2025, 2024 si présents.
- `../esiea-secure-edition.github.io` : `git log -p -- _includes/speakers.html _includes/programme.html _includes/edition10.html _includes/header.html` → 2023, 2022 et avant.
- Wayback pour les trous jusqu'à 2013.
- Livrable : `content-inventory.md` dans `ese-site` : par année, numéro, date, lieu, programme (complet / partiel / absent), thématiques, ateliers kids, partenaires, slides.
- Acceptation : le propriétaire valide année par année ; les points ouverts de la section 1 sont réglés.

### Étape 1 — Squelette
- `../ese-site` : `git init`, `CLAUDE.md`, `package.json` (Astro, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/rss`, `@fontsource/montserrat`, `@fontsource/lato`, `engines.node >=24`), `astro.config.mjs` (`site: 'https://ese.esiea.fr'`, sitemap, `redirects`), `tsconfig.json`, `tailwind.config.mjs`, `.gitignore`, `LICENSE`.
- `content.config.ts` complet.
- Acceptation : `astro check` passe en CI avec des collections vides.

### Étape 2 — CI/CD et image
- `ci.yml` (PR) : `checkout` → `setup-node` (24, cache npm) → `npm ci` → `astro check` → `astro build` → `docker/build-push-action` `push: false`.
- `zizmor.yml` (push, PR, cron) : `zizmorcore/zizmor-action`, `--persona pedantic`, SARIF → Code scanning ; `high`+ bloque. Tous les workflows : actions épinglées par SHA + commentaire de version, `permissions` minimales par job, pas de `pull_request_target`, pas de `${{ }}` non fiable dans `run:`, `persist-credentials: false` quand le token est inutile.
- `release.yml` (push `master`, tags `v*`) : buildx → login GHCR (`GITHUB_TOKEN`) → `metadata-action` → build-push `push: true`. `permissions: contents: read, packages: write`.
- `links.yml` (cron hebdo + manuel) : lychee sur `dist/`, issue « Liens morts ». Ne bloque jamais.
- `Dockerfile`, `.dockerignore`, `docker/nginx.conf`, `docker-compose.yml`, `dependabot.yml` (npm, actions, docker).
- Acceptation : push sur master → `ghcr.io/sebdraven/ese-site:latest` ; le propriétaire vérifie sur le host avec `docker compose up -d` puis `docker compose logs` ; package GHCR public ; zizmor sans finding sur les 4 workflows.

### Étape 3 — Contenu
- `site.yaml` : depuis `_config.yml` + `historique.html` ; LinkedIn seul réseau ; adresse Ivry.
- `editions/2027.yaml` : `status: announced`, `number: 15`, `date: 2027-04-24`, `venue`/`address` Ivry, `site.currentEdition: 2027`.
- `editions/2026.yaml` : `archived`, `number: 14`, `date: 2026-05-30`, lieu, `access`, `mapUrl`, `ticketUrl` billetweb, `intro` depuis `detailESE.html`, `tracks` (4, avec leurs couleurs), `kids` (8-18, sessions 10h-13h / 14h-17h, ESIEAtoy), `volunteers` depuis `team.html`.
- `talks/2026-*.yaml` : 9 talks + ouverture + clôture + 3 pauses, depuis `planning.html` ; `abstract` depuis `programme.html` avec les liens ; `track` d'après `data-cat`.
- `speakers/` : un fichier par personne (Lucas Sevilla, Pierre Marty, Mathieu Renard, Noé Roussel, Victor Poggi, Cyril Thomas, Christophe Rieunier, Adrian Stephan, Cyrielle Guilliot, M82 Project, Sébastien Larinier, Vincent Guyot), dédoublonnés avec les autres années.
- `kids/2026-*.yaml` : 4 ateliers depuis `esekids.html` (partenaires ARCSI, Dunod).
- `sponsors/misc.yaml` : `tier: partner`, `editions: [2026]`, logo copié dans `public/img/partners/`.
- `news/2026-…-cfp-2026.md` depuis `cfp.html`, `expires: 2026-05-07`.
- Autres éditions validées à l'étape 0, toutes `archived`.
- `pages/mentions-legales.md` avec `À RENSEIGNER`.
- Assets : `logo.png`, `esiea.png`, `header-bg.jpg`, `favicon.ico`.
- Acceptation : `astro check` passe ; la home affiche « ESE 2027 — samedi 24 avril 2027, ESIEA Ivry-sur-Seine » ; `/archives/2026/` reproduit intégralement la timeline de `planning.html` (horaires, titres, speakers, thématiques) et les 9 résumés ; les 4 ateliers kids et le partenaire MISC y figurent.

### Étape 4 — Composants et pages
- Ordre : `Base`, `Nav`, `Footer`, `Hero`, `EditionIntro`, `TrackBadge`, `TalkCard`, `Planning` + `planning-filter.ts`, `Kids`, `Partners`, `Volunteers`, `NewsCard`, `ArchiveCard` ; puis `index`, `news/*`, `rss.xml.ts`, `archives/*`, `mentions-legales`, `404`.
- Meta OG/Twitter, `robots.txt`, sitemap.
- Acceptation : toutes les routes rendent ; la home change selon `status`, news, présence de `kids`, sponsors, volunteers ; le planning filtre par thématique et reste complet JS désactivé ; les résumés se déplient au clavier.

### Étape 5 — Documentation
- `README.md`, procédures = fichiers à toucher :
  1. *Annoncer* : `editions/<year>.yaml` (`announced`), `site.currentEdition`.
  2. *Ouvrir le CFP* : news `cfp` (`pinned`, `expires`), `status: cfp-open`.
  3. *Publier le programme* : `tracks[]` dans l'édition, `talks/<year>-*.yaml`, `speakers/`, `kids/` si ESE4Kids, `programStatus: provisoire`, `status: program-published`, `ticketUrl`, news `billetterie`.
  4. *Figer le programme* : `programStatus: définitif`.
  5. *Clôturer* : `status: past`, `slidesUrl`, slides par talk, news `slides`.
  6. *Archiver* : `status: archived`. Rien d'autre.
  7. *Ajouter une édition ancienne* : `editions/<year>.yaml` en `archived` + talks si connus.
  8. *Publier une news* : un fichier markdown.
  9. *Déployer* : push master → image GHCR → `docker compose up -d` sur le host.
- `CONTRIBUTING.md`, `ISSUE_TEMPLATE/nouvelle-edition.md` (checklist des phases 1-6).
- Acceptation : une personne sans connaissance d'Astro peut suivre le README.

### Étape 6 — Recette
- Toutes les routes, redirections, 404, aux quatre tailles ; timeline sans débordement ; filtres OK ; `<details>` OK.
- Lighthouse ≥ 90 (perf, a11y, SEO) home et archive.
- Aucune ressource externe hors liens sortants ; CSP sans violation.
- Image < 50 Mo, non-root, healthcheck vert.

### Étape 7 — Transfert vers `esiealab` (propriétaire)
1. Settings → Transfer repository → `esiealab` ; le workflow publie sous `ghcr.io/esiealab/ese-site` au premier push.
2. Remote local, package GHCR public, `image:` du compose sur le host.
3. Dependabot et `packages: write` actifs dans l'org.

### Étape 8 — Bascule DNS (propriétaire)
1. Image déployée derrière le reverse proxy, vhost `ese.esiea.fr` + TLS.
2. DNS `ese.esiea.fr` → host de prod (TTL abaissé 24 h avant).
3. Propagé : supprimer `CNAME` de `ese-back`, archiver `ese-back` et `esiea-secure-edition.github.io` avec un README vers `esiealab/ese-site`.

## 4. Hors périmètre

- Pas de backend, pas de formulaire (contact = mailto, inscription = billetterie externe).
- Pas de CMS (Decap CMS possible plus tard sans changer le modèle).
- Pas de GitHub Pages ; Netlify après, sans changement de code.
- Pas de médias d'archive (photos, vidéos, PDF embarqués).
- Pas d'i18n.
