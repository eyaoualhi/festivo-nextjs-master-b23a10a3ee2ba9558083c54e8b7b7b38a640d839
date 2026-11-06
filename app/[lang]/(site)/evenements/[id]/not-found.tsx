import { CalendarX2 } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

export default async function EventNotFound() {
  const { locale, dict } = await getI18n();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-surface text-muted">
        <CalendarX2 aria-hidden="true" className="size-8" />
      </span>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {dict.event.notFoundTitle}
      </h1>
      <p className="text-muted">{dict.event.notFoundText}</p>
      <ButtonLink href={localizePath(locale, "/evenements")}>{dict.event.notFoundCta}</ButtonLink>
    </div>
  );
}
