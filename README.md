# Festivo

Progressive Web App de gestion des événements — projet académique du module
« Modern Mobile Applications », réalisé en équipe de six avec Next.js.

> **État.** En place : page d'accueil et consultation des événements lus dans MongoDB
> (BF-02, D-33), comptes et authentification (BF-01 : inscription participant ou
> organisateur, connexion, mot de passe oublié, photo de profil, modification et suppression
> du compte, espace personnel par rôle — D-29 à D-34), trois langues, thème clair ou sombre,
> application installable et mode hors ligne. À développer : BF-03 à BF-07.

## Pile technique

- [Next.js](https://nextjs.org) 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 4, approche mobile-first · icônes `lucide-react`
- Animations : GSAP (`gsap`, `@gsap/react`) sur l'accueil, `framer-motion` ailleurs
- Progressive Web App : `public/manifest.json` et Service Worker `public/sw.js`, sans
  bibliothèque (D-27)
- MongoDB avec Mongoose (cours ch. 5), via les Server Actions (`app/actions/`)
- Authentification : next-auth 5 (cours ch. 4), identifiants e-mail et mot de passe, mots de
  passe chiffrés avec `bcryptjs`, session JWT (D-30)
- Interface en français, anglais et arabe tunisien (`/fr`, `/en`, `/ar`, D-19)
- Qualité : ESLint (`eslint-config-next`) · Prettier (+ tri des classes Tailwind) · tests de
  bout en bout Playwright · pipeline GitLab (D-28)

## Prérequis

- Node.js ≥ 20.9 (testé avec Node 24) et npm
- Git, et un accès au projet GitLab avec le rôle _Developer_
- Google Chrome (utilisé par les tests Playwright, rien à télécharger)
- MongoDB : un cluster MongoDB Atlas (offre gratuite) ou une instance locale
  (`mongodb://127.0.0.1:27017`), nécessaire pour les comptes
- Éditeur conseillé : VS Code (ou Cursor) ; à l'ouverture, accepter les extensions proposées
  (ESLint, Prettier, Tailwind CSS) : le code se formate à l'enregistrement

## Installation et lancement

```bash
git clone https://gitlab.com/youssefkoubaa/festivo-nextjs.git
cd festivo-nextjs
npm ci                       # versions exactes de package-lock.json
cp .env.example .env.local   # PowerShell : Copy-Item .env.example .env.local
npm run seed                 # une fois par base : événements de démonstration
npm run dev                  # http://localhost:3000
```

`.env.local` n'est jamais commité. Chacun y renseigne :

| Variable                  | Valeur                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`             | Atlas : _Connect_ → _Drivers_, copier l'adresse `mongodb+srv://…` et ajouter `/festivo` avant le `?` |
| `AUTH_SECRET`             | Clé de signature des sessions : `npx auth secret` l'écrit dans `.env.local` (une clé par poste)      |
| `AUTH_TRUST_HOST`         | `true` (serveur lancé en local, `npm run start` compris)                                             |
| `APP_URL`                 | Adresse de l'application dans les liens des e-mails : `http://localhost:3000` en local               |
| `SMTP_*`, `MAIL_FROM`     | Envoi des e-mails (voir ci-dessous) ; sans `SMTP_HOST`, l'e-mail s'affiche dans le terminal          |
| `SEED_ORGANIZER_PASSWORD` | Mot de passe des comptes organisateurs créés par `npm run seed` (8 caractères minimum)               |
| `PLAYWRIGHT_BASE_URL`     | `http://localhost:3000`                                                                              |

Sur Atlas, autoriser son adresse IP (_Network Access_). Le pipeline GitLab n'a besoin d'aucune
de ces variables : le build ne se connecte pas à la base.

**Données de démonstration.** `npm run seed` charge dans la base de `MONGODB_URI` les
événements de `lib/demo/` et six comptes organisateurs
(`contact@<organisateur>.demo.festivo.tn`, par exemple `contact@tunis-tech-hub.demo.festivo.tn`,
mot de passe : `SEED_ORGANIZER_PASSWORD`). La commande peut être relancée : elle met les
données à jour sans doublon. Sans elle, l'accueil et la liste des événements sont vides.

**E-mails avec Gmail** (mot de passe oublié, D-31) :

1. activer la validation en deux étapes du compte Google ;
2. créer un mot de passe d'application : Compte Google → _Sécurité_ → _Mots de passe des
   applications_ (16 caractères) ;
3. dans `.env.local` : `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=<adresse
Gmail>`, `SMTP_PASS=<mot de passe d'application>`, `MAIL_FROM="Festivo <adresse Gmail>"`.

Sans `SMTP_HOST`, le lien de réinitialisation est écrit dans le terminal de `npm run dev`.

Le Service Worker est désactivé en développement ; pour tester l'installation et le mode hors
ligne : `npm run build` puis `npm run start`. Les pages de l'espace personnel
(`/{langue}/espace/…`) ne sont jamais mises en cache.

## Scripts

| Commande                          | Rôle                                                           |
| --------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                     | Serveur de développement                                       |
| `npm run dev:https`               | Serveur de développement en HTTPS                              |
| `npm run build`                   | Build de production                                            |
| `npm run start`                   | Lance le build de production (Service Worker actif)            |
| `npm run lint` / `lint:fix`       | ESLint                                                         |
| `npm run typecheck`               | Génère les types de routes puis vérifie TypeScript             |
| `npm run format` / `format:check` | Prettier                                                       |
| `npm run check`                   | lint + typecheck + format:check + build (comme le pipeline)    |
| `npm run test:e2e`                | Tests Playwright, serveur lancé à part (`PLAYWRIGHT_BASE_URL`) |
| `npm run seed`                    | Charge le jeu de démonstration dans la base (D-33)             |

Les parcours de compte de `tests/e2e/auth.spec.ts` sont ignorés sans `MONGODB_URI` et
`AUTH_SECRET` ; ils créent des comptes `…@festivo.test` dans la base de test. Les tests de
l'accueil et des événements (`home.spec.ts`) supposent que `npm run seed` a été lancé.

## Travailler en équipe

`master` est protégée : personne n'y pousse directement. Chaque module passe par une branche
et une demande de fusion (_merge request_), que le pipeline GitLab vérifie (lint, types,
formatage, build) et qu'un autre membre relit avant la fusion.

```bash
# 1. Partir de master à jour
git switch master
git pull
npm ci                                   # si package-lock.json a changé

# 2. Une branche par module
git switch -c feature/bf-03-evenements   # bf-04-inscriptions, bf-05-tableau-de-bord, fix/…

# 3. Pendant le travail : se resynchroniser souvent
git fetch origin
git merge origin/master

# 4. Livrer : vérifier, commiter, pousser en créant la demande de fusion
npm run check
git add -A
git commit -m "feat(bf-03): création et modification d'un événement"
git push -u origin feature/bf-03-evenements -o merge_request.create -o merge_request.target=master -o merge_request.remove_source_branch
```

Ensuite, sur GitLab : remplir le modèle de la demande de fusion, attendre le pipeline vert et une relecture, puis fusionner. Si le pipeline échoue, corriger, commiter et refaire

`git push` : la demande de fusion se met à jour.

Fichiers partagés à modifier avec soin (conflits fréquents) : les dictionnaires
`lib/i18n/dictionaries/fr.ts`, `en.ts`, `ar.ts` (une section par module, mêmes clés dans les
trois langues) et `docs/decisions.md` (prendre le numéro de décision suivant).

## Structure

```
app/                 routes (App Router) ; toutes les pages sous app/[lang]/
app/actions/         Server Actions, un fichier par entité
components/layout/   coquille de l'application (en-tête, navigation, pied de page, PWA)
components/ui/       composants réutilisables
context/             React Context (état partagé)
hooks/               hooks personnalisés
lib/                 utilitaires (langues, événements, connexion à la base…)
lib/i18n/            langues et dictionnaires des textes d'interface
models/              modèles de données Mongoose
scripts/             scripts lancés par npm (seed.ts : jeu de démonstration)
types/               types TypeScript partagés
public/              manifest.json, sw.js, icônes, images, captures du manifest
tests/e2e/           tests Playwright
docs/                cahier des charges, décisions d'équipe
.gitlab/             modèle de demande de fusion ; pipeline : .gitlab-ci.yml
.cursor/             règles et procédures de l'assistant IA de Cursor
```

## Références obligatoires

Tout développement s'appuie sur :

1. le cahier des charges — [docs/cahier-des-charges.html](docs/cahier-des-charges.html) ;
2. le cours « Modern Mobile Applications », chapitres 1 à 5 — transcription dans
   [.cursor/skills/festivo-reference/cours.md](.cursor/skills/festivo-reference/cours.md) ;
3. les décisions d'équipe — [docs/decisions.md](docs/decisions.md).

Les règles du projet sont écrites pour l'assistant de Cursor, mais se lisent dans n'importe
quel éditeur (Markdown) ; sans Cursor, les lire avant de commencer un module :

- [architecture](.cursor/rules/10-architecture-nextjs.mdc) ·
  [composants React](.cursor/rules/20-composants-react.mdc) ·
  [interface et Tailwind](.cursor/rules/30-interface-tailwind.mdc) ·
  [PWA](.cursor/rules/40-pwa.mdc) ·
  [données et Server Actions](.cursor/rules/50-donnees-server-actions.mdc) ·
  [conventions de code](.cursor/rules/60-conventions-code.mdc)
