# Inventaire du contenu — ESIEA Secure Edition

Étape 0 du plan de migration. **Deux dépôts sources** :

- `../ese-back` — le site en ligne (fork `sebdraven/esiea-secure-edition.github.io`,
  branche `main`, 432 commits, dernier le 28/05/2026). Source de référence.
- `../esiea-secure-edition.github.io` — l'ancien dépôt de l'organisation, figé sur
  ESE 2023 (`master` = `138a89b`, 04/07/2023). Sert uniquement à l'archéologie des
  éditions ≤ 2023.

**Ce document doit être validé année par année par le propriétaire avant toute
conversion en fichiers de contenu (étape 3).**

## Synthèse

| Année | Date | Lieu | Programme | Slides | Statut cible |
|---|---|---|---|---|---|
| 2013 | ? | ? | absent | — | `archived`, fiche vide |
| 2014 | ? | ? | absent | — | `archived`, fiche vide |
| 2015 | ? | ? | absent | — | `archived`, fiche vide |
| 2016 | ? | ? | absent | — | `archived`, fiche vide |
| 2017 | ? | ? | absent | — | `archived`, fiche vide |
| 2018 | ? | ? | absent | — | `archived`, fiche vide |
| 2019 | ? | ? | absent | — | `archived`, fiche vide |
| 2020 | — | — | **annulée** | — | à trancher (Q2) |
| 2021 | — | — | **annulée** | — | à trancher (Q2) |
| 2022 | samedi 21 mai 2022 | ESIEA Paris | **complet** (15 créneaux) | — | `archived` |
| 2023 | samedi 17 juin 2023 | ESIEA Paris | **complet** (16 créneaux) | `http://u.pc.cd/zXJ` | `archived` |
| 2024 | samedi 25 mai 2024 | ESIEA Paris | **complet** (13 créneaux) | — | `archived` |
| 2025 | samedi 17 mai 2025 | ? *(à confirmer)* | **complet** (13 créneaux) | — | `archived` |
| 2026 | samedi 30 mai 2026 | ESIEA Ivry-sur-Seine | **complet** (15 créneaux + 4 ateliers) | — | `archived` |
| 2027 | samedi 24 avril 2027 *(provisoire)* | Ivry *(à confirmer)* | — | — | `announced` |

Aucune trace des éditions 2013 à 2019 dans l'un ou l'autre dépôt : le thème Jekyll
a été importé le 06/01/2020 et l'historique antérieur appartient au thème
« Agency » de y7kim.

## Les numéros d'édition sont abandonnés

Décision du propriétaire, 10/09/2026 : **le site n'affiche plus de numéro
d'édition**, les éditions sont désignées par leur année.

La raison : les sources se contredisent et rien ne permet de trancher.
`_config.yml` a porté `#ESE8` (2020), `#ESE9` (2021), `#ESE10` (2023) puis
`#ESE14` (2026) — aucune numérotation cohérente ne satisfait ces quatre valeurs,
qu'on compte ou non les éditions 2020 et 2021, annulées. Plutôt que de publier un
numéro faux, on n'en publie aucun.

Conséquences : pas de champ `number` dans le schéma `editions` ; la tagline
reprise de `_config.yml` doit être **débarrassée de son hashtag `#ESEnn`** ; les
titres restent « ESE 2026 », « ESE 2027 ».

## Éditions dont le programme est récupérable

### ESE 2026 — samedi 30 mai 2026, ESIEA Ivry-sur-Seine

Source : `ese-back` sur `main` (état courant).

Lieu : **ESIEA, 4 allée Katherine Johnson, 94200 Ivry-sur-Seine**. Accès : métro
Mairie d'Ivry (ligne 7), RER C Ivry-sur-Seine. Carte :
`https://www.openstreetmap.org/#map=18/48.8119459/2.3929590`.
Billetterie : `https://www.billetweb.fr/ese-2026`. Programme annoncé **provisoire**.

Thématiques (`tracks`, couleurs depuis `planning.html`) : `reverse` Reverse &
Exploitation `#a855f7`, `hardware` Hardware Security `#f97316`, `defense` Défense
& Confiance `#0ea5e9`, `cognitive` Désinformation `#22c55e`.

