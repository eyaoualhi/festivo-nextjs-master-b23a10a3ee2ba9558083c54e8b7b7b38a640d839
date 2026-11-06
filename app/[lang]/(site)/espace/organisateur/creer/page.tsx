import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";
import { requireUser } from "@/lib/dal";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import CreateEventForm from "./CreateEventForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Créer un événement · Festivo" };
}

export default async function CreateEventPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <CreateEventContent />
    </Suspense>
  );
}

async function CreateEventContent() {
  const { locale } = await getI18n();
  const user = await requireUser(locale);

  if (user.role !== "organisateur" && user.role !== "administrateur") {
    redirect(localizePath(locale, "/espace/participant"));
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <Link
        href={localizePath(locale, "/espace/organisateur")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        Retour à l&apos;espace organisateur
      </Link>

      <header className="flex flex-col gap-2">
        <h1 className="text-step-head font-extrabold tracking-tight text-ink">
          Créer un événement
        </h1>
        <p className="text-step-lead text-muted">
          Remplissez les détails ci-dessous pour publier votre événement sur Festivo ou
          l&apos;enregistrer en brouillon.
        </p>
      </header>

      <CreateEventForm locale={locale} />
    </div>
  );
}
