import type { Metadata } from "next";
import LogoutButton from "@/components/layout/LogoutButton";
import { getI18n } from "@/lib/i18n/server";
import SpaceTabs from "./_components/SpaceTabs";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Coquille de l'espace personnel : statique, sans lecture de session. Chaque page lit
 * l'utilisateur sous un `<Suspense>` et vérifie son rôle (D-30).
 */
export default async function SpaceLayout({ children }: LayoutProps<"/[lang]/espace">) {
  const { locale, dict } = await getI18n();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-6 pb-16 md:px-10 md:pt-10 lg:pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SpaceTabs
          locale={locale}
          labels={{
            navigation: dict.dashboard.tabs,
            overview: dict.dashboard.overview,
            profile: dict.dashboard.profile,
            admin: dict.dashboard.admin.metaTitle,
          }}
        />
        <LogoutButton locale={locale} label={dict.nav.logout} className="hidden sm:inline-flex" />
      </div>
      {children}
      <LogoutButton
        locale={locale}
        label={dict.nav.logout}
        variant="secondary"
        className="w-full sm:hidden"
      />
    </div>
  );
}