| Horaire | Type | Thème | Titre | Intervenants |
|---|---|---|---|---|
| 09:15–10:00 | break | — | Accueil | — |
| 10:00–10:05 | opening | — | Ouverture de l'ESE | Sébastien Larinier, Vincent Guyot |
| 10:05–10:45 | talk | reverse | Drivers Vulnerability | Lucas Sevilla (Quarkslab) |
| 10:45–11:25 | talk | reverse | Le GOAT : analyse dynamique de malware Windows | Pierre Marty (LORIA) |
| 11:25–11:40 | break | — | Pause | — |
| 11:40–12:20 | talk | hardware | Reverse d'un outil de bypass de protection JTAG | Mathieu Renard « @Gotohack » (Twisted Wires) |
| 12:20–12:35 | talk | hardware | Le NFC à longue distance ?! | Noé Roussel |
| 12:35–12:50 | talk | defense | Un peu plus loin avec Wappalyzer | Victor Poggi |
| 12:50–14:05 | lunch | — | Pause déjeuner | — |
| 14:05–14:45 | talk | hardware | Sniffing de TPM : théorie et pratique | Cyril Thomas « BabdCatha » (XMCO) |
| 14:45–15:25 | talk | defense | Tout système non testé est réputé ne pas fonctionner | Christophe Rieunier (CERT La Poste) |
| 15:25–15:40 | break | — | Pause | — |
| 15:40–16:00 | talk | defense | Quid de la confiance dans le cadenas de votre navigateur web | Adrian Stephan, Cyrielle Guilliot |
| 16:00–16:40 | talk | cognitive | Plugin DIMA | M82 Project |
| 16:40–16:45 | closing | — | Clôture de l'ESE | Sébastien Larinier, Vincent Guyot |

Les neuf conférences ont un **résumé complet** dans `_includes/programme.html`
(`conf1`…`conf9`), avec des liens à conserver : CVE-2025-8061, blog Quarkslab,
`goatracer.lhs.loria.fr`, `m82-project.org`, `twitter.com/Gotohack`.

**ESE4Kids 2026** — 8-18 ans, deux sessions (10h-13h et 14h-17h), inscription sur
la même billetterie, un **ESIEAtoy** (goodie électronique programmable) offert,
parents bienvenus. Quatre ateliers :

- 🔐 **La boîte à crypto** — par l'ARCSI (`https://www.arcsi.fr/`)
- 💻 **Initiation à la programmation** — sur l'ESIEAtoy
- 🚩 **CTF junior** — d'après *J'apprends à hacker à partir de 9 ans*
  (Sara Sellos, Nicolas Fouville — Dunod)
- 🔧 **Hacking IoT** — sur l'ESIEAtoy

**Partenaire** : Les Éditions Diamond / magazine **MISC**
(`https://boutique.ed-diamond.com/7_misc`, `img/partners/Logo-MISC-Mag.jpg`).
Déjà partenaire en **2025**.

**CFP 2026** (`cfp.html`, commenté) — deadline **7 mai 2026**, formats **20 ou 35
minutes**. Thématiques : OSINT, Forensic, CTI, Reverse Engineering, Analyse de
malware, Sécurité offensive, Cryptographie, IA & Cybersécurité.

### ESE 2025 — samedi 17 mai 2025

Source : `ese-back`, `_includes/planning.html` à `292074c` (16/05/2025).
Lieu non précisé dans la page — **à confirmer**.

Le planning annonce que « le détail des heures de passage sera communiqué dans les
prochains jours » : les horaires ci-dessous sont ceux publiés.

| Horaire | Type | Titre | Intervenants |
|---|---|---|---|
| 10:00–10:05 | opening | Ouverture de l'ESE 2025 | Sébastien Larinier, Vincent Guyot |
| 10:05–10:45 | talk | GoResolver : Similarités dans les binaires en Go | Killian Rimbaud |
| 10:45–11:25 | talk | Binsec (CEA-List) | Frédéric Recoules, Yanis Sellami |
| 11:25–11:40 | break | Pause café | — |
| 11:40–12:20 | talk | Exploitation d'un outil de simulation de brèches et d'attaques pour l'évaluation continue de la cybersûreté | Alix Galant |
| 12:20–13:00 | talk | Trying Gateway Bugs : Breaking industrial protocol translation devices before the research begins | Claire Vacherot |
| 13:00–14:15 | lunch | Pause déjeuner | — |
| 14:15–14:55 | talk | Gracieuse participation de Lazarus à l'open source | Alexandra Toussaint, Yassine Dgaygui |
| 14:55–15:35 | talk | Au cœur du réseau de faux employés nord-coréens : historique et détection | Antoine Vianey-Liaud |
| 15:35–15:50 | break | Pause café | — |
| 15:50–16:30 | talk | Rétro-ingénierie assistée par LLM et confidentialité | Mathieu Renard |
| 16:30–17:10 | talk | Backdoor dans les messageries sécurisées bout en bout, en voilà une mauvaise idée ! | Sébastien Larinier |
| 17:10–17:15 | closing | Clôture de l'ESE 2025 | Sébastien Larinier, Vincent Guyot |

