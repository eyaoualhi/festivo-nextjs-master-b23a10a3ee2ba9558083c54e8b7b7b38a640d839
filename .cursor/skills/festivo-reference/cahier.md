# Cahier des charges Festivo — synthèse fidèle

Original : `docs/cahier-des-charges.html` (version 0.1, brouillon). En cas de doute, l'original
fait foi. Le cahier nomme le projet « EventFlow (provisoire) » ; le nom définitif est
**Festivo**.

## Contexte

Application mobile de gestion des événements, réalisée par une équipe de 6 avec Next.js.
Problématique : une application simple et accessible sur téléphone permettant aux
organisateurs de gérer leurs événements et aux utilisateurs de les consulter et de s'y inscrire.

**Rôles** : Visiteur (consulte les événements publiés) · Participant (compte, inscription,
consulte ses inscriptions) · Organisateur (crée et gère ses événements, suit les inscriptions)
· Administrateur (supervise comptes et contenus).

## Périmètre

**Inclus (V1)** : authentification et rôles de base ; catalogue, recherche, détail ; création,
modification, suppression d'événements par les personnes autorisées ; inscription et
désinscription ; tableau de bord simple pour l'organisateur ; module Réclamation ; module Avis ;
module Forum.

**Hors périmètre initial (à confirmer)** : paiement en ligne, billetterie QR et contrôle
d'accès, chat temps réel, application native sur les stores, recommandations ou intégrations
externes. Next.js produit une application **web responsive** utilisable sur mobile.

## Besoins fonctionnels

- **BF-01 Comptes et authentification** : créer un compte participant ; connexion et
  déconnexion ; consulter et modifier son profil ; permissions selon le rôle.
- **BF-02 Consultation** : liste des événements publiés ; fiche détaillée (titre, description,
  date, heure, lieu, organisateur, capacité) ; recherche par mot-clé ; filtres date, catégorie,
  lieu.
- **BF-03 Gestion des événements** : créer avec les champs obligatoires ; modifier ou annuler
  un événement dont on est responsable ; publier / dépublier ; capacité maximale et places
  restantes (si retenu).
- **BF-04 Inscriptions** : s'inscrire à un événement publié si les conditions sont remplies ;
  empêcher les doublons ; refuser si complet ou passé ; consulter et annuler ses inscriptions.
- **BF-05 Tableau de bord organisateur** : ses événements ; nombre d'inscrits par événement ;
  liste des participants ; statut (brouillon, publié, annulé, terminé).
