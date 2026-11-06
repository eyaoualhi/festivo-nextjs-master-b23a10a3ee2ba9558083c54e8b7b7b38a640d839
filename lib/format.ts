import { localeInfo, type Locale } from "@/lib/i18n/config";

const timeZone = "Africa/Tunis";

function formatter(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(localeInfo[locale].intl, { ...options, timeZone });
}

export function formatDay(locale: Locale, date: Date): string {
  return formatter(locale, { day: "numeric" }).format(date);
}

export function formatMonthShort(locale: Locale, date: Date): string {
  return formatter(locale, { month: "short" }).format(date).replace(".", "").toUpperCase();
}

export function formatShortDate(locale: Locale, date: Date): string {
  return formatter(locale, { weekday: "short", day: "numeric", month: "short" }).format(date);
}

export function formatDayMonth(locale: Locale, date: Date): string {
  return formatter(locale, { day: "numeric", month: "long" }).format(date);
}

export function formatLongDate(locale: Locale, date: Date): string {
  return formatter(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(locale: Locale, date: Date): string {
  return formatter(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date);
}

export function formatMonthLabel(locale: Locale, date: Date): string {
  const label = formatter(locale, { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeInfo[locale].intl).format(value);
}

/** Clé « AAAA-MM » utilisée par le filtre par mois, identique dans toutes les langues. */
export function getMonthKey(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", timeZone })
    .format(date)
    .slice(0, 7);
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^\p{Lu}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
