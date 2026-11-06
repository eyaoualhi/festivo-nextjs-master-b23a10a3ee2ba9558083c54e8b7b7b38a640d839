import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

export type NavLink = {
  href: string;
  label: string;
};

const sitePaths = [
  { path: "/evenements", key: "explore" },
  { path: "/#categories", key: "categories" },
  { path: "/#evenements", key: "agenda" },
  { path: "/#etapes", key: "steps" },
  { path: "/#faq", key: "faq" },
] as const;

export function getSiteLinks(locale: Locale, dict: Dictionary): NavLink[] {
  return sitePaths.map(({ path, key }) => ({
    href: localizePath(locale, path),
    label: dict.nav[key],
  }));
}
