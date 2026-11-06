---
name: server-actions-donnees
description: Crée la couche de données de Festivo selon le cours (ch. 5) avec MongoDB et Mongoose — connexion à la base, modèles, Server Actions avec FormData, validation, règles de gestion et useFormStatus. À utiliser quand la tâche ajoute ou modifie une entité (User, Event, Registration, Category), une mutation, un formulaire relié au serveur ou la connexion à la base.
---

# Données et Server Actions Festivo

Référence : cours ch. 5 (`.cursor/skills/festivo-reference/cours.md`), règle
`50-donnees-server-actions`, cahier §06-07.

## Base retenue

MongoDB + Mongoose (décision D-09 de `docs/decisions.md`). `mongoose` est déjà installé et
`MONGODB_URI` figure dans `.env.example`. Si l'entité touche un champ encore ouvert
(Q-03 à Q-09), demander avant de figer le schéma.

## Étapes

1. Vérifier que `.env.local` définit `MONGODB_URI` (copie de `.env.example`) et qu'une
   instance MongoDB locale ou Atlas répond.
2. **`lib/db.ts`** (à créer s'il n'existe pas) — `connectDB()` réutilisant une connexion unique (garde `isConnected` du
   cours, ou cache sur `globalThis` pour survivre au rechargement à chaud), URL lue dans
   `process.env.MONGODB_URI`, erreur explicite si la variable manque. Pas d'options obsolètes,
   pas de `as any`.
3. **`models/<Entite>.ts`** — `new Schema({...})` avec `required`, `default`, `enum` pour les
   statuts ; export `models.<Entite> || mongoose.model("<Entite>", <Entite>Schema)`. Index
   unique pour les contraintes métier (ex. inscription unique par couple utilisateur /
   événement).
4. **`app/actions/<Entite>.ts`** — `"use server"` en tête ; pour chaque action :
   1. vérifier la session et le rôle (contrôle d'accès serveur) ;
   2. lire `formData.get("champ")?.toString()` et valider chaque champ ;
   3. appliquer les règles de gestion du cahier §06 concernées ;
   4. `await connectDB()` puis écrire ;
   5. revalider la route affichant la donnée ;
   6. retourner `{ ok: true }` ou `{ ok: false, error: "cle-du-message" }` (clé traduite côté interface, D-19).
5. **Formulaire** — `<form action={action}>` dans un Server Component ; bouton d'envoi
   client avec `useFormStatus()` → `disabled={pending}`. Pour afficher l'erreur retournée,
   utiliser `useActionState` (vérifier la signature dans la doc Next.js installée).

## Vérifier

- Cas nominal, champ manquant, doublon, capacité atteinte, événement passé ou annulé,
  utilisateur non autorisé : chacun produit le comportement attendu par le cahier.
- Aucun identifiant de connexion dans le code ni dans les messages d'erreur.
- Skill `verification-qualite`.
