"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type SavedPage = { path: string; title: string };

type SavedPagesProps = {
  locale: string;
  labels: { title: string; none: string };
};

const MAX_LISTED = 24;

/** Pages enregistrées par le Service Worker (`festivo-pages-*`) pour la langue courante. */
async function readSavedPages(locale: string): Promise<SavedPage[]> {
  if (!("caches" in window)) return [];
  const names = (await caches.keys()).filter((name) => name.startsWith("festivo-pages-"));
  const excluded = new Set([`/${locale}`, `/${locale}/hors-ligne`]);
  const pages = new Map<string, SavedPage>();

  for (const name of names) {
    const cache = await caches.open(name);
    for (const request of await cache.keys()) {
      const url = new URL(request.url);
      const path = url.pathname + url.search;
      if (!url.pathname.startsWith(`/${locale}/`) || excluded.has(url.pathname)) continue;
      if (pages.has(path) || pages.size >= MAX_LISTED) continue;
      const html = (await (await cache.match(request))?.text()) ?? "";
      const title = new DOMParser().parseFromString(html, "text/html").title;
      pages.set(path, { path, title: title.replace(/\s*\|\s*Festivo$/, "") || path });
    }
  }
  return [...pages.values()];
}

export default function SavedPages({ locale, labels }: SavedPagesProps) {
  const [pages, setPages] = useState<SavedPage[] | null>(null);

  useEffect(() => {
    let active = true;
    readSavedPages(locale)
      .catch(() => [])
      .then((result) => {
        if (active) setPages(result);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  if (pages === null) return null;

  return (
    <section aria-labelledby="saved-pages" className="w-full text-start">
      <h2 id="saved-pages" className="text-lg font-bold text-ink">
        {labels.title}
      </h2>
      {pages.length === 0 ? (
        <p className="mt-3 text-muted">{labels.none}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {pages.map((page) => (
            <li key={page.path}>
              {/* Lien classique : hors ligne, seule une navigation complète passe par le cache. */}
              <a
                href={page.path}
                className="flex min-h-12 items-center justify-between gap-4 py-3 font-medium text-ink transition-colors hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="truncate">{page.title}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 rtl:-scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
