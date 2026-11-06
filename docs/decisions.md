# Décisions techniques — Festivo

Registre des choix d'équipe (cahier des charges §11 : « consigner les choix »). Une décision
ajoutée ou modifiée l'est dans la même pull request que le code qui en dépend.

## Décisions prises

| #    | Décision                                                                          | Source                                        | Date           |
| ---- | --------------------------------------------------------------------------------- | --------------------------------------------- | -------------- |
| D-01 | Next.js (App Router), React, TypeScript strict                                    | Cahier §07, cours ch. 2                       | Initialisation |
| D-02 | Tailwind CSS, approche mobile-first                                               | Cours ch. 3                                   | Initialisation |
| D-03 | Application web responsive installable (PWA), pas d'application native            | Cahier §03, cours ch. 1                       | Initialisation |
| D-04 | Manifest dans `public/manifest.json`, Service Worker dans `public/sw.js`          | Cours ch. 1 et 3                              | Initialisation |
| D-05 | Mutations via Server Actions dans `app/actions/`                                  | Cours ch. 5, cahier §07                       | Initialisation |
| D-06 | Pas de dossier `src/` ; alias d'import `@/*`                                      | Cours ch. 2 et 5                              | Initialisation |
| D-07 | ESLint (`eslint-config-next`) + Prettier (tri des classes Tailwind)               | Cahier §05 (maintenabilité)                   | Initialisation |
| D-08 | Nom définitif du projet : **Festivo** (le cahier dit « EventFlow (provisoire) »)  | Décision d'équipe                             | 2026-10-31     |
| D-09 | Base de données **MongoDB** avec **Mongoose** ; connexion via `MONGODB_URI`       | Cours ch. 5, décision d'équipe (tranche Q-01) | 2026-10-31     |
| D-10 | Authentification avec **next-auth** (`useSession`, `signIn`, `signOut`)           | Cours ch. 4, décision d'équipe (tranche Q-02) | 2026-10-31     |
| D-11 | Rôles : **visiteur**, **participant**, **organisateur**, **administrateur**       | Cahier §01, décision d'équipe (tranche Q-03)  | 2026-10-31     |
| D-12 | Maquettes et design system Stitch (`docs/maquettes/`), textes génériques          | Cahier §08, décision d'équipe                 | 2026-10-31     |
| D-13 | Icônes : **lucide-react** (SVG importés un par un)                                | Décision d'équipe                             | 2026-10-31     |
| D-14 | BF-01 inclut **mot de passe oublié** et **photo de profil** (obligatoires)        | Décision d'équipe (extension de BF-01)        | 2026-10-31     |
| D-15 | Catégories : Musique, Tech, Sport, Art et culture, Business, Ateliers             | Cahier §07, BF-02, décision d'équipe (Q-05)   | 2026-11-01     |
| D-16 | Capacité maximale et **places restantes** affichées sur cartes et fiches          | Cahier BF-02, BF-03, décision d'équipe (Q-06) | 2026-11-01     |
| D-17 | Polices Plus Jakarta Sans (titres) et Inter (texte) ; couleur d'action `#C2410C`  | Décision d'équipe (remplace en partie D-12)   | 2026-11-01     |
| D-18 | Jeu de démonstration temporaire dans `lib/demo/`, photos dans `public/images/`    | Décision d'équipe (exception temporaire)      | 2026-11-01     |
| D-19 | Interface en **français**, **anglais** et **arabe tunisien** ; langue dans l'URL  | Décision d'équipe                             | 2026-11-02     |
| D-20 | Thème **clair**, **sombre** ou **système**, choisi par l'utilisateur              | Décision d'équipe                             | 2026-11-02     |
| D-21 | Contenu élargi jusqu'à 1440 px (`max-w-360`) sur grand écran                      | Décision d'équipe                             | 2026-11-02     |
| D-22 | Effets animés repris de **Vengeance UI**, adaptés ; animation : `framer-motion`   | Décision d'équipe                             | 2026-11-02     |
| D-23 | Carte **Google Maps** (intégration sans clé) centrée sur la position du visiteur  | Décision d'équipe                             | 2026-11-02     |
| D-24 | Tests de bout en bout avec **Playwright** sur le Chrome installé                  | Décision d'équipe                             | 2026-11-02     |
| D-25 | Accueil redessiné : direction **« chapitres en couleur »** (Taste Skill)          | Décision d'équipe                             | 2026-11-02     |
| D-26 | Accueil **bleu, blanc et noir**, slogan « Ne ratez plus aucune sortie », **GSAP** | Décision d'équipe                             | 2026-11-02     |
| D-27 | **Installable** (manifest complet) et **mode hors ligne** (Service Worker)        | Cours ch. 1 et 3, cahier §05                  | 2026-11-02     |
| D-28 | **Pipeline GitLab** obligatoire avant toute fusion dans `master`                  | Cahier §08, §11, décision d'équipe            | 2026-11-06     |
| D-29 | Rôle **Participant** ou **Organisateur** choisi à l'inscription (modifie D-11)    | Cahier BF-01, décision d'équipe               | 2026-11-06     |
| D-30 | **next-auth 5** (e-mail et mot de passe), session JWT, mots de passe `bcryptjs`   | Cours ch. 4, D-10                             | 2026-11-06     |
| D-31 | E-mails envoyés par **Nodemailer** en SMTP (Gmail ou autre fournisseur)           | D-14, décision d'équipe (tranche Q-11)        | 2026-11-06     |
| D-32 | Photo de profil réduite (256 px, WebP) et stockée **dans MongoDB**                | D-14, décision d'équipe (tranche Q-10)        | 2026-11-06     |
| D-33 | Entité **Event** en base, jeu de démonstration chargé par `npm run seed`          | Cahier BF-02, BF-03, D-18 (tranche Q-09)      | 2026-11-06     |
| D-34 | **Suppression du compte** définitive, confirmée par le mot de passe               | Cahier BF-01, décision d'équipe               | 2026-11-06     |

