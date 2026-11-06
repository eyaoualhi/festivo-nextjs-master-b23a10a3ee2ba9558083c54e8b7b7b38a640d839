# Cours « Modern Mobile Applications » — transcription de référence

Module de 30 h, évaluation 100 % sur le projet. Objectifs : distinguer natif / hybride / PWA ;
créer une application mobile moderne avec Next.js ; intégrer manifest et Service Worker
(offline + installation) ; optimiser (performance, accessibilité, sécurité) ; structurer des
données dynamiques ; déployer et présenter un projet complet.

Les blocs de code ci-dessous reproduisent les captures des diapositives. Les notes
« ⚠ Version installée » indiquent où la syntaxe doit être adaptée à Next.js 16.

---

## Chapitre 1 — Introduction aux PWA

- Évolution : natif (2 bases de code, coûteux) → hybride (Cordova, Ionic) → cross-platform
  (React Native, Flutter) → **PWA** (pas de store, installable, offline, rapide).
- PWA vs natif vs web : installation en un clic, offline via cache + SW, mises à jour
  automatiques, coût faible, portabilité élevée.
- **Principes de base** : HTTPS obligatoire ; Web App Manifest ; Service Worker (cache,
  offline, push) ; responsive design ; performances (Core Web Vitals).
- Service Worker : script en arrière-plan, intermédiaire application / navigateur / réseau ;
  intercepte les requêtes, met en cache les fichiers essentiels, répond depuis le cache hors
  ligne.
- Manifest : `name`, `short_name`, `theme_color`, `background_color`, `icons` (src, sizes,
  type), `display`, `start_url`, `description`.

```bash
npx create-next-app my-pwa
cd my-pwa
npm run dev
```

```json
// public/manifest.json
{
  "short_name": "My PWA",
  "name": "My Progressive Web App",
  "description": "A simple PWA built with React and Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [{ "src": "/icon.png", "sizes": "192x192", "type": "image/png" }]
}
```

Vérification : DevTools → Application → Manifest.

---

## Chapitre 2 — Architecture et App Shell

- **MPA** : rapide au premier chargement, bon SEO, mais rechargements à chaque navigation,
  mauvais sur mobile. **SPA** : navigation instantanée, mais premier chargement lourd,
  dépendance au JS, SEO complexe. Aucun des deux n'est offline par défaut → modèle hybride.
- **App Shell** : charger en priorité la structure (HTML minimal, CSS de base, JS de démarrage,
  navigation, header, footer) et la mettre en cache via le SW ; seule la zone de contenu
  dynamique change. Cycle : 1er lancement → shell téléchargé et mis en cache ; navigations
  suivantes → shell servi depuis le cache ; contenu chargé depuis l'API ou le cache.
- React : UI déclarative à base de composants réutilisables. Ses limites (routing, SSR,
  optimisation, backend) sont couvertes par **Next.js** : routing par le système de fichiers,
  SSR + SSG, optimisation d'images, code splitting, lazy loading, API Routes, support PWA.
- SSR : HTML pré-rendu sur le serveur avec les données → page complète immédiatement (vs CSR).

```bash
npx create-next-app@latest my-pwa --ts --app --tailwind
```

- Organisation : configuration à la racine ; routes = structure des dossiers ; code applicatif
  dans des dossiers dédiés. `app/` (App Router), `public/` (statiques, manifest), `src/`
  optionnel. **Pour une PWA : `app/` + `public/`.**
- Fichiers de `app/` : `page.tsx` (page), `layout.tsx` (structure commune), `loading.tsx`
  (squelette), `error.tsx` (erreurs), `route.ts` (endpoint). Hiérarchie :
  Layout > Template > ErrorBoundary(error) > Suspense(loading) > ErrorBoundary(not-found) > Page.
- `app/page.tsx` → `/` ; `app/about/page.tsx` → `/about` ; `app/contact/page.tsx` → `/contact`.

```tsx
// Route dynamique telle que présentée dans le cours
export default function UserPage({ params }: { params: { id: string } }) {
  return <h1>User ID: {params.id}</h1>;
}
```

⚠ Version installée : `params` est une `Promise`. Écrire
`export default async function UserPage({ params }: PageProps<"/users/[id]">)` puis
`const { id } = await params;`.

---

## Chapitre 3 — Service Workers, cache et Tailwind CSS

