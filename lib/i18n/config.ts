export const locales = ["fr", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** Cookie qui mémorise la langue choisie dans le sélecteur. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

type LocaleInfo = {
  /** Valeur de l'attribut `lang` de `<html>`. */
  htmlLang: string;
  dir: "ltr" | "rtl";
  /** Locale passée à `Intl` pour les dates et les nombres. */
  intl: string;
  /** Nom de la langue dans cette langue. */
  label: string;
  shortLabel: string;
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  fr: { htmlLang: "fr", dir: "ltr", intl: "fr-FR", label: "Français", shortLabel: "FR" },
  en: { htmlLang: "en", dir: "ltr", intl: "en-GB", label: "English", shortLabel: "EN" },
  ar: { htmlLang: "ar-TN", dir: "rtl", intl: "ar-TN", label: "تونسي", shortLabel: "عربي" },
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

/** Préfixe un chemin interne par la langue : `localizePath("en", "/evenements")`. */
export function localizePath(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Remplace `{nom}` par la valeur correspondante. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Déclare un message pluriel ; chaque langue fournit les formes dont elle a besoin. */
export function pluralForms(forms: PluralForms): PluralForms {
  return forms;
}

/** Choisit la forme plurielle selon les règles de la langue, puis insère `{n}`. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const { intl } = localeInfo[locale];
  const rule = new Intl.PluralRules(intl).select(count);
  return interpolate(forms[rule] ?? forms.other, { n: new Intl.NumberFormat(intl).format(count) });
}
