# Changelog

Toutes les modifications notables de Mentis sont documentées dans ce fichier.

Le format suit les recommandations de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Non publié] - 2026-08-13

### Fixed
- Correction d'une faille de logique métier permettant à un reviewer de
  valider son propre article soumis (#39)

## [1.2.0] - 2026-08-11

### Added
- Intégration de Sentry pour le suivi des erreurs applicatives et le
  monitoring de performance (tracing, session replay, logs)
- Ajout d'une route `/health` exposant le statut de disponibilité de
  l'application et de la connexion à la base de données

### Changed
- Simplification de la gestion des erreurs dans les réponses serveur

## [1.1.0] - 2026-08-10

### Added
- Configuration de Dependabot pour la surveillance et la mise à jour
  automatisée des dépendances (scan hebdomadaire, alertes de sécurité)

## [1.0.1] - 2026-07-23

### Added
- Ajout de tests unitaires avec mocking de la base de données pour
  améliorer l'isolation des tests
- Configuration de la couverture de tests et amélioration du reporting

### Changed
- Mise à jour du README pour refléter le nom du projet et les
  fonctionnalités actuelles

## [1.0.0] - 2026-07-12

### Added
- Tests unitaires sur les actions admin et articles (gestion des rôles
  et des statuts)

### Changed
- Amélioration du formatage et de la lisibilité du code
  (`page.server.ts`, `page.svelte`)

## [0.9.0] - 2026-07-04

### Added
- Fonctionnalités d'administration : gestion des rôles utilisateurs,
  vue d'ensemble du statut des articles
- Archivage et restauration d'articles
- Amélioration du processus de review des articles et gestion des statuts

## [0.8.0] - 2026-07-02

### Added
- Statistiques d'articles et liens auteur sur la page de profil utilisateur
- Amélioration de la gestion des rôles utilisateurs côté admin