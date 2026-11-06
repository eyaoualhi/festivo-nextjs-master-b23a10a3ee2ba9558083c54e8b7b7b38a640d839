import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import RetryButton from "./_components/RetryButton";
import SavedPages from "./_components/SavedPages";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.offline.metaTitle,
    description: dict.offline.description,
    robots: { index: false },
  };
}

/** Page servie par le Service Worker quand une page demandée n'est pas en cache (D-27). */
export default async function OfflinePage() {
  const { locale, dict } = await getI18n();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
      <span className="flex size-16 items-center justify-center bg-band text-paper">
        <WifiOff aria-hidden="true" className="size-7" />
      </span>
      <h1 className="text-step-head font-extrabold tracking-tight text-ink">
        {dict.offline.title}
      </h1>
      <p className="text-step-lead text-muted">{dict.offline.description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <RetryButton label={dict.offline.retry} />
        <ButtonLink href={localizePath(locale, "/")} variant="secondary">
          {dict.offline.home}
        </ButtonLink>
      </div>
      <div className="mt-6 w-full">
        <SavedPages
          locale={locale}
          labels={{ title: dict.offline.savedTitle, none: dict.offline.savedNone }}
        />
      </div>
    </div>
  );
}
