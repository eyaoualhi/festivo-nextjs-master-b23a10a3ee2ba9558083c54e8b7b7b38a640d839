import Link from "next/link";
import AccountMenu from "@/components/layout/AccountMenu";
import InstallButton from "@/components/layout/InstallButton";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { getSiteLinks } from "@/components/layout/navigation";
import PreferenceControls from "@/components/layout/PreferenceControls";
import { getI18n } from "@/lib/i18n/server";

export default async function SiteHeader() {
  const { locale, dict } = await getI18n();
  const links = getSiteLinks(locale, dict);

  return (
    <header className="sticky top-0 z-30 bg-canvas">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-3 px-4 md:px-8">
        <Logo />
        <nav aria-label={dict.nav.siteNav} className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-ink transition-colors hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <InstallButton label={dict.nav.install} shortLabel={dict.nav.installShort} />
          <PreferenceControls />
          <AccountMenu
            locale={locale}
            labels={{
              login: dict.nav.login,
              register: dict.nav.register,
              space: dict.nav.space,
              logout: dict.nav.logout,
            }}
            quietVariant="ghost"
            className="hidden min-w-52 items-center justify-end gap-2 sm:flex"
          />
          <MobileMenu
            locale={locale}
            links={links}
            labels={{
              navigation: dict.nav.siteNav,
              open: dict.nav.openMenu,
              close: dict.nav.closeMenu,
            }}
            accountLabels={{
              login: dict.nav.loginShort,
              register: dict.nav.registerShort,
              space: dict.nav.space,
              logout: dict.nav.logout,
            }}
          />
        </div>
      </div>
    </header>
  );
}
