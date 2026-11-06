<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Festivo — règles du projet

- Projet au stade **squelette** : ne développer aucune fonctionnalité du cahier des charges
  sans demande explicite de l'utilisateur.
- Toute décision s'appuie sur, dans l'ordre : `docs/cahier-des-charges.html`, le cours
  « Modern Mobile Applications » (`.cursor/skills/festivo-reference/cours.md`), la doc Next.js
  installée (syntaxe d'API uniquement), `docs/decisions.md`.
- Règles détaillées : `.cursor/rules/`. Procédures : `.cursor/skills/`.
- Base de données : MongoDB + Mongoose (décision D-09). Authentification : next-auth (D-10),
  à installer seulement au développement de BF-01. Rôles : D-11.
- Avant de livrer : `npm run check`.
