# Audit Habitudes Minceur / 3 Habitudes

MVP web responsive pour auditer des habitudes de vie liées à la prise de poids, identifier 3 variables rentables à modifier, tester 14 jours, puis suivre poids et ressenti.

## Positionnement

> Arrêtez les régimes impossibles. Auditez vos habitudes, changez 3 variables, testez 14 jours, ajustez.

Ce n’est pas une application de régime strict, de comptage calorique ou de promesse médicale. C’est un outil d’auto-audit comportemental inspiré de l’amélioration continue, du Lean et du principe 80/20.

## Installation

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Scripts

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm run start   # serveur de production après build
npm run lint    # lint Next.js
```

## Fonctionnalités MVP

- Page d’accueil avec méthode en 4 étapes et avertissement santé.
- Audit de 20 habitudes avec données de base et sauvegarde automatique localStorage.
- Scoring transparent : coût probable + rentabilité de changement.
- Résultats avec 5 habitudes recommandées, explications et alternatives réalistes.
- Engagement 14 jours avec sélection strictement limitée à 3 habitudes.
- Tableau de bord : jour du test, poids, tendance, adhérence et ressentis moyens.
- Check-in rapide : poids optionnel, respect des engagements, énergie, faim, frustration, motivation, activité et note libre.
- Historique avec courbe simple, résumé automatique et bilan 14 jours.
- Paramètres : export JSON, import JSON, réinitialisation et suppression locale.
- Données d’exemple disponibles sur la page Audit.

## Architecture

- `app/` : routes Next.js App Router.
- `components/` et `components/ui/` : composants réutilisables simples.
- `lib/defaultHabits/` : catalogue éditable des habitudes auditées.
- `lib/scoring/` : moteur de scoring et bilans séparés de l’UI.
- `lib/storage/` : persistance localStorage, export et import JSON.
- `types/` : types TypeScript du domaine.
- `data/` : état d’exemple pour tester rapidement.

## Limites médicales

L’application ne remplace pas un avis médical, psychologique ou diététique. En cas de pathologie, trouble alimentaire, grossesse, traitement médical, addiction, douleur, malaise ou doute important, il faut demander l’avis d’un professionnel de santé.

## Prochaines étapes possibles

- Brancher Supabase ou Firebase pour synchroniser plusieurs appareils.
- Ajouter des tests unitaires du scoring.
- Ajouter des graphiques plus riches et accessibles.
- Ajouter un mode multi-cycles de 14 jours.
- Ajouter des templates d’engagement par profil utilisateur.
- Ajouter une exportation PDF du bilan.
