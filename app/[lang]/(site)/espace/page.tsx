import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dashboardPath, requireUser } from "@/lib/dal";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import SpaceSkeleton from "./_components/SpaceSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.nav };
}

/** « Mon espace » mène au tableau de bord du rôle de l'utilisateur (BF-01, D-29). */
export default async function SpacePage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <RedirectToDashboard />
    </Suspense>
  );
}

async function RedirectToDashboard(): Promise<never> {
  const { locale } = await getI18n();
  const user = await requireUser(locale);
  redirect(dashboardPath(locale, user.role));
}
