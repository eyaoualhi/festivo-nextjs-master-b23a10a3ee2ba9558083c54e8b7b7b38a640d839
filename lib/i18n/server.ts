import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import ar from "./dictionaries/ar";
import en from "./dictionaries/en";
import fr, { type Dictionary } from "./dictionaries/fr";

const dictionaries: Record<Locale, Dictionary> = { fr, en, ar };

/** Langue de la page en cours, lue dans le segment `[lang]` de l'URL. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

/** Langue et dictionnaire de la page en cours. */
export async function getI18n(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}

export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}
