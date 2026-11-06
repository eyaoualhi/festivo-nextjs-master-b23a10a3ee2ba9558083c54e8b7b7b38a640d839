---
name: nouvelle-fonctionnalite
description: Déroule l'implémentation d'un besoin du cahier des charges Festivo (BF-01 à BF-07) en respectant le cours et les règles du projet — cadrage, plan de fichiers, implémentation, vérification. À utiliser uniquement quand l'utilisateur demande explicitement de développer une fonctionnalité, une page, un formulaire, un composant ou une Server Action.
---

# Implémenter une fonctionnalité Festivo

Ne jamais démarrer sans demande explicite : le projet est un squelette tant que l'utilisateur
n'a pas lancé le développement d'un besoin précis.

```
Progression :
- [ ] 1. Cadrer le besoin
- [ ] 2. Vérifier les décisions prérequises
- [ ] 3. Planifier les fichiers
- [ ] 4. Implémenter
- [ ] 5. Vérifier et livrer
```

## 1. Cadrer le besoin

Lire le besoin dans `.cursor/skills/festivo-reference/cahier.md` : sous-points du BF, règles
de gestion concernées, exigences non fonctionnelles, critères d'acceptation. Reformuler en une
liste testable. Ne rien ajouter qui soit hors périmètre (cahier §03).

## 2. Vérifier les décisions prérequises

Consulter `docs/decisions.md`. Si le besoin dépend d'une décision ouverte
(validation admin, champs des entités, stockage des images), **s'arrêter et demander** à l'utilisateur ; ne pas
choisir à sa place.

## 3. Planifier les fichiers

Placer chaque élément selon la règle `10-architecture-nextjs` :

| Élément                     | Emplacement                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| Page / segment              | `app/<segment>/page.tsx` (+ `loading.tsx`, `error.tsx` si données) |
| Mutation                    | `app/actions/<Entite>.ts` (skill `server-actions-donnees`)         |
| Modèle                      | `models/<Entite>.ts`                                               |
| UI réutilisable             | `components/ui/` ; coquille : `components/layout/`                 |
| Logique client réutilisable | `hooks/useXxx.ts` ; état partagé : `context/`                      |

Présenter le plan à l'utilisateur avant d'écrire si plus de 5 fichiers sont concernés.

## 4. Implémenter

- Server Component par défaut ; `"use client"` seulement sur la feuille interactive.
- Tailwind mobile-first, labels sur chaque champ, textes ajoutés aux dictionnaires
  `lib/i18n/dictionaries/` (fr, en, ar), classes logiques pour l'arabe (D-19).
- Contrôles d'accès et règles de gestion **côté serveur**.
- Aucune donnée fictive codée en dur.

## 5. Vérifier et livrer

Appliquer le skill `verification-qualite`. Dans le récapitulatif : fichiers créés ou modifiés,
besoin et règles couverts (« cahier BF-04, règles 4 à 6 »), chapitre du cours suivi, écarts
éventuels avec la source et leur raison, décisions ajoutées à `docs/decisions.md`.
