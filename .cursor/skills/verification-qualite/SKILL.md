---
name: verification-qualite
description: Vérifie qu'une modification de Festivo est livrable — lint, types, formatage, build, puis conformité aux exigences non fonctionnelles du cahier (mobile, accessibilité, sécurité) et aux règles du projet. À utiliser après toute modification de code, avant un commit ou une pull request, ou quand l'utilisateur demande de vérifier, tester ou valider.
---

# Vérification qualité Festivo

## 1. Contrôles automatiques (dans cet ordre, depuis la racine du projet)

```bash
npm run lint          # ESLint (eslint-config-next + prettier)
npm run typecheck     # next typegen + tsc --noEmit
npm run format:check  # Prettier ; corriger avec npm run format
npm run build         # build de production Next.js
```

Raccourci : `npm run check` enchaîne les quatre. Corriger la cause de chaque erreur ; ne pas
désactiver une règle ESLint, ajouter `@ts-ignore` ni relâcher `tsconfig.json` pour faire
passer un contrôle.

## 2. Revue de conformité

```
- [ ] Source citée pour chaque choix (cahier BF-xx / règle de gestion, cours ch. N)
- [ ] Rien hors périmètre (cahier §03), aucune donnée fictive codée en dur
- [ ] "use client" uniquement là où le cours l'exige
- [ ] Tailwind mobile-first, aucun fichier CSS ajouté hors globals.css
- [ ] Champs avec <label>, un h1 par page, textes dans les trois dictionnaires (fr, en, ar)
- [ ] Écran vérifié en clair et en sombre, et en arabe (sens droite à gauche)
- [ ] Droits et règles de gestion vérifiés côté serveur
- [ ] Aucun secret ni URL de base dans le code ; .env.example à jour
- [ ] docs/decisions.md et README.md à jour si une décision ou une commande a changé
```

## 3. Vérification manuelle (si une interface a changé)

`npm run dev`, puis l'écran concerné à 375 px, 768 px et 1280 px de large (DevTools → mode
appareil), au clavier (Tab / Entrée), sur Chrome et un second navigateur (cahier §05). Pour
la PWA, suivre la section « Vérifier » du skill `pwa-offline`.

## 4. Compte rendu

Lister les commandes exécutées et leur résultat réel, ce qui n'a pas pu être vérifié et
pourquoi. Ne pas annoncer « build OK » sans l'avoir exécuté.
