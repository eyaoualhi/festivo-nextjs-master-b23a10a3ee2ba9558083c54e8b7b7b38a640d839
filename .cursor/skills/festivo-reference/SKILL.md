---
name: festivo-reference
description: Consulte les sources de référence du projet Festivo (cahier des charges et cours « Modern Mobile Applications » ch. 1-5) avant toute décision technique, d'architecture, d'interface ou de composant. À utiliser avant d'implémenter, de modifier ou de revoir du code, quand une question porte sur un besoin BF-xx, une règle de gestion, la PWA, Tailwind, les Server Actions, ou quand l'utilisateur demande « que dit le cours / le cahier ».
---

# Sources de référence Festivo

Toute implémentation doit être justifiable par l'une de ces sources. Si aucune ne couvre le
cas, le dire explicitement et proposer une option à consigner dans `docs/decisions.md` au lieu
de l'inventer.

## Où chercher

| Question                                                    | Source                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| Que faut-il construire ? Pour qui ? Quelles règles métier ? | [cahier.md](cahier.md), original `docs/cahier-des-charges.html` |
| Comment le construire (pile, patterns, architecture) ?      | [cours.md](cours.md)                                            |
| Quelle est la syntaxe exacte d'une API Next.js ?            | `node_modules/next/dist/docs/`                                  |
| Qu'a déjà décidé l'équipe ?                                 | `docs/decisions.md`                                             |

Les supports originaux du cours (5 fichiers PowerPoint) sont hors dépôt ; `cours.md` en est la
transcription de référence, y compris le code présenté en capture d'écran.

## Procédure

1. Identifier le besoin du cahier concerné (BF-01 à BF-07, exigence non fonctionnelle, règle
   de gestion) et ses critères d'acceptation.
2. Identifier le chapitre du cours qui fixe le pattern technique.
3. Si l'exemple du cours ne compile pas avec la version installée de Next.js, garder
   l'intention du cours, adopter la syntaxe de la doc installée, et le signaler.
4. Si le cahier et le cours divergent, ne pas trancher : exposer les deux options à
   l'utilisateur (divergences déjà tranchées : base de données D-09, authentification D-10).
5. Citer la source (ex. « cahier BF-04 », « cours ch. 5 ») dans le récapitulatif livré.
