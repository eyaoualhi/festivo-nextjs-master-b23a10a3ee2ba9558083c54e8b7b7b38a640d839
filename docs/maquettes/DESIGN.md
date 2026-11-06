---
name: Festivo Event System
colors:
  surface: "#f9f9ff"
  surface-dim: "#d1daf4"
  surface-bright: "#f9f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f1f3ff"
  surface-container: "#e9edff"
  surface-container-high: "#e1e8ff"
  surface-container-highest: "#d9e2fc"
  on-surface: "#121b2e"
  on-surface-variant: "#444654"
  inverse-surface: "#273044"
  inverse-on-surface: "#edf0ff"
  outline: "#747685"
  outline-variant: "#c4c5d6"
  surface-tint: "#3352ce"
  primary: "#002ea8"
  on-primary: "#ffffff"
  primary-container: "#2748c4"
  on-primary-container: "#bdc7ff"
  inverse-primary: "#b8c3ff"
  secondary: "#505f76"
  on-secondary: "#ffffff"
  secondary-container: "#d0e1fb"
  on-secondary-container: "#54647a"
  tertiary: "#702500"
  on-tertiary: "#ffffff"
  tertiary-container: "#963500"
  on-tertiary-container: "#ffba9f"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#dde1ff"
  primary-fixed-dim: "#b8c3ff"
  on-primary-fixed: "#001356"
  on-primary-fixed-variant: "#0f37b6"
  secondary-fixed: "#d3e4fe"
  secondary-fixed-dim: "#b7c8e1"
  on-secondary-fixed: "#0b1c30"
  on-secondary-fixed-variant: "#38485d"
  tertiary-fixed: "#ffdbce"
  tertiary-fixed-dim: "#ffb599"
  on-tertiary-fixed: "#370e00"
  on-tertiary-fixed-variant: "#7f2b00"
  background: "#f9f9ff"
  on-background: "#121b2e"
  surface-variant: "#d9e2fc"
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: "800"
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: "800"
    lineHeight: 36px
  headline-lg:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 26px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

Ce système de design incarne une esthétique SaaS moderne, structurée et hautement fonctionnelle, conçue pour orchestrer la gestion d'événements avec clarté et sérénité. Destinée à un usage mobile-first via PWA tout en s'adaptant harmonieusement aux grands écrans, l'interface privilégie une rigueur d'ingénierie adoucie par des finitions soignées.

L'expérience visuelle repose sur un minimalisme chaleureux et lisible :

- **Efficacité sans bruit visuel** : Suppression systématique des fioritures décoratives au profit de la structure des données, des statuts d'événements et de la fluidité des formulaires.
- **Ton professionnel et accessible** : Interface intégralement rédigée en français, utilisant une typographie géométrique affirmée pour les titres et un texte de labeur d'une précision chirurgicale.
- **Ressenti tactile & réactivité** : Zones d'interaction généreuses (touch targets ≥ 44px), rétroactions visuelles immédiates et micro-élévations calibrées pour un usage d'une seule main sur mobile.

## Colors

La palette chromatique est optimisée pour un affichage clair, lumineux et contrasté, conforme aux normes WCAG AA/AAA.

### Hiérarchie des couleurs