D-09 s'écarte du cahier §07, qui proposait PostgreSQL ou MySQL + Prisma : écart à signaler à
l'encadrant lors de la validation du cahier des charges.

D-10 : rien n'est installé tant que le développement de BF-01 n'est pas demandé. La version de
next-auth, le mode de connexion et la façon de transmettre le rôle à la session seront fixés à
ce moment, d'après la documentation de la version installée.

D-11 : le visiteur n'a pas de compte (consultation des événements publiés) ; un compte créé
par inscription est participant ; seul l'administrateur gère les rôles (BF-06).

D-12 : les maquettes fixent le style (couleurs, polices Manrope et Geist, formes, navigation
basse sur mobile, en-tête sur ordinateur), pas le contenu. On n'en reprend pas le cadre
« campus étudiant », ni les éléments absents du cahier : événement officiel, durée estimée,
règles pratiques, compteurs, profil public, version, liens de pied de page. La couleur
principale devient `#2748C4` (`theme_color` du manifest et du layout). Le code HTML exporté
n'est pas repris tel quel : couleurs et polices passent par `@theme` dans `app/globals.css`.

D-13 : installé avec la page vitrine et les écrans d'authentification.

D-14 : le mot de passe oublié impose l'envoi d'un e-mail de réinitialisation (Q-07, Q-11) ;
la photo de profil impose un stockage d'images (Q-10).

D-15 : une seule catégorie par événement, filtrable depuis l'accueil et `/evenements`.

D-16 : les places restantes valent `capacité − inscriptions actives` ; un événement est
« bientôt complet » sous 15 % de places libres, « complet » à zéro (règle de gestion BF-03).

