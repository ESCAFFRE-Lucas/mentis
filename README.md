# Mentis

Plateforme de publication et de relecture d'articles : soumission par les auteurs, revue par les reviewers, validation par les admins.

## Stack

- [SvelteKit](https://kit.svelte.dev/) 2 + [Svelte](https://svelte.dev/) 5, TypeScript
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [better-auth](https://www.better-auth.com/) pour l'authentification
- [Tailwind CSS](https://tailwindcss.com/) 4 + [bits-ui](https://bits-ui.com/) / shadcn-style components
- [Vitest](https://vitest.dev/) (unit + browser) pour les tests, coverage v8

## Fonctionnalités

- **Auth** : inscription / connexion (email + mot de passe, GitHub), rôles utilisateur (`USER`, `REVIEWER`, `ADMIN`)
- **Articles** : rédaction, soumission, édition, archivage
- **Workflow de review** : statuts `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `ACCEPTED` / `REJECTED` (+ `ARCHIVED`), décisions de review (`ACCEPT`, `REVISIONS`, `REJECT`)
- **Espace reviewer** : liste des articles à relire, prise de décision
- **Espace admin** : gestion des rôles utilisateurs, vue d'ensemble des statuts d'articles
- **Profils** : statistiques et articles par auteur

## Prérequis

- Node.js, [pnpm](https://pnpm.io/)
- Docker (pour la base PostgreSQL locale)

## Installation

```sh
pnpm install
cp .env.example .env   
pnpm db:start           
pnpm db:push             
```

## Développement

```sh
pnpm dev

# ou pour ouvrir automatiquement un onglet navigateur
pnpm dev -- --open
```

## Tests

```sh
pnpm test         
pnpm test:unit    
pnpm test:coverage  
```

## Base de données

```sh
pnpm db:push      
pnpm db:generate  
pnpm db:migrate   
pnpm db:studio   
```

## Build

```sh
pnpm build
pnpm preview   
```

> Le déploiement utilise l'adapter Vercel (`@sveltejs/adapter-vercel`).

## Qualité de code

```sh
pnpm lint     
pnpm format   
pnpm check   
```
