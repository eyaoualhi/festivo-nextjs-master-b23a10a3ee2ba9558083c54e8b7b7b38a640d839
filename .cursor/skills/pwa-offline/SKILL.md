---
name: pwa-offline
description: Met en place ou modifie les éléments PWA de Festivo selon le cours (ch. 1 et 3) — Web App Manifest, enregistrement du Service Worker, stratégies de cache, mode hors ligne, installabilité et HTTPS. À utiliser quand la tâche touche public/manifest.json, public/sw.js, le cache, l'offline, l'installation sur l'écran d'accueil ou les notifications push.
---

# PWA Festivo : manifest, Service Worker, offline

Référence : cours ch. 1 et 3 (`.cursor/skills/festivo-reference/cours.md`), règle `40-pwa`,
puis pour la syntaxe `node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md`
et `offline-support.md`.

## Déjà en place

`public/manifest.json`, `public/icons/icon-192x192.png` et `icon-512x512.png` (provisoires),
`metadata.manifest` et `viewport.themeColor` dans `app/layout.tsx`.

## Ajouter le Service Worker (quand l'utilisateur le demande)

1. **`public/sw.js`** — trois écouteurs, cache versionné :
   - `install` : `caches.open(CACHE_NAME)` puis `addAll` des ressources de la coquille
     (`/`, `/manifest.json`, icônes), puis `self.skipWaiting()` ;
   - `activate` : supprimer tout cache dont le nom diffère de `CACHE_NAME`, puis
     `self.clients.claim()` ;
   - `fetch` : ignorer tout ce qui n'est pas `GET` ou pas de même origine ; appliquer la
     stratégie du tableau de la règle `40-pwa`.
2. **Enregistrement** — composant client `components/layout/ServiceWorkerRegister.tsx`
   (`"use client"`) qui, dans un `useEffect`, appelle
   `navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })` si
   `"serviceWorker" in navigator`, et ne rend rien. Le monter une fois dans `app/layout.tsx`.
3. **En-têtes** — dans `next.config.ts`, `headers()` pour `source: "/sw.js"` :
   `Content-Type: application/javascript; charset=utf-8`,
   `Cache-Control: no-cache, no-store, must-revalidate`.
4. **Offline côté navigation** (optionnel) : `experimental.useOffline` et le hook
   `useOffline` de `next/offline` pour un bandeau « hors ligne » ; lire le guide
   `offline-support.md` avant de l'activer.

## Interdits

- Mettre en cache les Server Actions, les `POST`, les pages authentifiées ou les données
  personnelles.
- Changer la logique du SW sans incrémenter `CACHE_NAME`.
- Remplacer `public/manifest.json` par `app/manifest.ts` (le cours impose `public/`).

## Vérifier

1. `npm run build && npm run start` (le mode dev ne reflète pas l'offline), ou
   `npm run dev:https` pour tester en HTTPS.
2. DevTools → Application → Manifest : aucun avertissement, icônes chargées.
3. DevTools → Application → Service Workers : état « activated » ; Cache Storage contient la
   coquille.
4. DevTools → Network → Offline : la coquille s'affiche, les zones de données affichent un état
   hors ligne compréhensible.
5. Lighthouse (catégorie PWA / bonnes pratiques) sur mobile.
