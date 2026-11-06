import { Suspense } from "react";
import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import Alert from "@/components/ui/Alert";
import FormHeading from "@/components/ui/FormHeading";
import TextLink from "@/components/ui/TextLink";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import ResetPasswordForm from "./ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  // Le jeton est dans l'adresse : elle ne doit être ni indexée ni transmise à un autre site.
  return { title: dict.auth.reset.metaTitle, robots: { index: false }, referrer: "no-referrer" };
}

type SearchParams = PageProps<"/[lang]/reinitialiser-mot-de-passe">["searchParams"];

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/[lang]/reinitialiser-mot-de-passe">) {
  const { locale, dict } = await getI18n();

  return (
    <div className="flex flex-col gap-8">
      <FormHeading
        icon={LockKeyhole}
        title={dict.auth.reset.title}
        description={dict.auth.reset.description}
      />
      <Suspense
        fallback={<div aria-busy="true" className="h-96 animate-pulse rounded-3xl bg-surface" />}
      >
        <ResetContent locale={locale} t={dict.auth} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ResetContent({
  locale,
  t,
  searchParams,
}: {
  locale: Locale;
  t: Dictionary["auth"];
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token.trim() : "";

  if (!value) {
    return (
      <Alert tone="error" title={t.reset.failedTitle}>
        {t.errors.resetInvalid}{" "}
        <TextLink href={localizePath(locale, "/mot-de-passe-oublie")}>
          {t.reset.requestNew}
        </TextLink>
      </Alert>
    );
  }
  return <ResetPasswordForm locale={locale} token={value} t={t} />;
}
