---
name: Nouvelle édition
about: Suivre la préparation d'une édition, de l'annonce à l'archivage
title: 'ESE <année>'
labels: édition
---

## 1. Annonce

- [ ] `src/content/editions/<année>.yaml` créé en `status: announced`
- [ ] Date et lieu confirmés (sinon les laisser vides plutôt que d'inventer)
- [ ] `currentEdition` mis à jour dans `src/content/site.yaml`
- [ ] Édition précédente passée en `status: archived`

## 2. Appel à conférences

- [ ] News `tags: [cfp]` publiée, avec `expires` = date limite
- [ ] `status: cfp-open`

## 3. Programme

- [ ] Thématiques (`tracks`) déclarées dans la fiche d'édition
- [ ] Un fichier par créneau dans `src/content/talks/`, pauses comprises
- [ ] Fiches speakers créées ou réutilisées
- [ ] Résumés renseignés
- [ ] `ticketUrl` renseigné, news `tags: [billetterie]` publiée
- [ ] `status: program-published`
- [ ] `programStatus: provisoire` tant que le programme peut bouger

## 4. ESE4Kids (si reconduit)

- [ ] Bloc `kids` renseigné (tranche d'âge, sessions, billetterie)
- [ ] Un fichier par atelier dans `src/content/kids/`

## 5. Partenaires

- [ ] Logos déposés dans `src/assets/partners/`
- [ ] Année ajoutée aux `editions` des partenaires concernés

## 6. Après l'événement

- [ ] `status: past`
- [ ] `slidesUrl` et/ou `slides` par talk
- [ ] News `tags: [slides]`
- [ ] `programStatus: définitif`

## 7. Archivage

- [ ] `status: archived` (au plus tard en annonçant l'édition suivante)
