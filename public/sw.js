/*
 * Service Worker de Festivo (cours ch. 3, règle 40-pwa, décision D-27).
 *
 * - Coquille (fichiers `/_next/static`, icônes, manifest) : Cache First.
 * - Pages : Network First, la version enregistrée en secours, puis la page « hors ligne ».
 *   Les pages de l'espace personnel ne sont jamais enregistrées.
 * - Images : Stale-While-Revalidate.
 * - Tout le reste (POST, Server Actions, données de navigation RSC, autres origines) : réseau
 *   uniquement, jamais mis en cache.
 *
 * Toute modification de ce fichier doit changer `VERSION`, pour que les anciens caches soient
 * supprimés à l'activation.
 */
const VERSION = "v2";
const SHELL_CACHE = `festivo-shell-${VERSION}`;
const PAGES_CACHE = `festivo-pages-${VERSION}`;
const IMAGES_CACHE = `festivo-images-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, PAGES_CACHE, IMAGES_CACHE];

const LOCALES = ["fr", "en", "ar"];
const DEFAULT_LOCALE = "fr";
const OFFLINE_SEGMENT = "hors-ligne";
const NETWORK_TIMEOUT_MS = 4000;
const MAX_PAGES = 60;
const MAX_IMAGES = 120;

const SHELL_FILES = [
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png",
];

/** Accueil et page « hors ligne » de chaque langue, enregistrés dès l'installation. */
const PRECACHED_PAGES = LOCALES.flatMap((locale) => [
  `/${locale}`,
  `/${locale}/${OFFLINE_SEGMENT}`,
]);

/** Adresses jamais enregistrées, même en GET. */
const NEVER_CACHED = ["/api/"];
/** Pages personnelles (`/{langue}/espace/*`) : elles contiennent les données du compte (D-30). */
const PRIVATE_SEGMENT = "espace";

function isCacheable(pathname) {
  if (NEVER_CACHED.some((prefix) => pathname.startsWith(prefix))) return false;
  return pathname.split("/")[2] !== PRIVATE_SEGMENT;
}

function preferredLocale(pathname) {
  const segment = pathname.split("/")[1];
  if (LOCALES.includes(segment)) return segment;
  const language = (self.navigator.language || "").slice(0, 2).toLowerCase();
  return LOCALES.includes(language) ? language : DEFAULT_LOCALE;
}

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/") || SHELL_FILES.includes(url.pathname);
}

function isImage(request, url) {
  return (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/")
  );
}

/** Supprime les entrées les plus anciennes au-delà de `maxEntries`, sauf celles de `keep`. */
async function trimCache(name, maxEntries, keep = []) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const overflow = keys.length - maxEntries;
  if (overflow <= 0) return;
  const removable = keys.filter((request) => !keep.includes(new URL(request.url).pathname));
  await Promise.all(removable.slice(0, overflow).map((request) => cache.delete(request)));
}

/** Enregistre une page et les fichiers `/_next/static` qu'elle référence (CSS, JS, polices). */
async function precachePage(path, pages, shell) {
  const response = await fetch(path, { cache: "reload" });
  if (!response.ok) return;
  const html = await response.clone().text();
  await pages.put(path, response);
  const assets = new Set(html.match(/\/_next\/static\/[^"'\s\\)]+/g) || []);
  await Promise.allSettled([...assets].map((asset) => shell.add(asset)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL_CACHE);
      await shell.addAll(SHELL_FILES);
      const pages = await caches.open(PAGES_CACHE);
      await Promise.allSettled(PRECACHED_PAGES.map((path) => precachePage(path, pages, shell)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("festivo-") && !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(IMAGES_CACHE);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(event.request, response.clone());
        await trimCache(IMAGES_CACHE, MAX_IMAGES);
      }
      return response;
    })
    .catch(() => undefined);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || Response.error();
}

async function offlinePage(pathname) {
  const pages = await caches.open(PAGES_CACHE);
  const locale = preferredLocale(pathname);
  const fallback =
    (await pages.match(`/${locale}/${OFFLINE_SEGMENT}`)) ||
    (await pages.match(`/${DEFAULT_LOCALE}/${OFFLINE_SEGMENT}`));
  return (
    fallback ||
    new Response("Festivo : hors ligne.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  );
}

async function cachedPage(pages, url) {
  const exact = await pages.match(url.pathname + url.search);
  if (exact || url.pathname !== "/") return exact;
  // `/` redirige vers une langue en ligne ; hors ligne, on sert l'accueil enregistré.
  return pages.match(`/${preferredLocale(url.pathname)}`);
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function networkFirst(request) {
  const url = new URL(request.url);
  const pages = await caches.open(PAGES_CACHE);
  const cacheable = isCacheable(url.pathname);

  const network = fetch(request).then(async (response) => {
    if (cacheable && response.ok && response.type === "basic") {
      await pages.put(url.pathname + url.search, response.clone());
      await trimCache(PAGES_CACHE, MAX_PAGES, PRECACHED_PAGES);
    }
    return response;
  });

  try {
    return await Promise.race([network, timeout(NETWORK_TIMEOUT_MS)]);
  } catch {
    // Réseau coupé ou trop lent : la page enregistrée si elle existe, sinon on attend encore
    // le réseau, et en dernier recours la page « hors ligne ».
    const cached = cacheable ? await cachedPage(pages, url) : undefined;
    if (cached) return cached;
    try {
      return await network;
    } catch {
      return offlinePage(url.pathname);
    }
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Données de navigation de Next.js (RSC) : en cas d'échec, Next.js recharge la page entière,
  // qui passe alors par la stratégie des pages ci-dessous.
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isImage(request, url)) {
    event.respondWith(staleWhileRevalidate(event));
  }
});