- **Primaire (`#2748C4`)** : Couleur pilier réservée aux actions principales, barres de progression, indicateurs actifs de navigation et éléments interactifs de premier rang.
  - _Accent Hover / Active_ : `#1F3AA3` (abaissement tonal pour l'interaction).
  - _Accent Light / Surface Subtile_ : `#EEF2FF` (fonds d'étiquettes d'état, sélections actives, arrière-plans de badges).
- **Neutres & Surfaces** :
  - _Fond d'application (Canvas)_ : `#FFFFFF` (fond immaculé assurant un contraste maximal).
  - _Surface Carte / Container_ : `#FFFFFF` surélevé par une bordure structurelle `#E2E8F0`.
  - _Texte Fondamental_ : `#172033` (gris nuit profond offrant une lisibilité supérieure au noir pur).
  - _Texte Atténué / Secondaire_ : `#64748B` (ardoise neutre pour les métadonnées, horodatages et placeholders).
  - _Bordures & Séparateurs_ : `#E2E8F0` pour les délimitations nettes mais non agressives.
- **Sémantique & Alertes** :
  - _Erreur / Destructif_ : `#DC2626` (pour les labels d'erreur, bordures d'inputs non valides et confirmations de suppression).
  - _Succès_ : `#16A34A` (validation de création d'événement ou d'invitation).
  - _Avertissement_ : `#D97706` (alertes de capacité ou de planification imminente).

## Typography

La typographie s'appuie sur une dualité claire : la rondeur géométrique et structurée de **Manrope** pour les en-têtes et le caractère fonctionnel et équilibré de **Geist** pour la lecture continue et les interfaces denses.

- **Règles d'application** :
  - Les titres (`headline-*`) utilisent exclusivement Manrope avec un suivi resserré (`letter-spacing: -0.02em`) pour projeter assurance et distinction.
  - Le corps de texte et les composants interactifs (`body-*`, `label-*`) reposent sur Geist pour assurer une netteté totale sur écrans OLED et Retina, en particulier sur mobile à 390px.
  - Tous les libellés de formulaires sont typés en `label-lg` ou `label-md` avec une graisse semi-bold (`600`) afin d'assurer leur visibilité immédiate au-dessus des champs.

## Layout & Spacing

Le dimensionnement suit une grille rythmique stricte de 8px (sous-multiples de 4px autorisés pour les alignements fins de texte et d'icônes).

### Philosophie d'implantation

- **Mobile-First (Base 390px)** :
  - Colonne unique à défilement vertical fluide.
  - Marges extérieures fixées à `1rem` (16px) pour maximiser la surface utile.
  - Espacement vertical minimal entre les sections de formulaires : `1.5rem` (24px).
  - Hauteur minimale garantie de 44px pour tous les contrôles interactifs afin d'optimiser l'expérience au pouce.
  - Dégagement inférieur systématique de `5rem` (80px) pour éviter toute occlusion causée par la barre de navigation basse PWA.
- **Desktop (Breakpoints à 768px et 1024px+)** :
  - Grille responsive à 12 colonnes, centrée avec une largeur maximale de contenu de `1200px`.
  - Marges extérieures portées à `2.5rem` (40px) et gouttières de `1.5rem` (24px).
  - La navigation bascule d'une barre basse à un en-tête horizontal persistant (`header`) collé en haut de l'écran avec une hauteur fixe de 64px.

## Elevation & Depth

Le traitement de la profondeur s'éloigne des ombres lourdes au profit d'un étagement subtil combinant bordures douces et ombres d'ambiance ultra-diffuses.

- **Niveau 0 (Toile / Background)** : Fond `#FFFFFF` à plat.
- **Niveau 1 (Cartes & Conteneurs de contenu)** :
  - Fond `#FFFFFF`.
  - Bordure périphérique pleine de 1px en `#E2E8F0`.
  - Ombre d'ambiance : `0px 1px 3px rgba(23, 32, 51, 0.04), 0px 1px 2px rgba(23, 32, 51, 0.02)`.
- **Niveau 2 (Survol & Menus Déroulants)** :
  - Bordure de 1px en `#CBD5E1`.
  - Ombre douce : `0px 4px 6px -1px rgba(23, 32, 51, 0.06), 0px 2px 4px -2px rgba(23, 32, 51, 0.04)`.
- **Niveau 3 (Barres de navigation fixées & Modales)** :
  - Barre basse mobile (`Bottom Navigation`) et barre supérieure desktop (`Header`).
  - Arrière-plan `#FFFFFF` semi-opaque avec filtre de flou (`backdrop-filter: blur(12px)`).
  - Bordure supérieure (mobile) ou inférieure (desktop) de 1px en `#E2E8F0`.
  - Ombre directionnelle : `0px -2px 10px rgba(23, 32, 51, 0.04)` sur mobile.

## Shapes

La géométrie des éléments repose sur un système arrondi mesuré (facteur 2), conférant à l'interface un aspect accueillant tout en préservant son caractère rigoureux.

- **Boutons & Champs de saisie** : `rounded-xl` (12px à 16px) pour un confort tactile prononcé et une délimitation franche du champ d'interaction.
- **Cartes d'événements & Boîtes de dialogue** : `rounded-2xl` (16px à 24px) créant des îlots d'information autonomes et doux à l'œil.
- **Badges, Pastilles & Indicateurs d'état** : `rounded-full` (capsules 9999px) pour les distinguer formellement des cartes et des boutons d'action.
- **Éléments graphiques secondaires** : Icônes logées dans des conteneurs carrés adoucis avec des rayons proportionnels de 8px à 12px.

## Components

### 1. Boutons

- **Bouton Principal** :
  - Hauteur minimale : 48px (au-dessus du seuil de 44px).
  - Arrière-plan : `#2748C4` ; texte : `#FFFFFF` (`label-lg`).
  - Rayon : `rounded-xl` (12px).
  - État hover/focus : Arrière-plan `#1F3AA3`, anneau de focus contrasté de 2px décalé de 2px (`#2748C4`).
- **Bouton Secondaire** :
  - Hauteur minimale : 48px.
  - Arrière-plan : `#FFFFFF` ; bordure : 1px `#E2E8F0` ; texte : `#172033`.
  - État hover : Arrière-plan `#F8FAFC`, bordure `#CBD5E1`.
- **Bouton Tertiaire / Neutre** :
  - Arrière-plan transparent ; texte : `#64748B`.
  - État hover : Texte `#172033`, fond `#EEF2FF`.

### 2. Champs de formulaire & Formulaires accessibles

- **Disposition stricte** : Le label (`<label>`) est obligatoirement positionné **au-dessus** du champ, composé en `label-lg`, couleur `#172033`.
- **Champs de saisie (`<input>`, `<select>`, `<textarea>`)** :
  - Hauteur minimale : 48px.
  - Fond : `#FFFFFF` ; bordure : 1px `#E2E8F0` ; rayon : `rounded-xl`.
  - Texte : `#172033` (`body-md`) ; texte indicatif (placeholder) : `#64748B`.
  - Focus : Bordure `#2748C4` avec contour lumineux `0 0 0 3px rgba(39, 72, 196, 0.15)`.
- **Gestion des erreurs** :
  - En cas d'erreur de validation, la bordure passe immédiatement en `#DC2626`.
  - Un message textuel explicite s'affiche sous l'input en `body-sm`, couleur `#DC2626`, accompagné d'un pictogramme d'avertissement accessible.

### 3. Cartes d'Événements

- **Structure** : Fond `#FFFFFF`, bordure de 1px `#E2E8F0`, rayon `rounded-2xl`, marge intérieure (`padding`) de 16px à 20px.
- **Contenu type** :
  - En-tête : Titre de l'événement en Manrope `headline-md` et badge d'état (Confirmé, En attente, Brouillon).
  - Corps : Rangée d'icônes avec date, heure et localisation en Geist `body-md` (`#64748B`).
  - Pied de carte : Nombre d'invités/participants inscrits et bouton d'accès rapide.

### 4. Badges & Chips d'État

- **Format** : Capsule pleine (`rounded-full`), padding vertical de 4px, horizontal de 12px.
- **Typographie** : `label-sm` en graisse 600.
- **Variantes** :
  - _Actif / À venir_ : Fond `#EEF2FF`, texte `#2748C4`.
  - _Terminé / Archivé_ : Fond `#F1F5F9`, texte `#64748B`.
  - _Annulé / Urgent_ : Fond `#FEF2F2`, texte `#DC2626`.

### 5. Boîtes à cocher & Boutons Radio

- **Dimensions** : Carré de 22x22px pour les cases à cocher, cercle de 22px pour les boutons radio, inclus dans une zone cliquable parente d'au moins 44x44px.
- **État non coché** : Bordure 2px `#CBD5E1`, fond `#FFFFFF`.
- **État sélectionné** : Fond `#2748C4`, bordure `#2748C4`, coche blanche interne nette.

### 6. Navigation

- **Mobile (Barre Basse PWA)** :
  - Hauteur fixe de 64px, ancrée en bas d'écran avec support de la zone sécurisée iOS/Android (`safe-area-inset-bottom`).
  - 3 à 4 destinations principales (ex. : Événements, Calendrier, Créer, Paramètres).
  - Éléments tactiles centrés, icône 24px + texte `label-sm`. L'élément actif prend la couleur `#2748C4`, les inactifs `#64748B`.
- **Desktop (En-tête supérieur)** :
  - Barre horizontale de 64px, logo à gauche, liens de navigation au centre, profil/action rapide à droite.
  - Séparation par bordure inférieure de 1px `#E2E8F0`.