**ESE-Kids 2025** : 9-16 ans, **une** session de 90 minutes, 14h-15h30, places
limitées. (En 2026 : 8-18 ans, deux sessions de 3 h — le format a changé.)

**Partenaire** : MISC / Éditions Diamond, déjà présent.

### ESE 2024 — samedi 25 mai 2024, ESIEA Paris

Source : `ese-back`, `_includes/speakers.html` à `c01efff` (15/05/2024).
Tarif **10 EUR**. Les huit conférences ont un descriptif (`conf1`…`conf8`) dans
`programme.html`, ajouté par `aef8572` « added program description ».

| Horaire | Type | Titre | Intervenants |
|---|---|---|---|
| 10:00–10:05 | opening | Ouverture de l'ESE 2024 | Sébastien Larinier, Vincent Guyot |
| 10:05–10:45 | talk | Comment réaliser un Process Hollowing complet | Kevin Pham-Le |
| 10:45–11:25 | talk | How to attack blockchains | Patrick Ventuzelo |
| 11:25–11:45 | break | Pause café | — |
| 11:45–12:25 | talk | Numbat/Pyrrha : naviguez facilement dans les binaires de votre système | Eloïse Brocas |
| 12:25–13:05 | talk | Sortir du dilemme de l'attaque numérique : la théorie des jeux au chevet du décideur | Anthony Nams |
| 13:05–14:00 | lunch | Pause déjeuner | — |
| 14:00–14:40 | talk | RedCells: Finally give your BlueTeam that incident they've been yearning for | Thomas Chopitea |
| 14:40–15:20 | talk | Yeti, Intelligence DFIR | Sébastien Larinier |
| 15:20–15:40 | break | Pause café | — |
| 15:40–16:20 | talk | La chasse à Tinynuke | Thibaud Binetruy |
| 16:20–17:00 | talk | Coupe du Monde 2022 : Ehteraz, entre précaution et surveillance | Matthieu Herbette |
| 17:00–17:05 | closing | Clôture de l'ESE 2024 | Sébastien Larinier, Vincent Guyot |

**À confirmer** : deux titres sont en anglais (RedCells, How to attack
blockchains) — les talks étaient-ils donnés en anglais (`lang: en`) ?

### ESE 2023 — samedi 17 juin 2023, 10h-18h, ESIEA Paris

Source : ancien dépôt, `_includes/speakers.html` sur `master`.
Tarif 10 EUR (accès, déjeuner, pauses café). Billetterie
`https://www.billetweb.fr/ese-2023`. Slides : `http://u.pc.cd/zXJ`.

| Horaire | Type | Titre | Intervenants |
|---|---|---|---|
| 10:00–10:05 | opening | Lancement ESE'23 | — |
| 10:05–10:45 | talk | Ukraine, 2014-2023 : la « cyberguerre » n'est pas celle que vous croyez | Amaëlle Guiton (Libération) |
| 10:45–11:25 | talk | Google Apps Script : ce talk requiert l'accès à vos mails | Nicolas Kovacs, Sébastien Rolland (Quarkslab) |
| 11:25–11:40 | break | Pause-café | — |
| 11:40–12:20 | talk | #CTF — Introduction à pwntools | Christophe Grenier (CGSecurity) |
| 12:20–13:00 | talk | Mise en place d'une plateforme de test DMA pour PCILeech avec QEMU | H2Lab |
| 13:00–13:30 | lunch | Pause-déjeuner | — |
| 13:30–14:10 | talk | Attaques IoT par la 5G | Sébastien Dudek (PentHertz) |
| 14:10–14:50 | talk | Threat Hunting : Gotta hunt'em all | Matthieu Martins-Baltar, Valentin Malet (Airbus Protect) |
| 14:50–15:05 | break | Pause-café | — |
| 15:05–15:45 | talk | Compromission WAN du NETGEAR R6700V3 | Kevin Denis (Synacktiv) |
| 15:45–16:25 | talk | Projets Opensource en sécurité : où sont les contributeurs ? | Sébastien Larinier (Groupe ESIEA) |
| 16:25–16:40 | break | Pause-café | — |
| 16:40–17:20 | talk | Les implémentations TLS dans tous leurs états | Olivier Levillain (Télécom SudParis) |
| 17:20–18:00 | talk | SideCopy's Intriguing Pursuit — Unmasking Their Cyber Espionage Spanning Borders | Thibault Seret (Team Cymru) |
| 18:00 | closing | Fin ESE'23 | — |