- Mobile-first et offline sont complémentaires : connexions lentes, instables ou coûteuses.
- Trois piliers : HTTPS, Web App Manifest (installabilité), Service Worker (moteur offline).
- **Cycle de vie du SW** (`sw.js`) : enregistrement → `install` (pré-cache des ressources
  essentielles) → `activate` (nettoyage de l'ancien cache, la nouvelle version prend le relais)
  → écoute de `fetch` → mise à jour si le fichier change. Événements avancés : `push`
  (notifications), `sync` (synchronisation différée).
- Sécurité : HTTPS obligatoire sauf en local ; portée limitée au répertoire d'enregistrement ;
  aucun accès au DOM.
- **Stratégies de cache** : Cache First (cache d'abord, réseau en dernier recours) ; Network
  First (réseau d'abord, cache en secours) ; Stale-While-Revalidate (cache servi, mise à jour en
  arrière-plan) ; Network Only / Cache Only pour des cas stricts.
- Manifest + SW : le manifest rend installable, le SW apporte la robustesse offline.
- **Tailwind CSS** : framework utility-first ; chaque classe = une règle CSS ; pas de
  composants préconstruits. Conçu pour le responsive et le mobile-first, styles dans les
  composants (pas de dispersion des feuilles de style).
  - `<button class="bg-blue-500 text-white p-2 rounded">` plutôt que `.button { … }`.
  - Breakpoints mobile-first : sans préfixe = mobile, puis `sm:`, `md:`, `lg:`
    (ex. `text-sm md:text-lg`).
  - Typographie et couleurs : `text-xl`, `font-bold`, `text-gray-600`, `bg-blue-500`.
  - Mise en page : `flex`, `flex-col`, `justify-between`, `grid-cols-2`.

---

## Chapitre 4 — Fondamentaux React et Hooks dans Next.js

- Composant = fonction TypeScript qui retourne du TSX, une partie de l'UI.
- **Server Components par défaut** ; **Client Components** avec `"use client"` pour l'état et
  les événements.

```tsx
function Header() {
  return <h1>Bienvenue sur ma boutique Next.js</h1>;
}
export default Header;
```

```tsx
// Props — forme déstructurée recommandée
function Welcome({ name }) {
  return <h1>Bonjour {name}</h1>;
}
export default function Home() {
  return <Welcome name="SIM" />;
}
```

- State : valeur dynamique propre au composant. **Client state** (compteur, formulaire, menu)
  vs **server state** (liste de produits, données utilisateur récupérées côté serveur).
- `"use client"` obligatoire si `useState` / `useEffect`, événements utilisateur, ou accès au
  DOM / API navigateur.

```tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Compteur : {count}</button>;
}
```

```tsx
"use client";
import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval); // nettoyage au démontage
  }, []); // une seule exécution au montage
  return <p>Temps écoulé : {seconds} s</p>;
}
```

```tsx
"use client";
import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/home")}>Aller à la page Home</button>;
}
```

`router.push`, `router.replace`, `router.back`, `router.prefetch`. ⚠ Version installée :
`router.query` n'existe pas dans l'App Router → `useParams()` / `useSearchParams()`.

```tsx
// Authentification avec next-auth
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Chargement...</p>;
  return session ? (
    <>
      <p>Bonjour, {session.user.name}</p>
      <button onClick={() => signOut()}>Se déconnecter</button>
    </>
  ) : (
    <>
      <p>Vous n’êtes pas connecté</p>
      <button onClick={() => signIn()}>Se connecter</button>
    </>
  );
}
```

```tsx
// context/UserContext — état partagé sans passer de props
"use client";
import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}
// + hook personnalisé useUser() = useContext(UserContext)
```

⚠ En TypeScript strict : typer le contexte (`createContext<UserContextValue | null>(null)`).

```ts
// Hook personnalisé useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => localStorage.getItem(key) || initialValue);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue];
}
```

⚠ `localStorage` n'existe pas au rendu serveur : lire la valeur dans un `useEffect`.

---

## Chapitre 5 — Persistance avec Server Actions et MongoDB

- Sans persistance, les données disparaissent au rechargement ; elle assure sauvegarde durable,
  partage multi-utilisateurs et continuité.
- Approches full stack : REST (client ↔ API ↔ BD), GraphQL, **Server Actions** (logique
  intégrée côté serveur, Next.js 15+).
- **Server Action** : fonction asynchrone exécutée côté serveur pour les soumissions de
  formulaires et les mutations. Avantages : sécurité (pas de clé exposée), simplicité (pas
  d'API routes séparées), performance (moins d'allers-retours).
- Deux déclarations : au niveau du module (`"use server"` en tête de fichier) ou inline dans
  une fonction.

```ts
"use server";
export async function addUser(formData: FormData) {
  // runs on the server only
}
```

```ts
async function createUser(formData: FormData) {
  "use server";
  const name = formData.get("name");
}
```

- Formulaires : `<form action={serverAction}>` envoie directement ses `FormData`, pas besoin
  de `useState` pour les champs.

```tsx
"use client";
const { pending } = useFormStatus();
<button disabled={pending}>Ajouter</button>;
```

- MongoDB : base NoSQL orientée documents (JSON), évolutive (Atlas), intégration JavaScript.
  Paquet : `mongoose`.

```ts
// lib/db.ts
import mongoose from "mongoose";

let isConnected = false; // éviter les connexions multiples

export async function connectDB() {
  if (isConnected) return;
  try {
    const db = await mongoose.connect("mongodb://127.0.0.1:27017/myDatabase");
    isConnected = true;
    console.log("Connecté à MongoDB :", db.connection.name);
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
  }
}
```

⚠ Dans le projet : URL lue depuis `process.env.MONGODB_URI`, pas d'options obsolètes
(`useNewUrlParser`, `useUnifiedTopology`) ni de `as any`.

```ts
// models/Task.schema.ts
import mongoose, { Schema, models } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
});

export const Task = models.Task || mongoose.model("Task", TaskSchema);
```

```ts
// app/actions/Task.ts
"use server";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";

export async function addTask(formData: FormData) {
  await connectDB();
  const title = formData.get("title")?.toString();
  if (!title) throw new Error("Le titre est requis");
  await Task.create({ title });
}
```