- **BF-06 Administration** : consulter comptes et événements ; supprimer ou désactiver un
  contenu inapproprié ; gérer les rôles (droits réservés à l'admin).
- **BF-07 Notifications (optionnel)** : confirmation après inscription ou annulation ; rappels
  ou e-mails seulement si le temps et les services le permettent.
- **BF-08 Réclamation** : déposer une réclamation (objet, description, événement optionnel) ;
  consulter le statut (reçue, en cours, traitée, rejetée) ; traitement et réponse par
  organisateur ou admin ; pas de modification une fois traitée (sauf admin).
- **BF-09 Avis** : note et commentaire sur un événement ; moyenne et liste sur la fiche ;
  un avis par utilisateur et par événement ; modification / suppression de son avis ;
  modération admin.
- **BF-10 Forum** : discussion liée à un événement ou forum général ; créer un sujet et
  répondre ; consulter le fil ; modifier / supprimer ses messages ; modération admin
  (suppression, verrouillage).

**Priorité** : BF-01 à BF-04, puis tableau de bord et administration, puis Réclamation (BF-08),
Avis (BF-09) et Forum (BF-10), puis notifications.

## Besoins non fonctionnels

| Catégorie      | Exigence                                                                 | Vérification                                |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| Ergonomie      | Interface simple, cohérente, adaptée au téléphone                        | Parcours testés sur mobile et ordinateur    |
| Responsive     | Pages adaptées aux tailles d'écran                                       | Plusieurs largeurs                          |
| Performance    | Pages et listes fluides                                                  | Tests manuels, optimisation images/requêtes |
| Sécurité       | Validation des données, contrôle d'accès serveur, mots de passe protégés | Impossible de modifier l'événement d'autrui |
| Fiabilité      | Erreurs gérées clairement, données cohérentes                            | Formulaires invalides, doublons, complet    |
| Maintenabilité | Code structuré, composants réutilisables, nommage, doc minimale          | Revue de code, README à jour                |
| Compatibilité  | Navigateurs récents                                                      | Chrome + au moins un autre                  |
| Accessibilité  | Contrastes, labels, navigation compréhensible                            | Contrôle manuel des formulaires             |

## Règles de gestion

1. Seul un utilisateur autorisé peut créer ou modifier un événement.
2. Un événement publié contient au minimum titre, description, date, lieu, organisateur.
3. La date d'un nouvel événement n'est pas dans le passé (sauf besoin accepté).
4. Une seule inscription active par participant et par événement.
5. La capacité maximale, si définie, n'est pas dépassée.
6. Événement annulé ou terminé : plus de nouvelles inscriptions.
7. Une réclamation est liée à un utilisateur connecté et comporte objet + description.
8. Consultation d'une réclamation : auteur, organisateur concerné ou administrateur.
9. Un seul avis par utilisateur et par événement ; avis réservés aux participants inscrits
   (ou ayant assisté), selon la règle retenue.
10. Forum soumis à modération ; l'admin peut supprimer ou verrouiller un contenu.
11. Les erreurs de validation sont expliquées sans divulguer de données sensibles.

## Choix techniques (base à valider)

Next.js + React + **TypeScript** ; CSS Modules, Tailwind ou autre solution commune ; API Routes
ou Server Actions. Base : PostgreSQL **ou** MySQL (une seule), ORM possible Prisma ;
authentification choisie collectivement et documentée. Git + GitHub/GitLab ; gestion des
tâches (GitHub Projects, Trello, Jira). Déploiement de démonstration ; tests manuels et
automatisés ciblés ; README.

**Entités** : User (id, nom, e-mail, rôle) · Event (id, titre, description, dates, lieu,
capacité, statut, organisateur) · Registration (id, utilisateur, événement, date, statut) ·
Category (id, nom, si retenue) · Complaint / Réclamation (auteur, événement optionnel, objet,
description, statut, réponse, dates) · Review / Avis (auteur, événement, note, commentaire,
dates) · ForumTopic (auteur, événement optionnel, titre, statut ouvert/verrouillé, dates) ·
ForumPost (sujet, auteur, contenu, dates).

## Équipe (responsable principal, pas exclusif)

1 Coordination et intégration · 2 Interface et design système · 3 Authentification et profils
· 4 Catalogue et recherche · 5 Gestion des événements et tableau de bord · 6 Inscriptions,
tests et qualité. Revues croisées obligatoires.

## Planning

1 Cadrage → 2 Mise en place (dépôt, Next.js, base, modèle) → 3 Développement principal →
4 Intégration et tests → 5 Livraison (déploiement, README, démonstration).

## Critères d'acceptation

Créer un compte et se connecter ; consulter et rechercher les événements publiés ; un
organisateur autorisé gère ses événements ; un participant s'inscrit et voit ses inscriptions ;
déposer une réclamation et suivre son statut ; laisser un avis (note + commentaire) avec moyenne
affichée ; créer des sujets / réponses forum avec modération admin ; capacité et doublons
gérés ; parcours fonctionnels sur mobile et ordinateur ; aucune anomalie bloquante connue.

## Risques

Conflits de code → conventions, branches par fonctionnalité, revues de PR · Ambition excessive
→ version minimale d'abord · Retards d'intégration → intégrer régulièrement · Décisions
divergentes → les consigner (README / note d'architecture) · Disponibilités inégales → tâches
visibles, point d'équipe régulier.

## Décisions à confirmer (§12)

Web responsive ou natif ; rôles nécessaires ; base de données et authentification ; validation
admin avant publication ; inscriptions gratuites uniquement ; e-mails obligatoires ou non ;
dates limites et exigences de l'encadrant.
