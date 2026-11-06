import { Suspense } from "react";
import BottomNav from "@/components/layout/BottomNav";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getI18n } from "@/lib/i18n/server";

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await getI18n();

  return (
    <>
      <div className="flex flex-1 flex-col pb-16 md:pb-0">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </div>
      {/* L'adresse d'une fiche d'événement n'est connue qu'à la requête (D-33) : la barre,
          masquée sur ces fiches, n'a donc rien à afficher pendant le prérendu. */}
      <Suspense fallback={null}>
        <BottomNav
          locale={locale}
          labels={{
            navigation: dict.nav.mainNav,
            home: dict.nav.home,
            explore: dict.nav.explore,
            account: dict.nav.account,
          }}
        />
      </Suspense>
    </>
  );
}