**À confirmer** : le talk H2Lab n'a pas d'intervenant nommé, seulement
l'affiliation.

### ESE 2022 — samedi 21 mai 2022, ESIEA Paris

Source : ancien dépôt, `_includes/programme.html`. Billetterie
`https://www.billetweb.fr/ese`. Aucun lien slides. Aucune affiliation indiquée.

| Horaire | Type | Titre | Intervenants |
|---|---|---|---|
| 09:00–09:30 | opening | Accueil du public | — |
| 09:30–09:45 | opening | Ouverture | Vincent Guyot |
| 09:45–10:30 | talk | Conflit russo-ukrainien : impacts dans le cyberespace | Michel Dubois |
| 10:30–11:15 | talk *(lang: en)* | 2021: A Titan M Odyssey | Maxime Rossi Bellom, Damiano Melotti |
| 11:15–11:30 | break | Pause café | — |
| 11:30–12:15 | talk | Opération Yara | Paul Rascagnères |
| 12:15–13:00 | talk | Stratégie d'analyse de la sécurité des systèmes embarqués : les outils et techniques de l'attaquant | Mathieu Renard |
| 13:00–13:45 | lunch | Pause déjeuner | — |
| 13:45–14:30 | talk | Les aventuriers des syscalls ID perdus | Alice Climent-Pommeret |
| 14:30–14:45 | talk | Classification automatique de malwares par transposition | Gilhem Nespoulous, Raphaël Roguet |
| 14:45–15:15 | talk | Fouillons les poubelles | Antoine Cervoise |
| 15:15–15:30 | break | Pause café | — |
| 15:30–16:15 | talk | Sécurité Télécom : surfaces d'attaques des réseaux mobiles legacy | Rémi Bonamy |
| 16:15–17:00 | talk | Panorama de la cybercriminalité du Clusif 2021 (extraits) | Hervé Schauer |
| 17:00 | closing | Clôture | Sébastien Larinier |

## Speakers récurrents (à dédoublonner entre éditions)

**Mathieu Renard** — 2022, 2025, 2026 (Twisted Wires en 2026, `@Gotohack`).
**Sébastien Larinier** — 2022 à 2026 (ouverture/clôture, et talks en 2023, 2024, 2025).
**Vincent Guyot** — ouverture/clôture de 2022 à 2026.

## Données de site (`ese-back/_config.yml` → `site.yaml`)

- `name` : ESIEA Secure Edition
- `email` : `ese@esiea.fr`
- `social` : LinkedIn `https://www.linkedin.com/company/esiea-secure-edition/`
- `organizer` : ESIEA — `https://www.esiea.fr`
- `firstEdition` : 2013
- L'adresse `9 rue de Vesale, 75005 Paris` de `_config.yml` est **périmée** depuis
  le déménagement à Ivry ; elle ne doit pas être reprise dans `site.yaml`.

**À confirmer** : les comptes Twitter/X `@EsieaSecEdit` et Facebook de l'ancien
`_config.yml` sont-ils encore actifs ? Le site 2026 ne renvoie plus que vers
LinkedIn.

## Questions bloquantes pour l'étape 3

1. **Lieu de l'édition 2025** : absent des sources. Paris ou déjà Ivry ?
2. **Éditions annulées 2020 et 2021** : les faire figurer dans les
   archives avec la mention « annulée », ou les omettre ? Le schéma `editions`
   du plan n'a pas de champ pour cela — à ajouter si on les affiche.
3. **Éditions 2013–2019** : programmes disponibles hors dépôt (archives mail,
   Wayback, affiches) ? Sinon, fiche année seule, sans date.
4. **ESE4Kids en 2027** : reconduit ? Le format a déjà changé entre 2025 (une
   session de 90 min, 9-16 ans) et 2026 (deux sessions de 3 h, 8-18 ans).
5. **Date et lieu 2027** : 24/04/2027 et Ivry sont provisoires.
6. **Langue des talks 2024** dont le titre est en anglais.