D-17 : inspiration Luma, Eventbrite et Meetup. Le bleu `#2748C4` reste la couleur de marque ;
l'orange `#C2410C` (contraste 5,2:1 avec le blanc) est réservé à l'action principale de chaque
écran (rechercher, s'inscrire, créer un compte). Toutes les inscriptions sont affichées
« Gratuit » : le paiement est hors périmètre (cahier §03, §12).

D-18 : écart assumé à la règle « pas de données fictives codées en dur », pour présenter
l'interface avant la base de données. Les pages ne lisent les événements que via `lib/events.ts` ;
au développement de BF-02, ces fonctions interrogeront MongoDB et `lib/demo/` sera supprimé.
Photos libres de droits issues d'Unsplash (licence Unsplash), copiées localement.

D-19 : toutes les routes vivent sous `app/[lang]/` (`/fr`, `/en`, `/ar`), le français restant
la langue par défaut. `proxy.ts` redirige une adresse sans langue selon le cookie `NEXT_LOCALE`
(posé par le sélecteur de langue), puis l'en-tête `Accept-Language`. Les textes d'interface
sont dans `lib/i18n/dictionaries/` (un fichier par langue, mêmes clés, vérifiées par
TypeScript) ; les composants serveur les lisent avec `getI18n()`, les composants client les
reçoivent en props. L'arabe tunisien (derja, écriture arabe, `lang="ar-TN"`) s'affiche de
droite à gauche (`dir="rtl"`) : utiliser les classes logiques (`ms-`, `pe-`, `start-`,
`end-`, `text-start`) et retourner les flèches avec `rtl:-scale-x-100`. Le contenu des
événements (titres, descriptions, lieux) n'est pas traduit et reste en français
(`dir="auto"` pour l'isoler dans la page arabe). Traductions derja à relire par un locuteur
natif avant la soutenance.

D-20 : le choix est mémorisé dans `localStorage` (`festivo-theme`) et appliqué avant
l'affichage par un script en ligne dans `app/[lang]/layout.tsx` (attribut `data-theme` sur
`<html>`), sans flash de couleur. « Système » suit `prefers-color-scheme`. Les variantes
Tailwind `dark:` ciblent `[data-theme="dark"]`.

D-21 : l'en-tête, le pied de page et les sections s'alignent sur la même largeur ; les fonds
de section restent pleine largeur. Les grilles d'événements passent à 4 colonnes à partir de
`xl` ; les textes longs (description d'un événement) restent limités à `max-w-3xl`.

D-22 : [Vengeance UI](https://www.vengenceui.com/) s'installe normalement par `shadcn init`,
qui remplacerait les variables de couleur de `app/globals.css` (thème D-17, D-20) ; ses
composants sont donc copiés à la main puis adaptés (couleurs du thème, classes logiques pour
l'arabe, accessibilité, règles ESLint du projet). Repris : faisceau de bordure (`BorderBeam`),
fond aurore (`AuroraBackground`), mots révélés (`TextReveal`), compteurs (`StatsCounter`),
lien à pastille (`HoverRevealLink`) et halo de navigation (`SpotlightNav`). Les animations
s'arrêtent quand le système demande de réduire les animations (`prefers-reduced-motion`).

D-23 : la carte de la section « Par ville » utilise l'adresse d'intégration publique
`maps.google.com/maps?…&output=embed`, sans clé ni compte Google Cloud. La position n'est
demandée qu'au clic sur « Me localiser », sert uniquement à centrer la carte (transmise à
Google dans l'adresse de la carte) et n'est pas enregistrée. Si l'équipe passe à l'API
officielle Maps Embed, la clé ira dans une variable d'environnement.

D-24 : `@playwright/test` (dépendance de développement) pilote le Chrome déjà installé
(`channel: "chrome"`), sans téléchargement de navigateur. L'adresse testée vient de la
variable d'environnement `PLAYWRIGHT_BASE_URL` (voir `.env.example`) ; la configuration
(`playwright.config.ts`) refuse de démarrer sans elle. Deux projets : bureau (1440 × 900) et
mobile (Pixel 7). Les tests de l'accueil sont dans `tests/e2e/` ; lancement :
`npm run test:e2e`, le serveur (`npm run dev` ou `npm run start`) tournant à part.

D-25 : l'accueil suit la direction artistique « chapitres en couleur », tirée avec le skill
`design-taste-frontend` (Taste Skill, `.agents/skills/`) : chaque section est une affiche
pleine largeur dans les couleurs de la marque (bleu, orange, encre), à la manière des murs
d'affiches de festivals tunisiens. Police unique **Albert Sans** (remplace Inter et Plus
Jakarta Sans ; l'arabe garde sa police), cinq tailles de texte (`text-step-*` dans
`app/globals.css`), aplats sans dégradé, ombre ni flou. Les cartes « Netflix » restent sur
`/evenements` ; l'accueil utilise des affiches (`PosterTile`). Remplace en partie D-21 et
D-22 : l'accueil, l'en-tête et le pied de page occupent toute la largeur avec des marges
égales ; les effets Vengeance UI sont retirés de l'accueil (`AuroraBackground`,
`StatsCounter`, `HoverRevealLink`, `SpotlightNav` supprimés ; `BorderBeam` et `TextReveal`
restent pour les autres pages). Les boutons partagés deviennent carrés et pleins. Les
apparitions au défilement (`RiseOnScroll`) ne masquent rien sans JavaScript ni quand le
système demande de réduire les animations. La barre de navigation mobile se cache au
défilement vers le bas. Pas de vidéo : les seuls extraits libres trouvés (Tunis, CC BY-SA)
montrent la ville et non des événements, et le stockage des médias reste à décider.

D-26 : remplace D-25 pour les couleurs, les tailles et les animations de l'accueil, à la
demande de l'utilisateur (titres jugés trop grands, couleurs jugées peu réussies).

- Couleurs : bleu de la marque (`#2748c4`) comme couleur principale, avec le blanc et le noir
  (`--c-band`). L'orange disparaît de l'accueil ; le jeton `cta` devient bleu sur tout le
  site. En thème sombre, le fond passe au noir (`#0a0a0b`).
- Tailles : le titre le plus grand plafonne à 6rem ; aucun agrandissement au survol ;
  contenu de nouveau limité à 1440 px (`max-w-360`, comme D-21), en-tête et pied compris.
- Slogan : « Ne ratez plus aucune sortie. » / « Never miss what's on. » / « ما تفلّتش حتى
  خرجة. » (derja à relire par un locuteur natif).
- Animations : [GSAP](https://gsap.com/) 3 et `@gsap/react` (`HomeMotion`) : slogan mot à
  mot (chaque mot monte de son masque, puis la ligne bleue se colore mot par mot), photos dévoilées, chiffres qui défilent, apparitions au défilement
  (`ScrollTrigger`), photos en parallaxe. Translation et opacité seulement. Quand le
  système demande de réduire les animations, aucun déplacement : il reste des fondus mot par
  mot, le changement de couleur et les chiffres. Rien de masqué sans JavaScript. GSAP est
  gratuit mais sous sa propre licence (« Standard No Charge License »), pas une licence
  libre.

D-27 : mise en œuvre de D-03 et D-04, sans bibliothèque (pas de `next-pwa` ni Serwist).

- Manifest (`public/manifest.json`) : `id`, icônes `any` et `maskable` (fond plein, dessin
  dans la zone sûre, `public/icons/icon-maskable.svg` rendu en PNG), raccourcis (explorer, se
  connecter) et captures `narrow` / `wide` (`public/screenshots/`) pour la fenêtre
  d'installation. `theme_color` reste égal au `viewport.themeColor` clair. Le bouton
  « Installer » de l'en-tête n'apparaît que si le navigateur propose l'installation
  (`beforeinstallprompt`, navigateurs Chromium) ; ailleurs, on passe par le menu du navigateur.
- Service Worker (`public/sw.js`, caches `festivo-shell-*`, `festivo-pages-*`,
  `festivo-images-*` versionnés par `VERSION`) : à l'installation, il enregistre le manifest,
  les icônes, l'accueil et la page `/{langue}/hors-ligne` de chaque langue avec leurs fichiers
  CSS et JS. Coquille (`/_next/static`) en Cache First ; pages en Network First (4 s, puis la
  copie enregistrée, puis la page hors ligne) ; images en Stale-While-Revalidate ; POST,
  Server Actions, données de navigation RSC, `/api/` et autres origines ne passent jamais par
  le cache. Hors ligne, `/` sert l'accueil enregistré dans la langue du navigateur. Limites :
  60 pages, 120 images.
- Enregistré en production seulement (`ServiceWorkerRegister`) : en développement les
  fichiers changent sans changer de nom, et les Service Workers existants sont retirés. Tester
  avec `npm run build` puis `npm run start`.
- Un bandeau (`OfflineBanner`) signale la coupure ; la page hors ligne liste les pages
  disponibles dans le cache.
- À BF-01 : les pages authentifiées (tableau de bord, compte) et toute donnée personnelle
  devront être exclues du cache des pages (liste `NEVER_CACHED` de `public/sw.js`, en changeant
  `VERSION`).

D-28 : seuls deux membres de l'équipe utilisent Cursor ; la vérification ne repose donc pas
sur l'assistant mais sur GitLab.

- `.gitlab-ci.yml` lance, sur chaque demande de fusion uniquement (pas après la fusion dans
  `master`), quatre tâches en parallèle dans l'image `node:24-slim` : `lint` (un
  avertissement suffit à échouer : `eslint --max-warnings=0`, en local comme dans le pipeline), `types` (`npm run typecheck`),
  `formatage` (`npm run format:check`) et `build` — les mêmes commandes que `npm run check`.
- Réglages du projet GitLab : `master` protégée (aucun push direct), « Pipelines must
  succeed » et « All threads must be resolved » cochés, branche source supprimée après la
  fusion. La relecture par un autre membre reste une règle d'équipe (les approbations
  obligatoires ne sont pas proposées par l'offre gratuite).
- Modèle de demande de fusion : `.gitlab/merge_request_templates/Default.md`.
- Le build ne lit jamais la base (D-33) : le pipeline n'a besoin d'aucun secret. Un secret
  nécessaire un jour irait dans les variables CI/CD masquées du projet, jamais dans le fichier.
- Les tests Playwright ne tournent pas dans le pipeline (ils demandent Chrome et un serveur
  lancé) ; on les lance en local avec `npm run test:e2e`.

D-29 : à l'inscription, l'utilisateur choisit **Participant** ou **Organisateur** ; un
organisateur remplit une seconde étape. Chaque rôle arrive sur son tableau de bord
(`/{langue}/espace/participant`, `/{langue}/espace/organisateur`). Modifie D-11 : le rôle
`administrateur` n'est jamais proposé, et le serveur refuse toute autre valeur que les deux
rôles ouverts. Champs de l'entité User (réponse à Q-09 pour cette entité) :

- `name`, `email` (unique, en minuscules), `passwordHash`, `role` (`participant`,
  `organisateur`, `administrateur`), dates de création et de modification ;
- `organizer`, pour un organisateur seulement : `name` (nom de la structure, affiché sur les
  fiches), `type` (`association`, `entreprise`, `particulier`, `institution`), `phone`,
  `city`, `bio` (présentation), `website` (facultatif).

Champs ajoutés par D-31, D-32 : `passwordReset` (jeton de réinitialisation, jamais renvoyé par
défaut) et `avatarVersion` (présence et version de la photo). Les tableaux de bord affichent
des états vides là où viendront les inscriptions (BF-04), la gestion des événements (BF-03) et
le suivi (BF-05).

D-30 : [next-auth](https://authjs.dev/) 5 (`next-auth@beta`, compatible Next 16), connexion
par e-mail et mot de passe (fournisseur Credentials), session JWT dans un cookie chiffré,
mots de passe chiffrés avec `bcryptjs`. Configuration dans `auth.ts`, routes dans
`app/api/auth/[...nextauth]/route.ts`, secret dans `AUTH_SECRET` (`.env.local`).

- Les pages protégées lisent la session côté serveur, dans des `<Suspense>` (Cache
  Components), via `lib/dal.ts` (`requireRole`) ; chaque Server Action revérifie la session.
- L'en-tête lit la session côté client (`useSession`, cours ch. 4) : les pages publiques
  restent statiques, et le Service Worker ne met jamais en cache de données personnelles.
- `/{langue}/espace/*` n'est jamais mis en cache par le Service Worker (complète D-27).
- Erreur de connexion générique (« e-mail ou mot de passe incorrect ») : on ne révèle pas si
  un compte existe (cahier §06).

D-31 : `lib/mail.ts` envoie les e-mails avec [Nodemailer](https://nodemailer.com/) en SMTP,
réglé par `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` et `MAIL_FROM` (Gmail : validation
en deux étapes puis « mot de passe d'application »). Sans `SMTP_HOST`, le message est écrit
dans le terminal du serveur (développement). Réinitialisation du mot de passe (D-14) :

- jeton aléatoire de 32 octets envoyé par e-mail ; seule son empreinte SHA-256 est stockée,
  valable une heure et une seule fois ;
- la réponse est la même que le compte existe ou non (cahier §06), et un nouvel e-mail n'est
  pas envoyé moins de deux minutes après le précédent ;
- le lien est construit à partir de `APP_URL` (aucune adresse dans le code).

D-32 : la photo (JPEG, PNG ou WebP, 4 Mo au plus) est recadrée en 256 × 256 px et convertie en
WebP avec `sharp`, puis stockée dans la collection `avatars` (quelques dizaines de Ko par
compte) et servie par `/api/avatars/{id}`. Aucun service externe ni clé. Les images des
événements restent dans `public/images/` jusqu'à BF-03 (Q-10 reste ouverte pour elles).

D-33 : entité Event (réponse à Q-09 pour cette entité) : `slug` (unique, dans l'adresse),
`title`, `description` (paragraphes séparés par une ligne vide), `category` (D-15),
`startsAt`, `endsAt`, `venue`, `address`, `city`, `imageUrl`, `imageAlt`, `capacity`,
`registrationCount` (tenu à jour par BF-04), `status` (`brouillon`, `publie`, `annule` ;
« terminé » se déduit de la date) et `organizer` (référence vers un User organisateur).

- Les pages lisent les événements à l'exécution, jamais pendant le build (`connection()`),
  avec un cache partagé de quelques minutes (`"use cache"`, étiquette `events`). BF-03 doit
  appeler `revalidateTag("events")` après chaque modification.
- `npm run seed` charge le jeu de démonstration de D-18 (`lib/demo/`) : six comptes
  organisateurs (mot de passe dans `SEED_ORGANIZER_PASSWORD`) et leurs événements publiés.
  Relancer la commande met les données à jour sans doublon.

D-34 : depuis « Mon profil », l'utilisateur supprime son compte après avoir saisi son mot de
passe. La suppression est définitive : photo, compte et, pour un organisateur, ses événements
(BF-04 devra aussi supprimer les inscriptions liées).

## Décisions à prendre avant le développement

| #    | Question                                                                         | Options                               | Sources           |
| ---- | -------------------------------------------------------------------------------- | ------------------------------------- | ----------------- |
| Q-04 | Validation admin avant publication                                               | Oui · Non                             | Cahier §12        |
| Q-07 | Notifications e-mail (hors réinitialisation, imposée par D-14)                   | Obligatoires · optionnelles · exclues | Cahier BF-07, §12 |
| Q-08 | Plateforme de déploiement de démonstration                                       | À choisir                             | Cahier §07        |
| Q-09 | Champs définitifs des entités Registration, Category (User : D-29, Event : D-33) | Modèle de données à rédiger           | Cahier §07        |
| Q-10 | Stockage des images d'événements (photos de profil : D-32)                       | À choisir                             | D-14              |
