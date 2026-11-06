"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Languages } from "lucide-react";
import Dropdown, { dropdownItemClasses } from "@/components/ui/Dropdown";
import { LOCALE_COOKIE, localeInfo, locales, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
};

type LanguageLinksProps = {
  locale: Locale;
  close: () => void;
  /** Sans adresse connue, chaque lien mène à l'accueil de la langue. */
  pathname?: string;
};

function pathFor(pathname: string, target: Locale): string {
  const [, , ...rest] = pathname.split("/");
  return `/${[target, ...rest].join("/")}`.replace(/\/$/, "");
}

function LanguageLinks({ locale, close, pathname }: LanguageLinksProps) {
  return (
    <ul className="flex flex-col">
      {locales.map((target) => (
        <li key={target}>
          <Link
            href={pathname ? pathFor(pathname, target) : `/${target}`}
            hrefLang={localeInfo[target].htmlLang}
            lang={localeInfo[target].htmlLang}
            aria-current={target === locale ? "true" : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
              close();
            }}
            className={dropdownItemClasses}
          >
            <span className="w-8 text-xs font-bold text-muted">
              {localeInfo[target].shortLabel}
            </span>
            <span className="flex-1">{localeInfo[target].label}</span>
            {target === locale && <Check aria-hidden="true" className="size-4 text-primary" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CurrentPageLinks(props: Omit<LanguageLinksProps, "pathname">) {
  return <LanguageLinks {...props} pathname={usePathname()} />;
}

export default function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  return (
    <Dropdown
      label={`${label} (${localeInfo[locale].label})`}
      trigger={
        <>
          <Languages aria-hidden="true" className="size-4" />
          <span className="text-xs">{localeInfo[locale].shortLabel}</span>
        </>
      }
    >
      {(close) => (
        // L'adresse d'une page dynamique n'est connue qu'à la requête (Cache Components).
        <Suspense fallback={<LanguageLinks locale={locale} close={close} />}>
          <CurrentPageLinks locale={locale} close={close} />
        </Suspense>
      )}
    </Dropdown>
  );
}
